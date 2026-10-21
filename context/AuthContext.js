import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState("");

  const entrar = useCallback(async (email, senha) => {
    const resultado = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
    setUsuario(resultado.usuario);
    setToken(resultado.token);
    return resultado.usuario;
  }, []);

  const cadastrar = useCallback(async (nome, email, senha) => {
    const resultado = await apiRequest("/auth/registrar", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    });
    setUsuario(resultado.usuario);
    setToken(resultado.token);
    return resultado.usuario;
  }, []);

  const sair = useCallback(() => {
    setUsuario(null);
    setToken("");
  }, []);

  const atualizarNome = useCallback(
    async (nome) => {
      const resultado = await apiRequest("/auth/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({ nome }),
      });
      setUsuario(resultado.usuario);
      return resultado.usuario;
    },
    [token]
  );

  const requisitar = useCallback(
    (caminho, options = {}) =>
      apiRequest(caminho, { ...options, token: options.token || token }),
    [token]
  );

  const value = useMemo(
    () => ({
      usuario,
      autenticado: Boolean(token),
      entrar,
      cadastrar,
      sair,
      atualizarNome,
      requisitar,
    }),
    [usuario, token, entrar, cadastrar, sair, atualizarNome, requisitar]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider.");
  return context;
}
