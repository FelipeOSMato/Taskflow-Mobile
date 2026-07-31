import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal
} from "react-native";
import React, { useState, useEffect, useCallback} from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import axios from "axios";

const API_URL ="http://127.0.0.1:8000/api/tarefa";
const API_DELETE ="http://127.0.0.1:8000/api/excluir-tarefa"
const API_CONCLUIR ="http://127.0.0.1:8000/api/concluir-tarefa"
const API_DESFAZER ="http://127.0.0.1:8000/api/desfazer-tarefa"

export default function HomeScreen() {
  
  const [tarefas, setTarefas] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [tarefaConcluida, setTarefaConcluida] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  //função de exclusão
  const excluirTarefa = async (id)=>{
    try{
      //Deleta a tarefa selecionada puxando o ID
      await axios.delete(`${API_DELETE}/${id}`);

      //Atualiza a lista em tempo real
      setTarefas(prev => prev.filter(t=>t.id !== id))

      setDeleteModalVisible(false)
      setModalVisible(false)
    }catch (error){
      console.log(error)
      alert('Erro ao excluir tarefa!')
    }
  }
  //função de alterção
  const alterarStatus = async (id, status) => {
    try{ 
      let response

        if (status === "Pendente"){
          response = await axios.put(`${API_CONCLUIR}/${id}`)
        }else if (status === "Concluída"){
          response = await axios.put(`${API_DESFAZER}/${id}`)
        }

        setTarefas(prev => prev.map(t=> t.id === id ? response.data : t))

        setSelectedTask(response.data)
    }catch (error){
      console.log(error)
      alert('Erro ao alterar status!')
    }
  }

    useFocusEffect(
      useCallback(() => {
      axios.get(API_URL)
        .then((response) => {
          setTarefas(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro na requisição Axios:", err);
          setError('Não foi possível carregar as Tarefas.');
          setLoading(false);
        });
    },[]));

  const getStatusColor = (status) =>
    status === "Concluída" ? "#4CAF50" : "#FF9800";

  const getStatusButtonColor = (status) =>
    status === "Concluída" ? "#FF9800" : "#4CAF50";

  if (loading) {
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

  return (
    <View style={styles.container}>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>

            {/* HEADER AZUL */}
            <View style={styles.header}>
              <Text style={styles.greeting}>Bem-vindo ao TaskFlow</Text>
              <Text style={styles.subtitle}>
                Suas tarefas na palma da sua mão!
              </Text>
            </View>

            {/* CARDS */}
            <View style={styles.statsContainer}>

              <View style={[styles.card, { backgroundColor: "#BBDEFB" }]}>
                <Text style={[styles.cardNumber, { color: "#0D47A1" }]}>
                  {tarefas.length}
                </Text>
                <Text style={styles.cardText}>Tarefas</Text>
              </View>

              <View style={[styles.card, { backgroundColor: "#C8E6C9" }]}>
                <Text style={[styles.cardNumber, { color: "#1B5E20" }]}>
                  {tarefas.filter(t => t.status === "Concluída").length}
                </Text>
                <Text style={styles.cardText}>Concluídas</Text>
              </View>

              <View style={[styles.card, { backgroundColor: "#FFE0B2" }]}>
                <Text style={[styles.cardNumber, { color: "#E65100" }]}>
                  {tarefas.filter(t => t.status === "Pendente").length}
                </Text>
                <Text style={styles.cardText}>Pendentes</Text>
              </View>

            </View>

            <Text style={styles.sectionTitle}>Suas tarefas</Text>

          </View>
        }

        ListFooterComponent={
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("CadastroTarefa")}
          >
            <Text style={styles.addButtonText}>+ Nova tarefa</Text>
          </TouchableOpacity>
        }

        /* RENDER */
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskCard,
              {
                borderLeftWidth: 5,
                borderLeftColor: getStatusColor(item.status)
              }
            ]}
          >
            <View style={styles.taskRow}>
                <TouchableOpacity 
                  style={styles.taskTextRow}
                  onPress={() => {
                      setSelectedTask(item);
                      setModalVisible(true);
                  }}
                >
                  <Text style={styles.taskTitle}>{item.titulo}</Text>
                  <Text
                    style={[
                      styles.taskStatus,
                      { color: getStatusColor(item.status) }
                    ]}
                  >
                    {item.status}
                  </Text> 
                </TouchableOpacity>

                <View style={styles.taskBtnRow}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,{
                        backgroundColor: getStatusButtonColor(item.status)
                      }
                    ]}
                    onPress={() =>
                        alterarStatus(item.id, item.status)
                    } 
                  >
                    <Text style={styles.closeButtonText}>
                        {item.status === "Pendente" ? "Concluir" : "Desfazer"}
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      setTaskToDelete(item)
                      setDeleteModalVisible(true)
                    }}
                  >
                    <Text style={styles.closeButtonText}>Excluir</Text>
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
              {selectedTask?.titulo}
            </Text>

            <Text style={styles.modalLabel}>Descrição:</Text>
            <Text style={styles.modalText}>
              {selectedTask?.descricao}
            </Text>

            <Text style={styles.modalLabel}>Projeto:</Text>
            <Text style={styles.modalText}>
              {selectedTask?.projeto_nome}
            </Text>

            <Text style={styles.modalLabel}>Data final:</Text>
            <Text style={styles.modalText}>
              {selectedTask?.data_fim}
            </Text>

            <Text style={styles.modalLabel}>Status:</Text>
            <Text
              style={[
                styles.modalBadge,
                {
                  backgroundColor: getStatusColor(
                    selectedTask?.status
                  )
                }
              ]}
            >
              {selectedTask?.status}
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

      {/*MODAL DE DELETAR*/}
      <Modal
        visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>

            <Text style={styles.modalTitle}>
              Excluir tarefa
            </Text>

            <Text style={styles.modalText}>
              Tem certeza que deseja excluir{" "}
              <Text style={{ fontWeight: "bold" }}>
                {taskToDelete?.titulo}
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
                onPress={() => excluirTarefa(taskToDelete.id)}
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
    padding: 20,
  },

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
    marginTop: 5
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  card: {
    width: "30%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3
  },

  cardNumber: {
    fontSize: 18,
    fontWeight: "bold"
  },

  cardText: {
    fontSize: 12,
    color: "#555"
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#3E5F87"
  },

  taskCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600"
  },

  taskStatus: {
    fontSize: 13,
    marginTop: 4
  },

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
    color: "white",
    marginTop: 5,
    alignSelf: "flex-start",
    fontWeight: "bold"
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
  deleteModalButton: {
    flex: 1,
    backgroundColor: "#E53935",
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
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  taskTextRow:{
    width: "50%",
    flexDirection: "column",
  },
  taskBtnRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
  },
    taskRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: 'space-between'
  },


});