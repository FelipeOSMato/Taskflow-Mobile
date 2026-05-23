import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from "react-native";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function login() {

    if (email === "admin" && senha === "123") {
      navigation.navigate("Menu");
    } else {
      Alert.alert("Erro", "Email ou senha inválidos");
    }

  }

  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />

      <View style={styles.card}>

        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>Gerencie suas tarefas</Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#E6E9ED",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 25
  },

  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 25,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3E5F87",
    textAlign: "center"
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25
  },
 
  label: {
    fontSize: 14,
    color: "#3E5F87",
    marginBottom: 5,
    fontWeight: "600"
  },

  input: {
    width: "100%",
    backgroundColor: "#F8F9FB",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd"
  },

  forgot: {
    color: "#5B86B3",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 13
  },

  button: {
    backgroundColor: "#5B86B3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  }

});