import { TextInput, View, Text, StyleSheet, Button, Image } from "react-native";
import PromptScreen from "./components/PromptScreen/PromptScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <PromptScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});