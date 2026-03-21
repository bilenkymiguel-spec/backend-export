import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import checkoutRoutes from "./src/routes/checkout.ts";
import webhookRoutes from "./src/routes/webhook.ts";

dotenv.config();

const app = express();

app.use(cors());

app.use("/webhook", webhookRoutes);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API rodando.");
});

app.use("/checkout", checkoutRoutes);

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});