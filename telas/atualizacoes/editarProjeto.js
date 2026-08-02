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
  import { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigation } from "@react-navigation/native";
  import { useRoute } from "@react-navigation/native";

  const API_ATUALIZAR = 'http://127.0.0.1:8000/api/atualizar-projeto'

  export default function EditarProjetoScreen() {
    const route = useRoute()
    const {projeto} = route.params
    const [nome, setNome] = useState(projeto.nome);
    const [descricao, setDescricao] = useState(projeto.descricao);
    const [loadingProjetos, setLoadingProjetos] = useState(false);
    const [error, setError] = useState(null);

    const navigation = useNavigation();
    
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    const enviarDados = () =>{
      if(!nome || !descricao){
        Alert.alert('Preencha todos os dados do formulário!')
        return
      }

      setLoadingProjetos(true)

      const dados = {
        nome:nome,
        descricao:descricao,
      }

      axios.put(`${API_ATUALIZAR}/${projeto.id}`, dados)
        .then((response) => {
          Alert.alert('Sucesso', 'Projeto atualizado com sucesso!');
          setNome('');
          setDescricao('');
          navigation.goBack();
        })
        .catch((err) => {
          console.error("Erro na requisição PUT Axios:", err);
          Alert.alert('Erro', 'Não foi possível editar o Projeto. Verifique a conexão.');
        })
        .finally(() => {
          setLoadingProjetos(false);
        });
    };

    return (
      <ScrollView style={styles.container}>

        <TouchableOpacity style = {styles.buttonVoltar} onPress={()=>navigation.goBack()}>
            <Text style={styles.buttonText}> Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Editar Projeto</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do projeto..."
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            placeholder="descrição do projeto..."
            value={descricao}
            onChangeText={setDescricao}
          />

          <TouchableOpacity style={styles.button}
            onPress={enviarDados}
            disabled={loadingProjetos}>
            {loadingProjetos ? (
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
    },

    loadingText: {
      marginTop: 10,
      fontSize: 16
    },

    errorText: {
      color: "red",
      fontSize: 16,
      textAlign: "center"
    },
    picker: {
      backgroundColor: "#F7F8FA",
      borderWidth: 1,
      borderColor: "#D9E1EA",
      borderRadius: 12,
      minHeight: 55,
      justifyContent: "center",
    },

  });