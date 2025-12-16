import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeClassroomImage = async (base64Image: string, mimeType: string): Promise<GeminiAnalysisResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: `Analyze this image for a classroom attendance application. 
            1. Count the number of students clearly visible.
            2. Determine if this looks like a valid classroom setting.
            3. Provide a brief description of the scene (seating arrangement, activity).
            4. Provide a confidence score (0-100) for the visibility of faces.
            
            Return the result in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            count: { type: Type.NUMBER, description: "Number of students detected" },
            isClassroom: { type: Type.BOOLEAN, description: "Whether the image appears to be a classroom" },
            description: { type: Type.STRING, description: "Brief visual description of the scene" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" }
          },
          required: ["count", "isClassroom", "description", "confidence"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiAnalysisResponse;
    }
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      count: 0,
      isClassroom: false,
      description: "Failed to analyze image. Please ensure API Key is valid.",
      confidence: 0
    };
  }
};