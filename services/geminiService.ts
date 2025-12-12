import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message } from "../types";

// Initialize the client
// We default to an empty string to satisfy TypeScript strict mode.
// The Vite build process injects the actual key via the define plugin.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `You are "Gem", a sophisticated, crystalline AI assistant embedded in the Citrin: TBA Computer Science homepage. 
Your personality is helpful, precise, polite, and slightly futuristic. 
You are knowledgeable about computer science, technology, and general information.
Keep responses concise and easy to read in a chat bubble format.
If asked about yourself, describe yourself as a digital facet of the user's interface, designed to illuminate answers.`;

/**
 * Maps our internal message format to the Gemini SDK Content format
 */
const mapHistoryToContent = (messages: Message[]): Content[] => {
  return messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));
};

/**
 * Sends a message to the Gemini API and streams the response.
 */
export const streamGeminiResponse = async (
  previousMessages: Message[],
  newMessage: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    // We map the history of previous messages
    const history = mapHistoryToContent(previousMessages);

    const chat: Chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Error streaming from Gemini:", error);
    onChunk("\n\n*I encountered a glitch in my crystalline matrix. Please check your connection or API key.*");
  }
};