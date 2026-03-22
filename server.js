const express = require("express");
const cors = require("cors");

const app = express();

// 🚨 ESSA LINHA É CRÍTICA PARA O RAILWAY
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulação simples de pedidos (em memória)
let orders = [];

// Rota raiz
app.get("/", (req, res) => {
  res.send("api rodando");
});

// Rota GET pedidos
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Rota POST pedidos
app.post("/orders", (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    createdAt: new Date().toISOString(),
    status: "pending",
    items: req.body?.items || [],
    buyer: req.body?.buyer || {},
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

// 🚀 START DO SERVIDOR
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});