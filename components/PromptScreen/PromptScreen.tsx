import { useState } from "react";
import { TextInput, View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useChatApi } from "../api/useChatApi";
import { imageSource } from "../../utils/imageURL";
import { compressImageToBase64 } from "../../utils/compressImage";


const PromptScreen: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [finalValue, setFinalValue] = useState<string>("");
    const { apiResponse, isLoading, sendPrompt } = useChatApi();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    function handleSave(value: string) {
        setFinalValue(value)
    }

    function handleRemoveImage() {
        setSelectedImage(null);
    }

    async function handlePickImage() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: false,
        });

        if (result.canceled) {
            return;
        }

        const asset = result.assets[0];
        const compressedImage = await compressImageToBase64(asset.uri);

        if (!compressedImage) {
            return;
        }

        setSelectedImage(compressedImage);
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
        >
            <View>
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                    />
                </View>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите запрос"
                        value={prompt}
                        onChangeText={setPrompt}
                    />
                    <TouchableOpacity
                        style={[styles.imageButton, selectedImage && styles.imageButtonSelected]}
                        onPress={handlePickImage}
                        disabled={isLoading}
                    >
                        <Text style={styles.imageButtonText}>{selectedImage ? "✓" : "+"}</Text>
                    </TouchableOpacity>
                </View>
                {selectedImage && (
                    <View style={styles.selectedImagePreviewContainer}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.selectedImagePreview}
                        />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={handleRemoveImage}
                            disabled={isLoading}
                        >
                            <Text style={styles.removeImageButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Text>{"\u0412\u044b \u0432\u0432\u0435\u043b\u0438"}: {finalValue}</Text>
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            const imageToSend = selectedImage;
                            const wasSent = await sendPrompt(prompt, imageToSend);

                            if (wasSent) {
                                handleSave(prompt.trim() || "Изображение");
                            }

                            if (imageToSend) {
                                setSelectedImage(null);
                            }
                        }}
                        disabled={isLoading || (!prompt.trim() && !selectedImage)}
                    >
                        <Text>Отправить запрос</Text>
                    </TouchableOpacity>
                    {isLoading && (
                        <View>
                            <Text style={styles.textSending}>Отправляем...</Text>
                            <ActivityIndicator size="large" color="#72b6ff" />
                        </View>
                    )}
                </View>
                <View style={apiResponse ? styles.responseView : styles.responseViewEmpty}>
                    {apiResponse && <Text style={styles.responseText}>Ответ сервера: {apiResponse}
                    </Text>}
                </View>
            </View>
        </ScrollView>
    )
}

export default PromptScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "transparent",
    },
    content: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 25,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        paddingHorizontal: 10,
        backgroundColor: "#EDE8D0",
        borderRadius: 10,
        color: "black"
    },
    imageButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#72b6ff",
    },
    imageButtonSelected: {
        backgroundColor: "#58c783",
    },
    imageButtonText: {
        fontSize: 22,
        lineHeight: 24,
    },
    selectedImagePreviewContainer: {
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    selectedImagePreview: {
        width: 64,
        height: 64,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
    },
    removeImageButton: {
        position: "absolute",
        top: -8,
        right: -8,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f1f1f",
    },
    removeImageButtonText: {
        color: "#fff",
        fontSize: 16,
        lineHeight: 18,
    },
    buttonView: {
        marginTop: 10,
    },
    responseView: {
        marginTop: 20,
        borderWidth: 4,
        borderStyle: 'dashed',
        backgroundColor: "#EDE8D0",
    },
    responseViewEmpty: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#72b6ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3,
    },
    textSending: {
        marginTop: 10,
        alignItems: 'center',
    },
    responseText: {
        padding: 20
    },
    image: {
        width: 250,
        height: 250,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 70
    },

});
