// backend/src/routes/webhook.ts

import { Router } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";

const router = Router();

/**
 * IMPORTANTE:
 * - Esse endpoint NÃO pode usar express.json()
 * - O body precisa ser RAW
 */
router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Assinatura do Stripe não encontrada");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("❌ Erro na verificação do webhook:", err);
    return res.status(400).send("Webhook inválido");
  }

  try {
    switch (event.type) {
      /**
       * ✅ PAGAMENTO CONCLUÍDO
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("💰 Pagamento confirmado:", {
          id: session.id,
          email: session.customer_details?.email,
          amount: session.amount_total,
          currency: session.currency,
        });

        // 👉 Aqui você pode:
        // - salvar pedido no banco
        // - enviar email
        // - liberar acesso
        // - marcar como exportado

        break;
      }

      /**
       * ❌ PAGAMENTO FALHOU
       */
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("❌ Pagamento falhou:", {
          id: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message,
        });

        break;
      }

      /**
       * 💸 REEMBOLSO
       */
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        console.log("🔁 Reembolso realizado:", {
          id: charge.id,
          amount: charge.amount_refunded,
        });

        break;
      }

      /**
       * 🔄 OUTROS EVENTOS
       */
      default:
        console.log(`🔔 Evento não tratado: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("❌ Erro interno no webhook:", error);
    return res.status(500).json({ error: "Erro no webhook" });
  }
});

export default router;