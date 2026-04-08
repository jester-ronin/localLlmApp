// src/hooks/useChatApi.ts
import { useState } from "react";
import extractAnswer from "../../utils/extractAnswer";

export const useChatApi = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendPrompt = async (prompt: string) => {
        if (!prompt.trim()) return;

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

            if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

            const data = await response.json();
            const content = data.choices[0].message.content;
            setApiResponse(extractAnswer(content));

        } catch (error) {
            console.error(error);
            setApiResponse("Ошибка при получении данных");
        } finally {
            setIsLoading(false);
        }
    };

    return { apiResponse, isLoading, sendPrompt };
};
