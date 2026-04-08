import { useState } from "react";
import { TextInput, View, Text, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
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
        <>
            <View style={styles.container}>
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
                        onPress={
                            () => {
                                sendPrompt(prompt);
                                handleSave();
                            }}
                        disabled={isLoading || !prompt.trim()}
                    >
                        <Text>Отправить запрос</Text>
                    </TouchableOpacity>
                    {isLoading && (
                        <Text style={styles.textSending}>Отправляем текст...</Text>
                    )}
                </View>
                <View style={styles.responseView}>
                    {apiResponse && <Text style={styles.responseText}>Ответ сервера: {apiResponse}
                    </Text>}
                </View>
            </View>
        </>
    )
}

export default PromptScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "white"
    },
    buttonView: {
        marginTop: 10,
    },
    responseView: {
        marginTop: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: "white"
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
        color: "blue"
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