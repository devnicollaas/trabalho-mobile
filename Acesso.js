import React from "react";
import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useAuth } from "./context/AuthContext";

const Acesso = ({ navigation }) => {
  const { usuario, sair } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Appbar.Header style={{ backgroundColor: "#C0C0C0" }}>
        <Appbar.BackAction onPress={() => navigation.navigate("Início")} />
        <Appbar.Content title="Acesso" />
      </Appbar.Header>
      <View style={{ padding: 26, alignItems: "stretch" }}>
        <Text variant="headlineSmall" style={{ textAlign: "center", fontWeight: "bold", marginBottom: 12 }}>
          {usuario ? "Olá, " + usuario.nome + "!" : "Bem-vindo!"}
        </Text>
        {usuario ? (
          <>
            <Text variant="bodyLarge" style={{ textAlign: "center", marginBottom: 28 }}>
              Sua conta já está conectada.
            </Text>
            <Button mode="contained" icon="view-dashboard" onPress={() => navigation.navigate("Área administrativa")} style={{ marginBottom: 14 }}>
              Área administrativa
            </Button>
            <Button mode="outlined" icon="account" onPress={() => navigation.navigate("Meu perfil")} style={{ marginBottom: 14 }}>
              Meu perfil
            </Button>
            <Button mode="text" icon="logout" onPress={() => { sair(); navigation.navigate("Início"); }}>
              Sair da conta
            </Button>
          </>
        ) : (
          <>
            <Text variant="bodyLarge" style={{ textAlign: "center", marginBottom: 28 }}>
              Entre para gerenciar o catálogo ou crie sua conta.
            </Text>
            <Button mode="contained" icon="login" onPress={() => navigation.navigate("Login")} style={{ marginBottom: 14 }}>
              Já tenho cadastro
            </Button>
            <Button mode="outlined" icon="account-plus" onPress={() => navigation.navigate("Cadastro")}>
              Criar conta
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default Acesso;
