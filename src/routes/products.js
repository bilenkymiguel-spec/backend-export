import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req,res)=> res.json(await prisma.product.findMany()));

router.post("/users", async (req,res)=> {
  const { email, name } = req.body;
  const user = await prisma.user.upsert({
    where:{ email },
    update:{ name },
    create:{ email, name }
  });
  res.json(user);
});

export default router;