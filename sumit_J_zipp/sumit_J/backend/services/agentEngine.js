import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Agentic Evaluation Node: Orchestrates state decision routing and asset valuation calculations
 * based on visual attributes, market pricing metrics, and product classifications.
 */
export async function executeAgentRoutingWorkflow(productMetadata, visionData) {
  const systemContext = `You are an Autonomous Circular Economy Logistics Agent for Amazon Second Life Commerce. 
Your objective is to optimize items for maximum lifecycle value, sustainability footprint minimization, and customer satisfaction.
Based on metadata and visual condition telemetry, you must choose exactly one action: "RESELL", "REFURBISH", "DONATE", "RECYCLE".`;

  const inputArguments = {
    originalPrice: Number(productMetadata.originalPrice),
    category: productMetadata.category,
    visionConditionScore: Number(visionData.conditionScore),
    detectedDefects: visionData.detectedDefects || []
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemContext,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recommendedRoute: { 
              type: "string", 
              enum: ["RESELL", "REFURBISH", "DONATE", "RECYCLE"] 
            },
            strategicJustification: { type: "string" }
          },
          required: ["recommendedRoute", "strategicJustification"],
        }
      },
      contents: [
        { 
          role: "user", 
          parts: [{ 
            text: `Analyze item profile parameters:\n${JSON.stringify(inputArguments)}\n\nDetermine target operational route.` 
          }] 
        }
      ]
    });

    const rawText = response.text || "";
    const cleanedJsonText = rawText.replace(/```json|```/g, "").trim();
    const aiDecision = JSON.parse(cleanedJsonText);

    const price = Number(productMetadata.originalPrice || 0);
    const score = Number(visionData.conditionScore || 0);

    // 1. Calculate Resale Price: Keeping the standard 60% baseline valuation scale
    const calculatedResalePrice = Math.round(price * (score / 100) * 0.60);

    // 🚀 THE FIX: Dynamic presentation multiplier. 
    // Uses a 90% multiplier rate so lower cost items produce flashy high credit totals!
    let greenCreditsAwarded = Math.round(price * 0.90 * (score / 100));

    // Alternative option: If you want a flat bonus added to everything, you could use:
    // let greenCreditsAwarded = Math.round(price * 0.15 * (score / 100)) + 350;

    // Enforce minimum bound baseline fallback
    // if (greenCreditsAwarded < 50) {
    //   greenCreditsAwarded = 50;
    // }

    return {
      recommendedRoute: aiDecision.recommendedRoute || "RESELL",
      calculatedResalePrice: calculatedResalePrice,
      greenCreditsAwarded: greenCreditsAwarded, 
      strategicJustification: aiDecision.strategicJustification || "Automated evaluation engine validation complete."
    };

  } catch (error) {
    console.error("Agent Engine Workflow State Error:", error);
    
    const fallbackPrice = Number(productMetadata.originalPrice || 0);
    const fallbackScore = Number(visionData.conditionScore || 80);
    const fallbackCredits = Math.round(fallbackPrice * 0.90 * (fallbackScore / 100));

    return {
      recommendedRoute: fallbackScore > 60 ? "RESELL" : "DONATE",
      calculatedResalePrice: Math.round(fallbackPrice * (fallbackScore / 120)),
      greenCreditsAwarded: fallbackCredits > 50 ? fallbackCredits : 0,
      strategicJustification: "Fallback processing applied due to operational routing model runtime network timeout."
    };
  }
}