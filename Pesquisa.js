import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Appbar, Text, TextInput } from "react-native-paper";
import ModCard from "./Cards";
import { useAuth } from "./context/AuthContext";

const Pesquisa = ({ navigation }) => {
  const { requisitar } = useAuth();
  const [termo, setTermo] = useState("");
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    const temporizador = setTimeout(async () => {
      setCarregando(true);
      setErro("");
      try {
        const resultado = await requisitar("/conteudos?q=" + encodeURIComponent(termo.trim()));
        if (ativo) setConteudos(resultado.conteudos);
      } catch (error) {
        if (ativo) setErro(error.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }, 250);
    return () => {
      ativo = false;
      clearTimeout(temporizador);
    };
  }, [termo, requisitar]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Appbar.Header style={{ backgroundColor: "#C0C0C0" }}>
        <Appbar.BackAction onPress={() => navigation.navigate("Início")} />
        <Appbar.Content title="Pesquisa" />
      </Appbar.Header>
      <TextInput
        label="Pesquisar no catálogo"
        placeholder="Digite título, descrição ou categoria"
        value={termo}
        onChangeText={setTermo}
        mode="outlined"
        left={<TextInput.Icon icon="magnify" />}
        style={{ margin: 16, backgroundColor: "white" }}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {carregando ? <ActivityIndicator size="large" color="#eda73e" /> : null}
        {erro ? <Text style={{ color: "#B3261E" }}>{erro}</Text> : null}
        {!carregando && !erro && conteudos.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 18 }}>
            {termo ? "Nenhum resultado para essa pesquisa." : "O catálogo ainda está vazio."}
          </Text>
        ) : null}
        {conteudos.map((conteudo) => <ModCard key={conteudo._id} conteudo={conteudo} />)}
      </ScrollView>
    </View>
  );
};

export default Pesquisa;
