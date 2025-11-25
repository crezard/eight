import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PartOfSpeech, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize API client. We assume the key is valid as per instructions.
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to get cached content or fetch new
export const generateExplanation = async (part: PartOfSpeech, koreanName: string): Promise<string> => {
  try {
    const prompt = `
      You are an energetic and kind English teacher for Korean middle school students (Grade 1).
      Explain the part of speech: "${part}" (${koreanName}).
      
      Structure:
      1. **Definition**: Simple definition in Korean.
      2. **Role**: What does it do in a sentence? (Korean)
      3. **Examples**: Provide 3 distinct English sentences using this part of speech. Highlight the word in **bold**. Provide Korean translation for each sentence.
      4. **Fun Fact**: A short, interesting tip or memory aid about this part of speech in Korean.

      Use emojis to make it fun. Keep the tone encouraging and easy to understand.
      Output in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly middle school English teacher named 'Galaxy Teacher'.",
        temperature: 0.7,
      }
    });

    return response.text || "설명을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "AI 선생님이 잠시 쉬는 중이에요! 잠시 후 다시 시도해주세요.";
  }
};

export const generateQuiz = async (part: PartOfSpeech): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Generate 3 multiple-choice questions to test a Korean middle school student's understanding of "${part}".`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text in Korean or simple English" },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "4 options for the answer"
          },
          correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
          explanation: { type: Type.STRING, description: "Why this is the correct answer (in Korean)" }
        },
        required: ["question", "options", "correctAnswer", "explanation"],
        propertyOrdering: ["question", "options", "correctAnswer", "explanation"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.5, // Lower temperature for factual quizzes
        systemInstruction: `Create suitable questions for Grade 1 Middle School students in Korea. 
        Focus on identifying the '${part}' in a sentence or choosing the correct '${part}' to fill in the blank.`
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};

export const chatWithTeacher = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            config: {
                systemInstruction: "You are a helpful AI tutor specializing in English grammar for Korean students. Keep answers concise, encouraging, and use Korean for explanations unless asked otherwise."
            },
            history: history
        });

        const result = await chat.sendMessage({ message });
        return result.text || "죄송해요, 이해하지 못했어요.";
    } catch (e) {
        console.error(e);
        return "오류가 발생했습니다.";
    }
}
