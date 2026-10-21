const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function exigirLogin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({ message: "Faça login para continuar." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.sub).select("_id nome email");
    if (!usuario) {
      return res.status(401).json({ message: "Sessão inválida. Entre novamente." });
    }
    req.usuario = usuario;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Sessão expirada. Entre novamente." });
  }
}

module.exports = exigirLogin;
