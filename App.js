import "react-native-gesture-handler";
import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { PaperProvider, Text } from "react-native-paper";
import { theme } from "./theme/theme";
import AppBar from "./AppBar";
import Pesquisa from "./Pesquisa";
import Acesso from "./Acesso";
import Login from "./Login";
import Cadastro from "./Cadastro";
import { Perfil } from "./Perfil";
import { CabecalhoMenu } from "./CabecaMenu";
import Admin from "./Admin";
import { AuthProvider } from "./context/AuthContext";

const Drawer = createDrawerNavigator();

function ConteudoMenu(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <CabecalhoMenu navigation={props.navigation} />
      <View style={{ flex: 1 }} />
      <Text style={{ padding: 18, color: "#777" }}>Technologic • catálogo colaborativo</Text>
    </DrawerContentScrollView>
  );
}

function Navegacao() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Início"
        drawerContent={(props) => <ConteudoMenu {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: "#8A5A00",
          drawerStyle: { width: 300 },
        }}
      >
        <Drawer.Screen name="Início" component={AppBar} />
        <Drawer.Screen name="Pesquisa" component={Pesquisa} />
        <Drawer.Screen name="Acesso" component={Acesso} options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="Cadastro" component={Cadastro} options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="Meu perfil" component={Perfil} options={{ drawerItemStyle: { display: "none" } }} />
        <Drawer.Screen name="Área administrativa" component={Admin} options={{ drawerItemStyle: { display: "none" } }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Navegacao />
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
