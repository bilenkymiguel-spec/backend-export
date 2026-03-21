import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// TESTE
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// LISTAR PRODUTOS
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// SALVAR USUÁRIO (LOGIN + WHATSAPP)
app.post("/products/users", async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        ...(phone && { phone }),
      },
      create: {
        email,
        name,
        phone,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar usuário" });
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});