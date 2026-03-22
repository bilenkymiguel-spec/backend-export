import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

type OrderItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  exportScore?: number;
};

type Order = {
  id: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
  buyer: {
    company?: string;
    name?: string;
    email: string;
    country: string;
    phone?: string;
    contactMethod?: string;
  };
  notes?: string;
  items: OrderItem[];
};

const orders: Order[] = [];

app.get("/", (_req, res) => {
  res.send("api rodando");
});

app.get("/orders", (_req, res) => {
  res.json(orders);
});

app.post("/orders", (req, res) => {
  const newOrder: Order = {
    id: orders.length ? orders[orders.length - 1].id + 1 : 1,
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
  res.status(201).json(newOrder);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});