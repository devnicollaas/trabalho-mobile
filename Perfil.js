import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "./context/AuthContext";

const Perfil = ({ navigation }) => {
  const { usuario, atualizarNome } = useAuth();
  const [nome, setNome] = useState(usuario ? usuario.nome : "");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNome(usuario ? usuario.nome : "");
  }, [usuario]);

  const salvar = async () => {
    setErro("");
    setMensagem("");
    if (nome.trim().length < 2) {
      setErro("Digite um nome com pelo menos 2 caracteres.");
      return;
    }
    setSalvando(true);
    try {
      await atualizarNome(nome.trim());
      setMensagem("Nome atualizado.");
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.navigate("Início")} />
          <Appbar.Content title="Meu perfil" />
        </Appbar.Header>
        <Button onPress={() => navigation.navigate("Acesso")}>Entre na sua conta</Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Appbar.Header style={{ backgroundColor: "#C0C0C0" }}>
        <Appbar.BackAction onPress={() => navigation.navigate("Início")} />
        <Appbar.Content title="Meu perfil" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Sua conta</Text>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={{ marginBottom: 14, backgroundColor: "white" }}
        />
        <TextInput
          label="E-mail"
          value={usuario.email}
          mode="outlined"
          editable={false}
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: 14, backgroundColor: "white" }}
        />
        {erro ? <Text style={{ color: "#B3261E", marginBottom: 12 }}>{erro}</Text> : null}
        {mensagem ? <Text style={{ color: "#237A3B", marginBottom: 12 }}>{mensagem}</Text> : null}
        <Button mode="contained" icon="content-save" loading={salvando} disabled={salvando} onPress={salvar}>
          Salvar nome
        </Button>
      </ScrollView>
    </View>
  );
};

export { Perfil };
