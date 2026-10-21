const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true, maxlength: 120 },
    subtitulo: { type: String, trim: true, maxlength: 160, default: "" },
    descricao: { type: String, trim: true, maxlength: 2000, default: "" },
    categoria: { type: String, trim: true, maxlength: 60, default: "Séries" },
    imagem: { type: String, default: "" },
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
