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

  const API_INSERT = 'http://127.0.0.1:8000/api/criar-tarefa'
  const API_VIEW = 'http://127.0.0.1:8000/api/projeto'

  export default function CadastroTarefaScreen() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [projeto_id, setProjeto_id] = useState('');
    const [loadingProjetos, setLoadingProjetos] = useState(true);
    const [loadingTarefas, setLoadingTarefas] = useState(false);
    const [error, setError] = useState(null);
    const [projetos, setProjetos] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
      axios.get(API_VIEW)
        .then((response) => {
          setProjetos(response.data);
          setLoadingProjetos(false);
        })
        .catch((err) => {
          console.error("Erro na requisição Axios:", err);
          setError('Não foi possível carregar os Projetos.');
          setLoadingProjetos(false);
        });
    },[]);

    if (loadingProjetos) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando tarefas...</Text>
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

    const formatarDataTempoReal = (text) => {
      let digitos = text.replace(/\D/g, '').substring(0, 8);
      let dia = digitos.substring(0,2)
      let mes = digitos.substring(2,4)
      let ano = digitos.substring(4,8)

      if(dia.length == 2 && Number(dia) > 30 && Number(mes) == 4 || Number(mes) == 6 || Number(mes) == 9 || Number(mes) == 11){
        dia = '30';
      }else if(dia.length === 2 && Number(dia)>31 && Number(mes) == 1 || Number(mes) == 3 || Number(mes) == 5 || Number(mes) == 7 || Number(mes) == 8 && Number(mes) == 10 && Number(mes) == 12){
        dia = '31'
      }else if(dia.length === 2 && Number(dia) > 28 && Number(mes) == 2){
        dia = '28'
      }

      if(mes.length === 2 && Number(mes) > 12){
        mes = '12'
      }

      let resultado = dia;

      if (mes.length > 0) {
        resultado = resultado + '-' + mes;
      }

      if (ano.length > 0) {
        resultado = resultado + '-' + ano;
      }

      return resultado;
    };

    const converterData = (data) => {
      const [dia, mes, ano] = data.split('-')
      return `${ano}-${mes}-${dia}`
    } 

    const enviarDados = () =>{
      if(!titulo || !descricao || !dataFinal || !projeto_id){
        Alert.alert('Preencha todos os dados do formulário!')
        return
      }

      setLoadingTarefas(true)

      const dados = {
        titulo:titulo,
        descricao:descricao,
        dataFinal:converterData(dataFinal),
        projeto_id:projeto_id
      }

      axios.post(API_INSERT, dados)
        .then((response) => {
          Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
          setTitulo('');
          setDescricao('');
          setDataFinal('');
          setProjeto_id('');
          navigation.goBack();
        })
        .catch((err) => {
          console.error("Erro na requisição POST Axios:", err);
          Alert.alert('Erro', 'Não foi possível criar a Tarefa. Verifique a conexão.');
        })
        .finally(() => {
          setLoadingTarefas(false);
        });
    };

    return (
      <ScrollView style={styles.container}>

        <TouchableOpacity style = {styles.buttonVoltar} onPress={()=>navigation.goBack()}>
            <Text style={styles.buttonText}> Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Nova Tarefa</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>titulo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o titulo da tarefa..."
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            placeholder="descrição da tarefa..."
            value={descricao}
            onChangeText={setDescricao}
          />

          <Text style={styles.label}>Data limite:</Text>

          <TextInput 
            style={styles.input}
            placeholder="DD-MM-AAAA"
            maxLength={10}
            keyboardType="numeric"
            value={dataFinal}
            onChangeText={(text) => setDataFinal(formatarDataTempoReal(text))}
          />

          <Text style={styles.label}>Projeto:</Text>

          <View style={styles.containerSelect}>
            <Picker
              style={styles.picker}
              selectedValue={projeto_id}
              onValueChange={(idProjeto) => setProjeto_id(idProjeto)}
            >
              <Picker.Item
                label="Selecione um projeto"
                value=""
              />

              {projetos.map((projeto)=> (
                <Picker.Item
                  key={projeto.id}
                  label={projeto.nome}
                  value={projeto.id}
                />
              )
            )}
            </Picker>
          </View>

          <TouchableOpacity style={styles.button}
            onPress={enviarDados}
            disabled={loadingTarefas}>
            {loadingTarefas ? (
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