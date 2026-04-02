import { useState } from "react";
import { TextInput, View, Text, StyleSheet, Button, Image } from "react-native";
import extractAnswer from "../../utils/extractAnswer";


const PromptScreen: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    async function sendPrompt() {
        setIsLoading(true);
        try {
            const response = await fetch('http://192.168.1.103:1234/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "nemotron",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();

            if (data) {
                setApiResponse(JSON.stringify(extractAnswer(data.choices[0].message.content)));

            }

        } catch (error) {
            if (error instanceof Error) {
                console.error('Ошибка:', error.message);
            } else {
                console.error('Неизвестная ошибка:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Введите запрос"
                    value={prompt}
                    onChangeText={setPrompt}
                />
                <Text>Вы ввели: {prompt}</Text>
                <View style={styles.button}>
                    <Button title="Отправить запрос"
                        onPress={sendPrompt}
                        disabled={isLoading || !prompt.trim()}
                    />
                    {isLoading && (
                        <Text>Отправляем текст...</Text>
                    )}
                </View>
                <View style={styles.response}>
                    {apiResponse && <Text>Ответ сервера: {apiResponse}
                    </Text>}
                </View>

            </View>
            <View>
                {imageURL && (
                    <Image
                        source={{ uri: imageURL }}
                        style={{ width: 300, height: 300, marginTop: 20 }}
                    />
                )}
            </View>
        </>
    )
}

export default PromptScreen;

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 50 },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        marginTop: 10
    },
    response: {
        marginTop: 10
    }
});