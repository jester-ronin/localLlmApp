import { TextInput, View, Text, StyleSheet, Button, Image } from "react-native";
import PromptScreen from "./components/PromptScreen/PromptScreen";
import { useAutoGradientColor } from "./components/GetGradientColor/useAutoGradientColor";
import { imageUrl } from "./utils/imageURL";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const { gradientColors } = useAutoGradientColor(imageUrl);

  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientColors}
    >
      <PromptScreen />
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  gradient: {
    flex: 1,
  }
});