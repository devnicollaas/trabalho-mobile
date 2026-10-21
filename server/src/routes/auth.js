const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const exigirLogin = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

function criarToken(usuario) {
  return jwt.sign({ sub: usuario._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function dadosPublicos(usuario) {
  return {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
  };
}

router.post(
  "/registrar",
  asyncHandler(async (req, res) => {
    const nome = String(req.body.nome || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const senha = String(req.body.senha || "");

    if (nome.length < 2 || nome.length > 80) {
      return res.status(400).json({ message: "Informe um nome com 2 a 80 caracteres." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Informe um e-mail válido." });
    }
    if (senha.length < 6) {
      return res.status(400).json({ message: "A senha precisa ter pelo menos 6 caracteres." });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "Este e-mail já está cadastrado." });
    }

    const usuario = await User.create({
      nome,
      email,
      senhaHash: await bcrypt.hash(senha, 10),
    });
    return res.status(201).json({
      token: criarToken(usuario),
      usuario: dadosPublicos(usuario),
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const senha = String(req.body.senha || "");
    const usuario = await User.findOne({ email }).select("+senhaHash");

    if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }
    return res.json({
      token: criarToken(usuario),
      usuario: dadosPublicos(usuario),
    });
  })
);

router.get(
  "/me",
  exigirLogin,
  asyncHandler(async (req, res) => res.json({ usuario: dadosPublicos(req.usuario) }))
);

router.patch(
  "/me",
  exigirLogin,
  asyncHandler(async (req, res) => {
    const nome = String(req.body.nome || "").trim();
    if (nome.length < 2 || nome.length > 80) {
      return res.status(400).json({ message: "Informe um nome com 2 a 80 caracteres." });
    }
    req.usuario.nome = nome;
    await req.usuario.save();
    return res.json({ usuario: dadosPublicos(req.usuario) });
  })
);

module.exports = router;
