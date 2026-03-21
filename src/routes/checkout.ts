import express, { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";

const router = express.Router();

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  try {
    const { items, currency } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Itens inválidos para checkout." });
    }

    const normalizedCurrency =
      typeof currency === "string" && currency.trim()
        ? currency.toLowerCase()
        : "usd";

    const paymentMethods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
      normalizedCurrency === "brl" ? ["card", "boleto"] : ["card"];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods,
      mode: "payment",
      line_items: items.map((item: any) => ({
        price_data: {
          currency: normalizedCurrency,
          product_data: {
            name: String(item.name || "Produto"),
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity) || 1,
      })),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Erro ao criar sessão do Stripe:", error);
    return res.status(500).json({ error: "Erro ao criar sessão de checkout." });
  }
});

export default router;