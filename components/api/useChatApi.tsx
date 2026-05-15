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

function getAssistantContent(data: ChatCompletionResponse) {
    const message = data.choices?.[0]?.message;
    const content = message?.content?.trim();

    if (content) {
        return content;
    }

    return null;
}

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
            const content = getAssistantContent(data);

            if (!content) {
                throw new Error("\u0421\u0435\u0440\u0432\u0435\u0440 \u043e\u0442\u0432\u0435\u0442\u0438\u043b, \u043d\u043e \u043c\u043e\u0434\u0435\u043b\u044c \u043d\u0435 \u0432\u0435\u0440\u043d\u0443\u043b\u0430 \u0442\u0435\u043a\u0441\u0442. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u0434\u0440\u0443\u0433\u043e\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0438\u043b\u0438 \u0443\u0431\u0435\u0434\u0438\u0441\u044c, \u0447\u0442\u043e \u0432 LM Studio \u0432\u044b\u0431\u0440\u0430\u043d\u0430 vision-\u043c\u043e\u0434\u0435\u043b\u044c.");
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
