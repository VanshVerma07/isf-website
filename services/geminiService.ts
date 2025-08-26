
/**
 * IMPORTANT SECURITY REFACTOR:
 * The Gemini API key should never be exposed on the client-side.
 * This service is refactored to call a backend API endpoint (e.g., a Vercel Serverless Function)
 * which will securely handle the API key and communicate with the Gemini API.
 *
 * You need to create this endpoint. Example for Vercel (`/api/chat.ts`):
 *
 * import { GoogleGenAI, Chat } from "@google/genai";
 * // Plus Vercel AI SDK for streaming helpers
 *
 * export const config = {
 *   runtime: 'edge',
 * };
 *
 * export default async function handler(req: Request) {
 *   // ... (logic to handle POST request, get prompt)
 *   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
 *   const chat: Chat = ai.chats.create({ model: 'gemini-2.5-flash', ... });
 *   const stream = await chat.sendMessageStream({ message: prompt });
 *   // Return a streaming response
 * }
 */

async function* streamDecoder(response: Response) {
    if (!response.body) {
        throw new Error("Response body is null");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
    }
}

export const streamChatResponse = async (prompt: string) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `API request failed with status ${response.status}` }));
            throw new Error(errorData.error);
        }

        // Return a generator that yields text chunks from the streaming response.
        // The server must be set up to stream plain text chunks.
        return (async function*() {
            for await (const chunk of streamDecoder(response)) {
                yield { text: chunk };
            }
        })();

    } catch (error) {
        console.error("Chat API error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to get response from AI: ${message}`);
    }
};
