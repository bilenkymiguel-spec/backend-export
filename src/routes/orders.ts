// backend/src/routes/orders.ts

import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json([
    {
      id: 1,
      createdAt: new Date().toISOString(),
      status: "pending",
      buyer: {
        name: "Miguel Machado Bilenky",
        email: "miguel@email.com",
        country: "Brasil",
        phone: "16991977845",
      },
      items: [
        {
          id: 101,
          name: "Bolsa de Couro Premium",
          price: 1290,
          category: "accessories",
          quantity: 1,
          exportScore: 95,
        },
      ],
    },
  ]);
});

export default router;