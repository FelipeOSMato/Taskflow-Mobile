import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './telas/login';
import HomeScreen from './telas/home';
import DevScreen from './telas/devs';
import UserScreen from './telas/users';
import CadastroScreen from './telas/cadEnd';
import ProjetoScreen from './telas/projetos';
import CadastroUsuarioScreen from './telas/cadastros/cadastroUsuario'
import CadastroTarefaScreen from './telas/cadastros/cadastroTarefa';
import CadastroProjetoScreen from './telas/cadastros/cadastroProjeto';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MenuDrawer(){
  return(
    <Drawer.Navigator

      screenOptions={{
        drawerStyle:{
          backgroundColor: '#5B86B3',
        },
          drawerActiveTintColor: '#fff',      // cor do texto ativo
          drawerInactiveTintColor: '#e7d1ff', // cor do texto inativo
          drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: "#5B86B3",
        },
        headerTintColor: "#fff", 
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
      
    >
      <Drawer.Screen name="Home" component={HomeScreen}/>
      <Drawer.Screen name="Desenvolvedores" component={DevScreen}/>
      <Drawer.Screen name="Usuários" component={UserScreen}/>
      <Drawer.Screen name="Projetos" component={ProjetoScreen}/>
      <Drawer.Screen name="Cadastro Endereço" component={CadastroScreen}/>
    </Drawer.Navigator>
  )
}

export default function App(){
  return(
    <NavigationContainer>

      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Menu" component={MenuDrawer}/>
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuarioScreen}/>
        <Stack.Screen name="CadastroTarefa" component={CadastroTarefaScreen}/>
        <Stack.Screen name="CadastroProjeto" component={CadastroProjetoScreen}/>
      </Stack.Navigator>  

    </NavigationContainer>
  )
}