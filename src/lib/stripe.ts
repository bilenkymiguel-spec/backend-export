// backend/src/lib/stripe.ts

import Stripe from "stripe";

/**
 * Carrega a chave secreta do ambiente
 */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "❌ STRIPE_SECRET_KEY não definida no arquivo .env do backend"
  );
}

/**
 * Instância do Stripe
 *
 * OBS:
 * - NÃO fixamos apiVersion para evitar erro de tipagem
 * - Stripe usa automaticamente a versão da conta
 */
export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});

/**
 * Função opcional (boa prática)
 * Cria sessão de checkout reutilizável
 */
export async function createCheckoutSession({
  line_items,
  success_url,
  cancel_url,
}: {
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
  success_url: string;
  cancel_url: string;
}) {
  return await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url,
    cancel_url,
  });
}