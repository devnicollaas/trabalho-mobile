import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "./context/AuthContext";

const Cadastro = ({ navigation }) => {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async () => {
    setErro("");
    if (nome.trim().length < 2 || !email.trim() || !senha) {
      setErro("Preencha seu nome, e-mail e senha.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não são iguais.");
      return;
    }
    setCarregando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
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
        <Appbar.Content title="Cadastro" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text variant="headlineMedium" style={{ textAlign: "center", fontWeight: "bold", marginTop: 12 }}>
          Criar conta
        </Text>
        <Text variant="bodyLarge" style={{ textAlign: "center", marginTop: 6, marginBottom: 22 }}>
          Com a conta você poderá cadastrar e editar conteúdos.
        </Text>
        <TextInput label="Nome" value={nome} onChangeText={setNome} mode="outlined" left={<TextInput.Icon icon="account" />} style={{ marginBottom: 12, backgroundColor: "white" }} />
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: 12, backgroundColor: "white" }}
        />
        <TextInput label="Senha (mínimo 6 caracteres)" value={senha} onChangeText={setSenha} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock" />} style={{ marginBottom: 12, backgroundColor: "white" }} />
        <TextInput label="Confirmar senha" value={confirmarSenha} onChangeText={setConfirmarSenha} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock-check" />} style={{ marginBottom: 12, backgroundColor: "white" }} />
        {erro ? <Text style={{ color: "#B3261E", marginBottom: 12 }}>{erro}</Text> : null}
        <Button mode="contained" icon="account-plus" loading={carregando} disabled={carregando} onPress={enviar}>
          Cadastrar
        </Button>
        <Button mode="text" icon="login" onPress={() => navigation.navigate("Login")} style={{ marginTop: 8 }}>
          Já tenho cadastro
        </Button>
      </ScrollView>
    </View>
  );
};

export default Cadastro;
