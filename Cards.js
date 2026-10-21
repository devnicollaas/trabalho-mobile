import React from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { enderecoDaImagem } from "./services/api";
import { styles } from "./css/Styles";

export default function ModCard({ conteudo, administrador = false, onEditar, onExcluir }) {
    return (
        <Card style={styles.card}>
            <Card.Title
                title={conteudo.titulo}
                subtitle={conteudo.subtitulo || conteudo.categoria}
                titleStyle={styles.cardTitle}
            />
            {conteudo.imagem ? (
                <Card.Cover
                    style={styles.cardCover}
                    source={{ uri: enderecoDaImagem(conteudo.imagem) }}
                />
            ) : (
                <View style={styles.semImagem}>
                    <Text variant="bodyMedium">Sem imagem</Text>
                </View>
            )}
            {conteudo.descricao ? (
                <Card.Content style={styles.cardDescricao}>
                    <Text>{conteudo.descricao}</Text>
                </Card.Content>
            ) : null}
            {administrador ? (
                <Card.Actions style={styles.cardActions}>
                    <Button icon="pencil" onPress={onEditar}>Editar</Button>
                    <Button icon="delete" textColor="#B3261E" onPress={onExcluir}>Excluir</Button>
                </Card.Actions>
            ) : null}
        </Card>
    );
}
