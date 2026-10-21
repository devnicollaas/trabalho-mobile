const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Content = require("../models/Content");
const exigirLogin = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { apagarImagem, pastaUploads } = require("../utils/images");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, pastaUploads),
  filename: (_req, file, callback) => {
    const extensoes = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    const extensao = extensoes[file.mimetype] || ".jpg";
    callback(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + extensao);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(new Error("Envie uma imagem JPEG, PNG ou WebP."));
    }
    return callback(null, true);
  },
});

function camposDoFormulario(body) {
  return {
    titulo: String(body.titulo || "").trim(),
    subtitulo: String(body.subtitulo || "").trim(),
    descricao: String(body.descricao || "").trim(),
    categoria: String(body.categoria || "Séries").trim(),
  };
}

function validarTitulo(titulo, res) {
  if (!titulo || titulo.length > 120) {
    res.status(400).json({ message: "O título é obrigatório (até 120 caracteres)." });
    return false;
  }
  return true;
}

function regexSeguro(termo) {
  const caracteresEspeciais = "\\^$.*+?()[]{}|";
  const escapado = termo
    .split("")
    .map((caractere) =>
      caracteresEspeciais.includes(caractere) ? "\\" + caractere : caractere
    )
    .join("");
  return new RegExp(escapado, "i");
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filtro = {};
    const termo = String(req.query.q || "").trim();
    const categoria = String(req.query.categoria || "").trim();

    if (termo) {
      const busca = regexSeguro(termo);
      filtro.$or = [
        { titulo: busca },
        { subtitulo: busca },
        { descricao: busca },
        { categoria: busca },
      ];
    }
    if (categoria && categoria !== "Todos") filtro.categoria = categoria;

    const conteudos = await Content.find(filtro).sort({ createdAt: -1 });
    return res.json({ conteudos });
  })
);

router.post(
  "/",
  exigirLogin,
  upload.single("imagem"),
  asyncHandler(async (req, res) => {
    const campos = camposDoFormulario(req.body);
    if (!validarTitulo(campos.titulo, res)) {
      if (req.file) await apagarImagem("/uploads/" + req.file.filename);
      return;
    }

    const conteudo = await Content.create({
      ...campos,
      imagem: req.file ? "/uploads/" + req.file.filename : "",
      criadoPor: req.usuario._id,
    });
    return res.status(201).json({ conteudo });
  })
);

router.patch(
  "/:id",
  exigirLogin,
  upload.single("imagem"),
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      if (req.file) await apagarImagem("/uploads/" + req.file.filename);
      return res.status(400).json({ message: "Identificador inválido." });
    }
    const conteudo = await Content.findById(req.params.id);
    if (!conteudo) {
      if (req.file) await apagarImagem("/uploads/" + req.file.filename);
      return res.status(404).json({ message: "Conteúdo não encontrado." });
    }

    const campos = camposDoFormulario(req.body);
    if (!validarTitulo(campos.titulo, res)) {
      if (req.file) await apagarImagem("/uploads/" + req.file.filename);
      return;
    }

    const imagemAntiga = conteudo.imagem;
    Object.assign(conteudo, campos);
    if (req.file) conteudo.imagem = "/uploads/" + req.file.filename;
    if (req.body.removerImagem === "true") conteudo.imagem = "";
    await conteudo.save();

    if (imagemAntiga && imagemAntiga !== conteudo.imagem) {
      await apagarImagem(imagemAntiga);
    }
    return res.json({ conteudo });
  })
);

router.delete(
  "/:id/imagem",
  exigirLogin,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Identificador inválido." });
    }
    const conteudo = await Content.findById(req.params.id);
    if (!conteudo) return res.status(404).json({ message: "Conteúdo não encontrado." });
    const imagemAntiga = conteudo.imagem;
    conteudo.imagem = "";
    await conteudo.save();
    await apagarImagem(imagemAntiga);
    return res.json({ conteudo });
  })
);

router.delete(
  "/:id",
  exigirLogin,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Identificador inválido." });
    }
    const conteudo = await Content.findByIdAndDelete(req.params.id);
    if (!conteudo) return res.status(404).json({ message: "Conteúdo não encontrado." });
    await apagarImagem(conteudo.imagem);
    return res.json({ message: "Conteúdo excluído." });
  })
);

module.exports = router;
