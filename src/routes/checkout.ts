// backend/src/routes/checkout.ts

import { Router } from "express";
import type Stripe from "stripe";
import mockDb from "../data/mockDb";
import { createCheckoutSession } from "../lib/stripe";

const router = Router();

type CheckoutItemInput = {
  id: number;
  quantity: number;
};

type CheckoutBody = {
  items?: CheckoutItemInput[];
  currency?: string;
};

function normalizeCurrency(currency?: string) {
  return (currency || "eur").toLowerCase();
}

router.post("/", async (req, res) => {
  try {
    const { items, currency }: CheckoutBody = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Nenhum item enviado para o checkout.",
      });
    }

    const normalizedCurrency = normalizeCurrency(currency);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => {
        const product = mockDb.productRecords.find((p) => p.id === item.id);

        if (!product) {
          throw new Error(`Produto não encontrado: ${item.id}`);
        }

        if (!item.quantity || item.quantity < 1) {
          throw new Error(`Quantidade inválida para o produto ${item.id}`);
        }

        return {
          quantity: item.quantity,
          price_data: {
            currency: normalizedCurrency,
            product_data: {
              name: product.name,
              description: product.description,
              images: product.images,
            },
            unit_amount: Math.round(product.price * 100),
          },
        };
      }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      line_items,
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
    });

    if (!session.url) {
      return res.status(500).json({
        error: "Não foi possível gerar a URL do checkout.",
      });
    }

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);

    const message =
      error instanceof Error ? error.message : "Erro interno no checkout.";

    return res.status(500).json({
      error: message,
    });
  }
});

export default router;