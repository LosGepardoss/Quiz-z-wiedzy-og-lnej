import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question } from "../types";

const RESPONSE_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      questionText: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Lista dokładnie 4 możliwych odpowiedzi."
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "Indeks poprawnej odpowiedzi (0-3)."
      }
    },
    required: ["questionText", "options", "correctAnswerIndex"]
  }
};

export const fetchQuizQuestions = async (difficulty: number): Promise<Question[]> => {
  const SYSTEM_INSTRUCTION = `
Jesteś twórcą quizów. Twoim zadaniem jest sprawdzenie wiedzy użytkownika.
Wygeneruj listę pytań z wiedzy ogólnej.
Poziom trudności: ${difficulty}/10.
Język: Polski.
Styl pytań: Konkretny, jasny.
Ilość: 30 pytań.
Każde pytanie musi mieć 4 warianty odpowiedzi, z których tylko jedna jest poprawna.
`;

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Brak klucza API (API_KEY)");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Podaj 30 pytań z wiedzy ogólnej w formacie JSON.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Pusta odpowiedź od modelu.");
    }

    const data = JSON.parse(text) as Question[];
    return data;

  } catch (error) {
    console.error("Quiz generation failed:", error);
    // Fallback questions
    return [
      {
        questionText: "Które zwierzę jest symbolem WWF?",
        options: ["Panda wielka", "Tygrys", "Słoń afrykański", "Orzeł bielik"],
        correctAnswerIndex: 0
      },
      {
        questionText: "Ile dni ma rok przestępny?",
        options: ["365", "366", "364", "360"],
        correctAnswerIndex: 1
      },
      {
        questionText: "Stolicą Francji jest:",
        options: ["Lyon", "Marsylia", "Paryż", "Nicea"],
        correctAnswerIndex: 2
      },
      {
        questionText: "Kto namalował 'Monę Lisę'?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswerIndex: 2
      },
      {
        questionText: "Jaki jest symbol chemiczny tlenu?",
        options: ["T", "Ox", "O", "Tl"],
        correctAnswerIndex: 2
      }
    ];
  }
};