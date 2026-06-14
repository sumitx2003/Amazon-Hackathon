import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Executes multimodal image analysis to extract product structural wear metrics.
 * @param {string} base64Image - Pure base64 data URL string of product
 * @param {string} category - Category category string (e.g. "Electronics")
 */
export async function evaluateProductCondition(base64Image, category) {
  try {
    // Strip metadata headers cleanly from the image string if present
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // Leverage native schemas instead of fragile prompt string constraints
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            conditionScore: { type: "integer", description: "Integer scale between 1 and 100" },
            detectedDefects: {
              type: "array",
              items: { type: "string" },
              description: "List of issues detected from the image"
            },
            gradingSummary: { type: "string", description: "Concise summary sentence explaining structural status." }
          },
          required: ["conditionScore", "detectedDefects", "gradingSummary"]
        }
      },
      // Fixed: Wrapped parts inside a proper user-role structural content object
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
              },
            },
            {
              text: `Analyze this returned product image for an e-commerce ecosystem. Category context: ${category}. Assess scratches, dents, degradation, cleanliness, and structural condition.`
            }
          ]
        }
      ],
    });

    const outputText = response.text || "{}";
    
    // Clean up unexpected markdown tags safely if any are returned, then parse
    const cleanedJson = outputText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini Multi-Modal API failure:", error);
    throw new Error(`Failed structural extraction from vision layer: ${error.message}`);
  }
}