const express = require("express");
const router = express.Router();

const users = [];

router.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = {
      id: Date.now(),
      email,
      name: name || "",
      createdAt: new Date(),
    };

    users.push(newUser);

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

module.exports = router;