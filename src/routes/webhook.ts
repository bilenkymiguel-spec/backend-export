import express, { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";

const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).send("Assinatura Stripe ausente.");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error) {
      console.error("Erro ao validar assinatura do webhook:", error);
      return res.status(400).send("Webhook inválido.");
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;

          console.log("checkout.session.completed", {
            sessionId: session.id,
            customerEmail: session.customer_details?.email ?? null,
            amountTotal: session.amount_total ?? 0,
            currency: session.currency ?? null,
            paymentStatus: session.payment_status ?? null,
          });

          break;
        }

        case "checkout.session.async_payment_succeeded": {
          const session = event.data.object as Stripe.Checkout.Session;

          console.log("checkout.session.async_payment_succeeded", {
            sessionId: session.id,
            paymentStatus: session.payment_status ?? null,
          });

          break;
        }

        case "checkout.session.async_payment_failed": {
          const session = event.data.object as Stripe.Checkout.Session;

          console.log("checkout.session.async_payment_failed", {
            sessionId: session.id,
            paymentStatus: session.payment_status ?? null,
          });

          break;
        }

        default:
          console.log(`Evento não tratado: ${event.type}`);
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return res.status(500).send("Erro interno no processamento do webhook.");
    }
  }
);

export default router;