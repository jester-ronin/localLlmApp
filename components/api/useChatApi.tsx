// src/hooks/useChatApi.ts
import { useState } from "react";
import { LLM_CHAT_COMPLETIONS_URL, LLM_MODEL } from "../../utils/apiConfig";
import extractAnswer from "../../utils/extractAnswer";

const DEFAULT_IMAGE_PROMPT = "Опиши изображение.";

type TextContent = {
    type: "text";
    text: string;
};

type ImageContent = {
    type: "image_url";
    image_url: {
        url: string;
    };
};

type Message = {
    role: "user" | "assistant";
    content: string | Array<TextContent | ImageContent>;
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

    const sendPrompt = async (prompt: string, image: string | null = null) => {
        const promptText = prompt.trim();

        if ((!promptText && !image) || isLoading) return false;

        const imageContent: ImageContent | null = image
            ? {
                type: "image_url",
                image_url: {
                    url: image
                }
            }
            : null;
        const messageText = promptText || DEFAULT_IMAGE_PROMPT;

        const newUserMessage: Message = {
            role: "user",
            content: imageContent
                ? [
                    { type: "text", text: messageText },
                    imageContent
                ]
                : promptText
        };

        const requestMessages = [...messages, newUserMessage];
        const savedUserMessage: Message = {
            role: "user",
            content: promptText || DEFAULT_IMAGE_PROMPT
        };

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
                ...messages,
                savedUserMessage,
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
