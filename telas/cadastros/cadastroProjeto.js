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
  import { Picker } from '@react-native-picker/picker';

  const API_INSERT = 'http://ipDaMaquina:8000/api/criar-projeto'
  const API_VIEW = 'http://ipDaMaquina:8000/api/usuario'

  export default function CadastroProjetoScreen() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [usuario_id, setUsuario_id] = useState('');
    const [loadingUsuario, setLoadingUsuario] = useState(true);
    const [loadingProjetos, setLoadingProjetos] = useState(false);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
      axios.get(API_VIEW)
        .then((response) => {
          setUsuario(response.data);
          setLoadingUsuario(false);
        })
        .catch((err) => {
          console.error("Erro na requisição Axios:", err);
          setError('Não foi possível carregar os Usuarios.');
          setLoadingUsuario(false);
        });
    },[]);

    if (loadingUsuario) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando usuarios...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    const enviarDados = () =>{
      if(!nome || !descricao || !usuario_id){
        Alert.alert('Preencha todos os dados do formulário!')
        return
      }

      setLoadingProjetos(true)

      const dados = {
        nome:nome,
        descricao:descricao,
        usuario_id:usuario_id
      }

      axios.post(API_INSERT, dados)
        .then((response) => {
          Alert.alert('Sucesso', 'Projeto criado com sucesso!');
          setNome('');
          setDescricao('');
          setUsuario_id('');
          navigation.goBack();
        })
        .catch((err) => {
          console.error("Erro na requisição POST Axios:", err);
          Alert.alert('Erro', 'Não foi possível criar o Projeto. Verifique a conexão.');
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
          <Text style={styles.title}>Novo Projeto</Text>
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


          <Text style={styles.label}>Usuário:</Text>

          <View style={styles.containerSelect}>
            <Picker
              style={styles.picker}
              selectedValue={usuario_id}
              onValueChange={(idUsuario) => setUsuario_id(idUsuario)}
            >
              <Picker.Item
                label="Selecione um Usuario"
                value=""
              />

              {usuario.map((usuario)=> (
                <Picker.Item
                  key={usuario.id}
                  label={usuario.nome}
                  value={usuario.id}
                />
              )
            )}
            </Picker>
          </View>

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