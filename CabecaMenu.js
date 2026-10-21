import React from "react";
import { View } from "react-native";
import { Avatar, Button, Divider, Text } from "react-native-paper";
import { DrawerItem } from "@react-navigation/drawer";
import { useAuth } from "./context/AuthContext";

function CabecalhoMenu({ navigation }) {
  const { usuario, sair } = useAuth();
  const iniciais = usuario
    ? usuario.nome.split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase()
    : "";

  const abrir = (rota) => {
    navigation.navigate(rota);
    navigation.closeDrawer();
  };

  const fazerLogout = () => {
    sair();
    abrir("Início");
  };

  return (
    <View>
      <View style={{ padding: 20, backgroundColor: "#555", flexDirection: "row", alignItems: "center" }}>
        {usuario ? (
          <Avatar.Text size={54} label={iniciais} style={{ backgroundColor: "#eda73e" }} />
        ) : (
          <Avatar.Icon size={54} icon="account" style={{ backgroundColor: "#eda73e" }} />
        )}
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text variant="titleMedium" style={{ color: "white", fontWeight: "bold" }}>
            {usuario ? usuario.nome : "Visitante"}
          </Text>
          <Text variant="bodySmall" style={{ color: "white" }}>
            {usuario ? usuario.email : "Acesso público"}
          </Text>
        </View>
      </View>
      <DrawerItem label="Início" icon={({ color, size }) => <Avatar.Icon size={size} icon="home" color={color} />} onPress={() => abrir("Início")} />
      <DrawerItem label="Pesquisa" icon={({ color, size }) => <Avatar.Icon size={size} icon="magnify" color={color} />} onPress={() => abrir("Pesquisa")} />
      {usuario ? (
        <>
          <DrawerItem label="Área administrativa" icon={({ color, size }) => <Avatar.Icon size={size} icon="view-dashboard" color={color} />} onPress={() => abrir("Área administrativa")} />
          <DrawerItem label="Meu perfil" icon={({ color, size }) => <Avatar.Icon size={size} icon="account" color={color} />} onPress={() => abrir("Meu perfil")} />
          <Divider />
          <Button icon="logout" mode="text" onPress={fazerLogout} style={{ alignSelf: "flex-start", marginLeft: 8 }}>
            Sair da conta
          </Button>
        </>
      ) : (
        <DrawerItem label="Entrar" icon={({ color, size }) => <Avatar.Icon size={size} icon="login" color={color} />} onPress={() => abrir("Acesso")} />
      )}
    </View>
  );
}

export { CabecalhoMenu };
