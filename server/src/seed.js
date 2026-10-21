require("dotenv").config();
const mongoose = require("mongoose");
const Content = require("./models/Content");

async function executar() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Configure MONGODB_URI em server/.env antes de carregar o exemplo.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const existe = await Content.exists({ titulo: "Breaking Bad" });
  if (existe) {
    console.log("O conteúdo de exemplo já existe.");
  } else {
    await Content.create({
      titulo: "Breaking Bad",
      subtitulo: "1x01 - Pilot",
      descricao:
        "Um professor de química começa uma nova vida depois de receber uma notícia que muda seus planos.",
      categoria: "Séries",
      imagem: "https://picsum.photos/seed/technologic-breaking-bad/900/500",
    });
    console.log("Conteúdo de exemplo cadastrado no MongoDB.");
  }
  await mongoose.disconnect();
}

executar().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
