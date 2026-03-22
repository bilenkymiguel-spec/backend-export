// backend/src/server.ts

import express from "express";
import cors from "cors";

import productsRoutes from "./routes/products";
import governanceRoutes from "./routes/governance";
import pageRoutes from "./routes/page";
import checkoutRoutes from "./routes/checkout";
import webhookRoutes from "./routes/webhook";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());

app.use("/webhook", webhookRoutes);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "D'OUTRO LADO API",
    status: "ok",
    port: PORT,
  });
});

app.use("/products", productsRoutes);
app.use("/governance", governanceRoutes);
app.use("/pages", pageRoutes);
app.use("/checkout", checkoutRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});