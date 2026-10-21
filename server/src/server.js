require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/contents");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/conteudos", contentRoutes);

app.use((error, _req, res, _next) => {
  if (error.name === "MulterError" && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "A imagem deve ter no máximo 5 MB." });
  }
  if (error.message === "Envie uma imagem JPEG, PNG ou WebP.") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "Este e-mail já está cadastrado." });
  }
  console.error(error);
  return res.status(500).json({ message: "Erro interno. Confira o terminal da API." });
});

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Configure MONGODB_URI e JWT_SECRET no arquivo server/.env.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log("API Technologic disponível na porta " + port);
    });
  })
  .catch((error) => {
    console.error("Não foi possível conectar ao MongoDB:", error.message);
    process.exit(1);
  });
