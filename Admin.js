import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, View } from "react-native";
import { Appbar, Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import ModCard from "./Cards";
import { enderecoDaImagem } from "./services/api";
import { useAuth } from "./context/AuthContext";

const camposVazios = {
  titulo: "",
  subtitulo: "",
  descricao: "",
  categoria: "Séries",
};

export default function Admin({ navigation }) {
  const { usuario, requisitar } = useAuth();
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [campos, setCampos] = useState(camposVazios);
  const [imagemEscolhida, setImagemEscolhida] = useState(null);
  const [removerImagem, setRemoverImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!usuario) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro("");
    try {
      const resultado = await requisitar("/conteudos");
      setConteudos(resultado.conteudos);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario, requisitar]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const fecharModal = () => {
    setModalVisivel(false);
    setEditando(null);
    setCampos(camposVazios);
    setImagemEscolhida(null);
    setRemoverImagem(false);
  };

  const novoConteudo = () => {
    setErro("");
    setEditando(null);
    setCampos(camposVazios);
    setImagemEscolhida(null);
    setRemoverImagem(false);
    setModalVisivel(true);
  };

  const editarConteudo = (conteudo) => {
    setErro("");
    setEditando(conteudo);
    setCampos({
      titulo: conteudo.titulo || "",
      subtitulo: conteudo.subtitulo || "",
      descricao: conteudo.descricao || "",
      categoria: conteudo.categoria || "Séries",
    });
    setImagemEscolhida(null);
    setRemoverImagem(false);
    setModalVisivel(true);
  };

  const escolherImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErro("Permita o acesso às fotos para escolher uma imagem.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!resultado.canceled && resultado.assets && resultado.assets[0]) {
      setImagemEscolhida(resultado.assets[0]);
      setRemoverImagem(false);
      setErro("");
    }
  };

  const salvarConteudo = async () => {
    const titulo = campos.titulo.trim();
    if (!titulo) {
      setErro("Digite um título para o conteúdo.");
      return;
    }
    const dados = new FormData();
    dados.append("titulo", titulo);
    dados.append("subtitulo", campos.subtitulo.trim());
    dados.append("descricao", campos.descricao.trim());
    dados.append("categoria", campos.categoria.trim() || "Outros");
    if (imagemEscolhida) {
      if (imagemEscolhida.file) {
        dados.append("imagem", imagemEscolhida.file, imagemEscolhida.file.name);
      } else {
        dados.append("imagem", {
          uri: imagemEscolhida.uri,
          name: imagemEscolhida.fileName || "imagem.jpg",
          type: imagemEscolhida.mimeType || "image/jpeg",
        });
      }
    } else if (removerImagem) {
      dados.append("removerImagem", "true");
    }

    setSalvando(true);
    setErro("");
    try {
      const caminho = editando ? "/conteudos/" + editando._id : "/conteudos";
      await requisitar(caminho, {
        method: editando ? "PATCH" : "POST",
        body: dados,
        multipart: true,
      });
      fecharModal();
      await carregar();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluirConteudo = (conteudo) => {
    Alert.alert(
      "Excluir conteúdo",
      "Quer mesmo excluir “" + conteudo.titulo + "”?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await requisitar("/conteudos/" + conteudo._id, { method: "DELETE" });
              await carregar();
            } catch (error) {
              setErro(error.message);
            }
          },
        },
      ]
    );
  };

  if (!usuario) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <Appbar.Header style={{ backgroundColor: "#C0C0C0" }}>
          <Appbar.BackAction onPress={() => navigation.navigate("Início")} />
          <Appbar.Content title="Área administrativa" />
        </Appbar.Header>
        <View style={{ padding: 24 }}>
          <Text>Entre na sua conta para gerenciar os conteúdos.</Text>
          <Button mode="contained" onPress={() => navigation.navigate("Acesso")} style={{ marginTop: 16 }}>
            Entrar
          </Button>
        </View>
      </View>
    );
  }

  const imagemPreview = imagemEscolhida
    ? imagemEscolhida.uri
    : editando && editando.imagem && !removerImagem
      ? enderecoDaImagem(editando.imagem)
      : "";

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Appbar.Header style={{ backgroundColor: "#C0C0C0" }}>
        <Appbar.BackAction onPress={() => navigation.navigate("Início")} />
        <Appbar.Content title="Área administrativa" />
        <Appbar.Action icon="plus" onPress={novoConteudo} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
          Olá, {usuario.nome}. Aqui você pode cadastrar e alterar o catálogo.
        </Text>
        <Button mode="contained" icon="plus" onPress={novoConteudo} style={{ marginBottom: 16 }}>
          Cadastrar conteúdo
        </Button>
        {carregando ? <ActivityIndicator size="large" color="#eda73e" /> : null}
        {erro && !modalVisivel ? <Text style={{ color: "#B3261E", marginBottom: 12 }}>{erro}</Text> : null}
        {!carregando && conteudos.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 24 }}>O catálogo está vazio. Cadastre o primeiro conteúdo.</Text>
        ) : null}
        {conteudos.map((conteudo) => (
          <ModCard
            key={conteudo._id}
            conteudo={conteudo}
            administrador
            onEditar={() => editarConteudo(conteudo)}
            onExcluir={() => excluirConteudo(conteudo)}
          />
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisivel}
          onDismiss={fecharModal}
          contentContainerStyle={{
            backgroundColor: "white",
            margin: 18,
            padding: 20,
            borderRadius: 16,
            maxHeight: "90%",
          }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text variant="headlineSmall" style={{ marginBottom: 14 }}>
              {editando ? "Editar conteúdo" : "Novo conteúdo"}
            </Text>
            <TextInput
              label="Título"
              value={campos.titulo}
              onChangeText={(titulo) => setCampos({ ...campos, titulo })}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Subtítulo (ex.: temporada e episódio)"
              value={campos.subtitulo}
              onChangeText={(subtitulo) => setCampos({ ...campos, subtitulo })}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Categoria"
              value={campos.categoria}
              onChangeText={(categoria) => setCampos({ ...campos, categoria })}
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Descrição"
              value={campos.descricao}
              onChangeText={(descricao) => setCampos({ ...campos, descricao })}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={{ marginBottom: 12 }}
            />
            {imagemPreview ? (
              <Image source={{ uri: imagemPreview }} style={{ width: "100%", height: 170, borderRadius: 10, marginBottom: 10 }} />
            ) : (
              <Text style={{ marginBottom: 10 }}>Este conteúdo está sem imagem.</Text>
            )}
            <Button mode="outlined" icon="image-edit" onPress={escolherImagem} style={{ marginBottom: 8 }}>
              {editando && editando.imagem ? "Trocar imagem" : "Escolher imagem"}
            </Button>
            {editando && editando.imagem ? (
              <Button
                mode="text"
                icon="image-off"
                textColor="#B3261E"
                onPress={() => {
                  setImagemEscolhida(null);
                  setRemoverImagem(true);
                }}
                style={{ marginBottom: 8 }}
              >
                Remover imagem
              </Button>
            ) : null}
            {erro ? <Text style={{ color: "#B3261E", marginVertical: 8 }}>{erro}</Text> : null}
            <Button mode="contained" loading={salvando} disabled={salvando} onPress={salvarConteudo} style={{ marginTop: 8 }}>
              Salvar
            </Button>
            <Button mode="text" onPress={fecharModal} disabled={salvando}>
              Cancelar
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}
