const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let orders = [];

app.get("/", (req, res) => {
  res.send("api rodando");
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    createdAt: new Date().toISOString(),
    status: "pending",
    items: req.body?.items || [],
  };

  orders.push(newOrder);
  res.json(newOrder);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta", PORT);
});