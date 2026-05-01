// src/hooks/useChatApi.ts
import { useState } from "react";
import { LLM_CHAT_COMPLETIONS_URL, LLM_MODEL } from "../../utils/apiConfig";
import extractAnswer from "../../utils/extractAnswer";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type ChatCompletionResponse = {
    choices?: {
        message?: {
            content?: string;
        };
    }[];
};

function getApiErrorMessage(error: unknown) {
    if (error instanceof Error) {
        if (error.message === "Network request failed") {
            return "Не удалось подключиться к серверу. Проверь IP компьютера, Wi-Fi, firewall и запущен ли LLM-сервер.";
        }

        return error.message;
    }

    return "Неизвестная ошибка при получении данных";
}

export const useChatApi = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const sendPrompt = async (prompt: string) => {
        if (!prompt.trim() || isLoading) return false;

        const newUserMessage: Message = {
            role: "user",
            content: prompt
        };

        const requestMessages = [...messages, newUserMessage];

        setIsLoading(true);
        setApiResponse(null);

        try {
            const response = await fetch(LLM_CHAT_COMPLETIONS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: LLM_MODEL,
                    messages: requestMessages
                })
            });

            if (!response.ok) {
                throw new Error(`Сервер ответил с ошибкой: ${response.status}`);
            }

            const data: ChatCompletionResponse = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error("Сервер ответил, но в ответе нет текста от модели");
            }

            setApiResponse(extractAnswer(content));

            setMessages([
                ...requestMessages,
                { role: "assistant", content }
            ]);

            return true;
        } catch (error) {
            console.error(error);
            setApiResponse(getApiErrorMessage(error));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { apiResponse, isLoading, sendPrompt };
};
