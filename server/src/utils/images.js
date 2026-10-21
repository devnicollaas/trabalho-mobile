const fs = require("fs/promises");
const path = require("path");

const pastaUploads = path.join(__dirname, "..", "..", "uploads");

async function apagarImagem(imagem) {
  if (!imagem || !imagem.startsWith("/uploads/")) return;
  const nomeArquivo = path.basename(imagem);
  try {
    await fs.unlink(path.join(pastaUploads, nomeArquivo));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

module.exports = { apagarImagem, pastaUploads };
