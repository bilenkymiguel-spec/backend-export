const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ordersFilePath = path.join(__dirname, "orders.json");

function readOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, "[]", "utf-8");
      return [];
    }

    const raw = fs.readFileSync(ordersFilePath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (error) {
    console.error("Erro ao ler orders.json:", error);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar orders.json:", error);
  }
}

app.get("/", (_req, res) => {
  res.send("api rodando");
});

app.get("/orders", (_req, res) => {
  const orders = readOrders();
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const orders = readOrders();

  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map((order) => order.id || 0)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: req.body?.status || "pending",
    buyer: req.body?.buyer || {
      email: "",
      country: "",
    },
    notes: req.body?.notes || "",
    items: Array.isArray(req.body?.items) ? req.body.items : [],
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.status(201).json(newOrder);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});