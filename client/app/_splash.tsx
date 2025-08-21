import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BillGuard</Text>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 20 },
});
