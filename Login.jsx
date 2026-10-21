import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "./context/AuthContext";

const Login = ({ navigation }) => {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async () => {
    setErro("");
    if (!email.trim() || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }
    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
      navigation.navigate("Início");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EEEEEE" }}>
      <Appbar.Header style={{ backgroundColor: "#C0C0C0" }}>
        <Appbar.BackAction onPress={() => navigation.navigate("Acesso")} />
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text variant="headlineMedium" style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }}>
          Bem-vindo!
        </Text>
        <Text variant="bodyLarge" style={{ textAlign: "center", marginTop: 6, marginBottom: 28 }}>
          Entre com sua conta para gerenciar o catálogo.
        </Text>
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: 14, backgroundColor: "white" }}
        />
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry
          autoComplete="password"
          left={<TextInput.Icon icon="lock" />}
          style={{ marginBottom: 14, backgroundColor: "white" }}
        />
        {erro ? <Text style={{ color: "#B3261E", marginBottom: 12 }}>{erro}</Text> : null}
        <Button mode="contained" icon="login" loading={carregando} disabled={carregando} onPress={enviar}>
          Entrar
        </Button>
        <Button mode="text" icon="account-plus" onPress={() => navigation.navigate("Cadastro")} style={{ marginTop: 8 }}>
          Ainda não tenho conta
        </Button>
      </ScrollView>
    </View>
  );
};

export default Login;
