import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import axios from "axios";

export default function CadastroScreen() {
  const [form, setForm] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const [erro, setErro] = useState("");

  const buscarEndereco = async () => {
    const cepLimpo = form.cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      Alert.alert("Erro", "Digite um CEP válido com 8 números");
      return;
    }

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (response.data.erro) {
        setErro("CEP não encontrado");
        return;
      }

      setErro("");

      setForm((prev) => ({
        ...prev,
        logradouro: response.data.logradouro || "",
        complemento: response.data.complemento || "",
        bairro: response.data.bairro || "",
        cidade: response.data.localidade || "",
        estado: response.data.uf || ""
      }));

    } catch (error) {
      setErro("Erro ao buscar o CEP");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastro de Endereço</Text>
        <Text style={styles.subtitle}>
          Buscar endereço pelo CEP
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          placeholder="00000-000"
          keyboardType="numeric"
          value={form.cep}
          onChangeText={(text) =>
            setForm({ ...form, cep: text })
          }
        />

        <TouchableOpacity style={styles.button} onPress={buscarEndereco}>
          <Text style={styles.buttonText}>Buscar Endereço</Text>
        </TouchableOpacity>

        {erro !== "" && (
          <Text style={{ color: "red", marginTop: 10 }}>
            {erro}
          </Text>
        )}

        <Text style={styles.label}>Logradouro</Text>
        <TextInput
          style={styles.input}
          value={form.logradouro}
          onChangeText={(text) =>
            setForm({ ...form, logradouro: text })
          }
        />

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.numero}
          onChangeText={(text) =>
            setForm({ ...form, numero: text })
          }
        />

        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          value={form.complemento}
          onChangeText={(text) =>
            setForm({ ...form, complemento: text })
          }
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={form.bairro}
          onChangeText={(text) =>
            setForm({ ...form, bairro: text })
          }
        />

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          style={styles.input}
          value={form.cidade}
          onChangeText={(text) =>
            setForm({ ...form, cidade: text })
          }
        />

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={styles.input}
          value={form.estado}
          onChangeText={(text) =>
            setForm({ ...form, estado: text })
          }
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
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
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});