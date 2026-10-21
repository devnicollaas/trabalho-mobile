import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./css/Styles";
import ModCard from "./Cards";
import { useAuth } from "./context/AuthContext";

const categorias = ["Todos", "Séries", "Filmes", "Tecnologia", "Outros"];

const AppBar = ({ navigation }) => {
    const { usuario, requisitar } = useAuth();
    const [categoria, setCategoria] = useState("Todos");
    const [conteudos, setConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro("");
        try {
            const query = categoria === "Todos" ? "" : "?categoria=" + encodeURIComponent(categoria);
            const resultado = await requisitar("/conteudos" + query);
            setConteudos(resultado.conteudos);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }, [categoria, requisitar]);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    return (
        <>
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Technologic" titleStyle={styles.title} />
                <Appbar.Action icon="magnify" iconColor="white" onPress={() => navigation.navigate("Pesquisa")} />
                <Appbar.Action
                    icon={usuario ? "account-circle" : "account"}
                    iconColor="white"
                    onPress={() => navigation.navigate(usuario ? "Meu perfil" : "Acesso")}
                />
            </Appbar.Header>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
                <View style={styles.tabsContent}>
                    {categorias.map((item) => (
                        <Button
                            key={item}
                            mode={categoria === item ? "contained" : "outlined"}
                            style={styles.tabButton}
                            onPress={() => setCategoria(item)}
                        >
                            {item}
                        </Button>
                    ))}
                </View>
            </ScrollView>

            <ScrollView style={styles.cards} contentContainerStyle={styles.cardsContent}>
                {carregando ? <ActivityIndicator size="large" color="#eda73e" /> : null}
                {!carregando && erro ? <Text style={styles.mensagem}>{erro}</Text> : null}
                {!carregando && !erro && conteudos.length === 0 ? (
                    <View style={styles.vazio}>
                        <Text variant="titleMedium">Ainda não há conteúdos cadastrados.</Text>
                        <Text style={styles.mensagem}>
                            {usuario
                                ? "Abra a área administrativa para adicionar o primeiro."
                                : "Entre ou crie uma conta para cadastrar conteúdos."}
                        </Text>
                        {usuario ? (
                            <Button mode="contained" onPress={() => navigation.navigate("Área administrativa")}>
                                Abrir área administrativa
                            </Button>
                        ) : (
                            <Button mode="contained" onPress={() => navigation.navigate("Acesso")}>
                                Entrar ou criar conta
                            </Button>
                        )}
                    </View>
                ) : null}
                {conteudos.map((conteudo) => <ModCard key={conteudo._id} conteudo={conteudo} />)}
            </ScrollView>
        </>
    );
};

export default AppBar;
