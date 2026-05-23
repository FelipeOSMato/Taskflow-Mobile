import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import axios from 'axios';

// IP do seu PC
const API_URL = 'http://10.67.5.52:8000/api/contato'; 

export default function App() {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setContatos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro na requisição Axios:", err);
        setError('Não foi possível carregar os contatos.');
        setLoading(false);
      });
  }, []);

  
  const renderContato = ({ item }) => (
    <View style={styles.card}>
      <Text>{item.nome}</Text>
      <Text>{item.email}</Text>
      <Text>
        <Text>Assunto:</Text> {item.assunto}
      </Text>
      <Text>{item.mensagem}</Text>
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando contatos...</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Contatos</Text>
      
      <FlatList
        data={contatos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContato}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum contato encontrado.</Text>}
      />
    </SafeAreaView>
  );
}