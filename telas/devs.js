import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function DevScreen() {
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Equipe de Desenvolvimento</Text>
        <Text style={styles.subtitle}>
          Conheça quem construiu o TaskFlow 🚀
        </Text>
      </View>

      {/* CARDS */}

      <View style={styles.card}>
        <Image source={require("../assets/fel.jpeg")} style={styles.image} />
        <Text style={styles.name}>Felipe Oliveira</Text>
        <Text style={styles.role}>Desenvolvedor</Text>
      </View>

      <View style={styles.card}>
        <Image source={require("../assets/vit.jpeg")} style={styles.image} />
        <Text style={styles.name}>Vitor Scarabelli</Text>
        <Text style={styles.role}>Desenvolvedor</Text>
      </View>

      <View style={styles.card}>
        <Image source={require("../assets/dia.jpeg")} style={styles.image} />
        <Text style={styles.name}>Matheus Dias</Text>
        <Text style={styles.role}>Desenvolvedor</Text>
      </View>

      <View style={styles.card}>
        <Image source={require("../assets/mat.jpeg")} style={styles.image} />
        <Text style={styles.name}>Mateus Vitor</Text>
        <Text style={styles.role}>Desenvolvedor</Text>
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

  /* HEADER */
  header: {
    backgroundColor: "#5B86B3",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    alignItems: "center"
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },

  subtitle: {
    fontSize: 13,
    color: "#E3F2FD",
    marginTop: 5,
    textAlign: "center"
  },

  /* CARDS */
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E5F87"
  },

  role: {
    fontSize: 13,
    color: "#777",
    marginTop: 2
  }

});