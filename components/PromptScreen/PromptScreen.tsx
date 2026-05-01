import { useState } from "react";
import { TextInput, View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView } from "react-native";
import { useChatApi } from "../api/useChatApi";
import { imageUrl } from "../../utils/imageURL";


const PromptScreen: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [finalValue, setFinalValue] = useState<string>("");
    const { apiResponse, isLoading, sendPrompt } = useChatApi();

    function handleSave() {
        setFinalValue(prompt)
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
        >
            <View>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Введите запрос"
                    value={prompt}
                    onChangeText={setPrompt}
                />
                <Text>Вы ввели: {finalValue}</Text>
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            const wasSent = await sendPrompt(prompt);

                            if (wasSent) {
                                handleSave();
                            }
                        }}
                        disabled={isLoading || !prompt.trim()}
                    >
                        <Text>Отправить запрос</Text>
                    </TouchableOpacity>
                    {isLoading && (
                        <View>
                            <Text style={styles.textSending}>Отправляем текст...</Text>
                            <ActivityIndicator size="large" color="#72b6ff" />
                        </View>
                    )}
                </View>
                <View style={styles.responseView}>
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#EDE8D0",
        borderRadius: 10
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
