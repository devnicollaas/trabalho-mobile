import { Platform } from "react-native";

const enderecoLocal =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || enderecoLocal
).replace(/\/+$/, "");

export async function apiRequest(caminho, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.token) headers.Authorization = "Bearer " + options.token;
  if (options.body && !options.multipart) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(API_BASE_URL + caminho, {
      method: options.method || "GET",
      headers,
      body: options.body,
    });
  } catch (_error) {
    throw new Error(
      "Não consegui acessar a API. Confira se o servidor está ligado e se o endereço em .env está correto."
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "A solicitação não foi concluída.");
  }
  return data;
}

export function enderecoDaImagem(imagem) {
  if (!imagem) return "";
  if (imagem.startsWith("http://") || imagem.startsWith("https://")) {
    return imagem;
  }
  const origem = API_BASE_URL.replace(/\/api\/?$/, "");
  return origem + (imagem.startsWith("/") ? imagem : "/" + imagem);
}
