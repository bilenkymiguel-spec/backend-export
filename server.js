const express = require("express");
const cors = require("cors");

const app = express();

// Porta do Railway
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Óculos Premium Brasil",
    slug: "oculos-premium-brasil",
    price: 350,
    currency: "BRL",
    image: "",
    category: "óculos",
    description: "Óculos premium brasileiro com design sofisticado.",
    exportScore: 90,
  },
  {
    id: 2,
    name: "Camisa Premium Brasileira",
    slug: "camisa-premium-brasileira",
    price: 280,
    currency: "BRL",
    image: "",
    category: "roupa",
    description: "Camisa premium brasileira com acabamento refinado.",
    exportScore: 88,
  },
];

// Simulação simples de pedidos em memória
let orders = [];

// Rota raiz
app.get("/", (req, res) => {
  res.send("api rodando");
});

// Rota GET produtos
app.get("/products", (req, res) => {
  res.json(products);
});

// Rota GET produto por slug
app.get("/products/:slug", (req, res) => {
  const product = products.find((item) => item.slug === req.params.slug);

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  res.json(product);
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
    notes: req.body?.notes || "",
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

// Start do servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});