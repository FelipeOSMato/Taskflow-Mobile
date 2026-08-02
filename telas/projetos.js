import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Modal
} from "react-native";
import React, { useState, useEffect, useCallback} from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import axios from "axios";

const API_URL = `http://127.0.0.1:8000/api/projeto`
const API_DELETE = `http://127.0.0.1:8000/api/excluir-projeto`

export default function HomeScreen() {

  const [projetos, setProjetos] = useState([]);
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

    useFocusEffect(
      useCallback(() => {
      axios.get(API_URL)
        .then((response) => {
          setProjetos(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro na requisição Axios:", err);
          setError('Não foi possível carregar os contatos.');
          setLoading(false);
        });
    },[]));

  const excluirProjeto = async (id)=>{
    try{
      //Deleta o projeto selecionada puxando o ID
      await axios.delete(`${API_DELETE}/${id}`);

      //Atualiza a lista em tempo real
      setProjetos(prev => prev.filter(p=>p.id !== id))

      setDeleteModalVisible(false)
      setModalVisible(false)
    }catch (error){
      console.log(error)
      alert('Erro ao excluir projeto!')
    }
  }

  const verificarProjeto = (projeto) => {
      if(projeto.quantiaTarefas > 0){
        alert("Este projeto possui tarefas e não pode ser excluído.")
      }else{
        setDeleteModalVisible(true);
      }
  }


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
    <View style={styles.container}>

      <FlatList
        data={projetos}
        keyExtractor={(item) => item.id}

        ListHeaderComponent={
          <View>

            {/* HEADER AZUL */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Lista de projetos</Text>
              <Text style={styles.subtitle}>
                Gerencie os projetos do aplicativo
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Projetos cadastrados</Text>

          </View>
        }

        ListFooterComponent={
          <TouchableOpacity 
            style={styles.addButton}
            onPress={()=> navigation.navigate("CadastroProjeto")}
          >
            <Text style={styles.addButtonText}>+ Novo Projeto</Text>
          </TouchableOpacity>
        }

        /* RENDER */
        renderItem={({ item }) => (
          <View
            style={
              styles.projetoCard
            }
          >
            <View style={styles.projetoRow}>
                <TouchableOpacity 
                  style={styles.projetoTextRow}
                  onPress={() => {
                      setSelectedProjeto(item);
                      setModalVisible(true);
                  }}
                >
                  <Text style={styles.projetoName}>{item.nome}</Text>
                  <Text style={styles.projetoDesc}>{item.descricao}</Text>
                </TouchableOpacity>

                <View style={styles.projetoBtnRow}>

                  <TouchableOpacity
                      style = {styles.updateButton}
                      onPress={() => {
                          setModalVisible(false)
                          navigation.navigate("EditarProjeto", {
                              projeto: item
                          })
                        }
                      }
                  >
                      <Text style={styles.closeButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled = {item.quantiaTarefas > 0}
                    style = {[
                      styles.deleteButton,
                      item.quantiaTarefas > 0 && {backgroundColor: "#BDBDBD"}
                    ]}
                    onPress={()=>{
                      setTaskToDelete(item)
                      verificarProjeto(item)
                    }}
                  >
                    <Text style={styles.closeButtonText}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />

      

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              {selectedProjeto?.nome}
            </Text>

            <Text style={styles.modalLabel}>Descrição: </Text>
            <Text style={styles.modalText}>
              {selectedProjeto?.descricao}
            </Text>

            <Text style={styles.modalLabel}>Usuario: </Text>
            <Text style={styles.modalText}>
              {selectedProjeto?.usuario_nome}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>

            <Text style={styles.modalTitle}>
              Excluir projeto
            </Text>

            <Text style={styles.modalText}>
              Tem certeza que deseja excluir{" "}
              <Text style={{ fontWeight: "bold" }}>
                {taskToDelete?.nome}
              </Text>
              ?
            </Text>

            <View style={styles.deleteActions}>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteModalButton}
                onPress={() => excluirProjeto(taskToDelete.id)}
              >
                <Text style={styles.closeButtonText}>Excluir</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20
  },

  /* HEADER */
  header: {
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#5B86B3"
  },

  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  },

  subtitle: {
    color: "#E3F2FD",
    marginTop: 5,
    textAlign: "center"
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#3E5F87"
  },

  /* CARD */
  projetoCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#3E5F87"
  },

  projetoName: {
    fontSize: 16,
    fontWeight: "600"
  },

  projetoDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 2
  },

  projetoStatus: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "bold"
  },

  /* BOTÃO */
  addButton: {
    backgroundColor: "#5B86B3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "80%"
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3E5F87"
  },

  modalLabel: {
    fontSize: 13,
    color: "#777",
    marginTop: 10
  },

  modalText: {
    fontSize: 14,
    marginTop: 3
  },

  modalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 5,
    alignSelf: "flex-start",
    fontWeight: "bold",
    backgroundColor: "#E0E0E0"
  },

  closeButton: {
    backgroundColor: "#5B86B3",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  /* API */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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

  deleteModal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  deleteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#757575",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 8,
  },

  deleteButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalButton: {
    flex: 1,
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 8,
  },
  updateButton: {
    backgroundColor: "#054c97",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  projetoTextRow:{
    width: "50%",
    flexDirection: "column",
  },
  projetoBtnRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
  },
  projetoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: 'space-between'
  },
});