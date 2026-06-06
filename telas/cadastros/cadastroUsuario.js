import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = 'http://ipDaMaquina:8000/api/criar-usuario'

export default function CadastroUsuarioScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const enviarDados = () =>{
    if(!nome || !email || !senha){
      Alert.alert('Preencha todos os dados do formulário!')
      return
    }

    setLoading(true)

    const dados = {
      nome:nome,
      email:email,
      senha:senha
    }

    axios.post(API_URL, dados)
      .then((response) => {
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        navigation.goBack();
      })
      .catch((err) => {
        console.error("Erro na requisição POST Axios:", err);
        Alert.alert('Erro', 'Não foi possível criar o Usuário. Verifique a conexão.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity style = {styles.buttonVoltar} onPress={()=>navigation.goBack()}>
          <Text style={styles.buttonText}> Voltar</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Novo Usuário</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o seu nome..."
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@email.com..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button}
          onPress={enviarDados}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#5B86B3"/>
          ) : (
            <Text style={styles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20
  },

  header: {
    backgroundColor: "#5B86B3",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: "center"
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold"
  },

  subtitle: {
    color: "#E6EEF7",
    marginTop: 6,
    fontSize: 13
  },

  form: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 3
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E5F87",
    marginTop: 12,
    marginBottom: 6
  },

  input: {
    backgroundColor: "#F7F8FA",
    borderWidth: 1,
    borderColor: "#D9E1EA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333"
  },

  button: {
    backgroundColor: "#5B86B3",
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center"
  },

  buttonVoltar: {
    backgroundColor: "#5B86B3",
    marginBottom: 25,
    width: "25%",
    padding: 15,
    borderRadius: 14,
    alignItems: "flex-start"
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  }
});