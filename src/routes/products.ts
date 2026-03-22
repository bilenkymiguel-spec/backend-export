// backend/src/routes/products.ts

import { Router } from "express";
import mockDb from "../data/mockDb";

const router = Router();

// GET todos produtos
router.get("/", (req, res) => {
  res.json(mockDb.productRecords);
});

// GET produto por ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = mockDb.productRecords.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  res.json(product);
});

export default router;