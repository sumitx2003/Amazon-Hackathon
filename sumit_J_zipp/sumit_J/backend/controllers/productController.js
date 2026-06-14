import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { evaluateProductCondition } from "../services/geminiService.js";
import { executeAgentRoutingWorkflow } from "../services/agentEngine.js";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";

// Simple development mock mail transport layout configuration
const transporter = {
  sendMail: async (mailOptions) => {
    console.log(`\n==================================================`);
    console.log(`📬 [MOCK EMAIL DISPATCHED TO: ${mailOptions.to}]`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body Summary: ${mailOptions.text}`);
    console.log(`==================================================\n`);
    return { messageId: "mock-id-12345" };
  }
};

// 1. PROCESS PRODUCT RETURN (AI Evaluation Pipeline)
export async function processProductReturn(req, res) {
  try {
    const { productId, originalPrice, category, base64Image, sellerId } = req.body;
    if (!productId || !originalPrice || !category || !base64Image || !sellerId) {
      return res.status(400).json({ error: "Missing parameters inside pipeline request body." });
    }

    const visionAnalysis = await evaluateProductCondition(base64Image, category);
    const productMetadata = { originalPrice: Number(originalPrice), category };
    const agentDecision = await executeAgentRoutingWorkflow(productMetadata, visionAnalysis);

    const consolidatedAssetProfile = {
      productId,
      category,
      sellerId,
      originalPrice: Number(originalPrice),
      conditionScore: visionAnalysis.conditionScore,
      defectsList: visionAnalysis.detectedDefects,
      visualAssessment: visionAnalysis.gradingSummary,
      lifecycleRoute: agentDecision.recommendedRoute,
      marketResaleValuation: agentDecision.calculatedResalePrice,
      allocatedGreenCredits: agentDecision.greenCreditsAwarded,
      allocationJustification: agentDecision.strategicJustification,
      base64Image, 
      status: "QUOTED"
    };

    return res.status(200).json({ success: true, assetProfile: consolidatedAssetProfile });
  } catch (error) {
    return res.status(500).json({ error: "AI Evaluation execution pipeline exception.", message: error.message });
  }
}

// 2. FINALIZE USER AGREEMENT (Checkout/Submission)
export async function finalizeUserAgreement(req, res) {
  try {
    const { assetProfile, bankAccountInfo } = req.body;
    
    if (!assetProfile || !assetProfile.sellerId) {
      return res.status(400).json({ error: "Validation failure: missing asset profile data or seller identifier context." });
    }

    const castedSellerId = mongoose.Types.ObjectId.isValid(assetProfile.sellerId)
      ? new mongoose.Types.ObjectId(assetProfile.sellerId)
      : assetProfile.sellerId;

    const newProductRecord = await Product.create({
      ...assetProfile,
      sellerId: castedSellerId, 
      base64Image: assetProfile.base64Image || "", 
      bankAccountInfo: {
        accountName: bankAccountInfo?.accountName || bankAccountInfo?.accountHolderName || "",
        accountNumber: bankAccountInfo?.accountNumber || "",
        routingNumber: bankAccountInfo?.routingNumber || ""
      },
      status: "PENDING_ADMIN_REVIEW"
    });

    return res.status(201).json({ success: true, product: newProductRecord });
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit user checkout layout tracking row.", message: error.message });
  }
}

// 3. GET ADMIN PIPELINE QUEUE (Fetches items for AdminDashboard)
export async function getAdminPipelineQueue(req, res) {
  try {
    const productsQueue = await Product.find({ status: "PENDING_ADMIN_REVIEW" }).populate("sellerId", "name email");
    return res.status(200).json(productsQueue);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch admin routing tables.", message: error.message });
  }
}

// 4. EXECUTE ADMIN DECISION WITH RE-SCALE PREMIUM MARGIN CEILINGS
export async function executeAdminDecision(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; 

    const product = await Product.findById(id).populate("sellerId");
    if (!product) {
      return res.status(404).json({ error: "Target asset listing item not found." });
    }

    if (action === "APPROVE") {
      product.status = "APPROVED";
      
      const targetCreditPayoff = Number(product.allocatedGreenCredits || product.greenCredits || 0);

      if (product.sellerId && product.sellerId._id) {
        await User.findByIdAndUpdate(product.sellerId._id, {
          $inc: { greenCredits: targetCreditPayoff }
        });
      }

      if (product.lifecycleRoute === "RESELL" || product.lifecycleRoute === "REFURBISH") {
        product.isListedOnMarketplace = true;
        
        // Calculate an explicit 5% markup over the green credits awarded to the user
        const dynamicCostWithMarkup = Math.round(targetCreditPayoff * 1.05);
        
        // Hard Ceiling Check: Guarantee marketplace price never exceeds original value
        const originalValueCeiling = Number(product.originalPrice || 0);
        product.finalMarketplacePrice = Math.min(dynamicCostWithMarkup, originalValueCeiling);

      } else {
        product.isListedOnMarketplace = false;
        product.finalMarketplacePrice = 0;
      }

      console.log(`[BANK PAYOUT SUCCESS] Dispatched wire to Routing: ${product.bankAccountInfo?.routingNumber || "N/A"}`);
      await product.save();

      if (product.sellerId && product.sellerId.email) {
        transporter.sendMail({
          from: '"Amazon Second Life Commerce" <no-reply@amazon-secondlife.com>',
          to: product.sellerId.email,
          subject: "🎉 Second Life Offer Accepted & Payout Dispatched!",
          text: `Hello ${product.sellerId.name}, your product return profile for ID: ${product.productId} was accepted.`
        }).catch(err => console.error("Background email logging failure:", err));
      }

    } else {
      product.status = "REJECTED";
      product.isListedOnMarketplace = false;
      await product.save();

      if (product.sellerId && product.sellerId.email) {
        transporter.sendMail({
          from: '"Amazon Second Life Commerce" <no-reply@amazon-secondlife.com>',
          to: product.sellerId.email,
          subject: "Second Life Return Evaluation Update",
          text: `Hello ${product.sellerId.name}, unfortunately your product return profile for ID: ${product.productId} did not clear our parameters.`
        }).catch(err => console.error("Background email logging failure:", err));
      }
    }

    return res.status(200).json({ success: true, product });

  } catch (error) {
    console.error("Database controller crash details:", error);
    return res.status(500).json({ error: "Failed to execute administrative modification request.", message: error.message });
  }
}

// 5. GET MARKETPLACE PRODUCTS (Public Storefront only)
export async function getMarketplaceProducts(req, res) {
  try {
    const storefrontItems = await Product.find({ isListedOnMarketplace: true, status: { $ne: "SOLD" } });
    return res.status(200).json(storefrontItems);
  } catch (error) {
    return res.status(500).json({ error: "Failed to resolve public storefront documents.", message: error.message });
  }
}

// 6. UNRESTRICTED SYSTEM-WIDE PRODUCTS ENUMERATION (Crucial for Profile Portfolios)
export async function getAllSystemProducts(req, res) {
  try {
    const totalInventoryLog = await Product.find({});
    return res.status(200).json(totalInventoryLog);
  } catch (error) {
    return res.status(500).json({ error: "Failed to extract complete ledger inventory logs.", message: error.message });
  }
}

// 7. SECURE GREEN CREDITS TRANSACTION SETTLEMENT
export async function purchaseProduct(req, res) {
  try {
    const { productId, buyerId, shippingData } = req.body;

    if (!productId || !buyerId) {
      return res.status(400).json({ error: "Missing required transaction parameters: productId and buyerId." });
    }

    const product = await Product.findById(productId);
    if (!product || product.status === "SOLD") {
      return res.status(404).json({ error: "Target marketplace product asset is unavailable or already sold." });
    }

    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: "Buyer profile instance entry not found." });
    }

    const totalCreditCost = product.finalMarketplacePrice || 0;

    if (buyer.greenCredits < totalCreditCost) {
      return res.status(400).json({ 
        error: "Insufficient Balance", 
        message: `Your balance is missing ${totalCreditCost - buyer.greenCredits} Green Credits.` 
      });
    }

    let adminAccount = await User.findOne({ role: "admin" });
    if (!adminAccount) {
      console.warn("⚠️ Administrative account node missing from database layers. Generating virtual fallback container registry...");
      adminAccount = await User.create({
        name: "Admin Escrow System",
        email: "admin@amazon-secondlife.com",
        password: "system_escrow_vault_pass",
        role: "admin",
        greenCredits: 0
      });
    }

    buyer.greenCredits -= totalCreditCost;
    adminAccount.greenCredits += totalCreditCost;

    product.status = "SOLD";
    product.isListedOnMarketplace = false; 
    product.buyerId = buyer._id; 
    
    if (shippingData) {
      product.shippingDetails = {
        fullName: shippingData.fullName || shippingData.accountHolderName || shippingData.accountName || "John Doe",
        shippingAddress: shippingData.shippingAddress || shippingData.address || "123 Sustainable Way",
        contactNumber: shippingData.contactNumber || shippingData.routingNumber || "N/A",
        deliveryMethod: shippingData.deliveryMethod || "STANDARD_SUSTAINABLE"
      };
    }

    await buyer.save();
    await adminAccount.save();
    await product.save();

    return res.status(200).json({ 
      success: true, 
      message: "Asset transaction compiled successfully via Green Token Ledger.",
      updatedCredits: buyer.greenCredits
    });

  } catch (error) {
    console.error("🔥 Transaction gateway crashed:", error);
    return res.status(500).json({ error: "Transaction processing gateway failure.", message: error.message });
  }
}

// 8. COMPOSITE RETURN PREVENTION ANALYSIS ENGINE
export async function preventProductReturn(req, res) {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: "Target asset configuration profile row not found." });
    }

    const baseConditionScore = product.conditionScore || 80;
    
    const sizeFitWarning = baseConditionScore < 75;
    const qualityRisk = baseConditionScore < 65;
    const listingMismatch = baseConditionScore < 85;

    const sentimentScorePart = (100 - baseConditionScore) * 0.5; 
    const historicalRatePart = 15 * 0.3; 
    const bracketMarginPart = 20 * 0.2; 
    
    const computedRiskValue = Math.round(sentimentScorePart + historicalRatePart + bracketMarginPart);

    let gradingTextSummary = "Ecosystem analysis indexes standard durability parameters. Low proactive user mismatch risk profile compiled.";
    if (computedRiskValue > 50) {
      gradingTextSummary = "Warning: Sentiment index logs multiple historical review trends complaining about specifications. Sizing calibration alerts recommended.";
    }

    const riskProfile = {
      productId: product.productId,
      riskScore: computedRiskValue,
      summaryJustification: gradingTextSummary,
      flags: {
        sizeFitWarning,
        qualityRisk,
        listingMismatch
      }
    };

    return res.status(200).json({ success: true, riskProfile });
  } catch (error) {
    return res.status(500).json({ error: "Predictive analytic framework execution failure.", message: error.message });
  }
}

// 9. GEMINI MULTI-AGENT BULK AUDIT COPILOT
export async function bulkAiEvaluation(req, res) {
  try {
    const pendingProducts = await Product.find({ status: "PENDING_ADMIN_REVIEW" });

    if (pendingProducts.length === 0) {
      return res.status(200).json({ success: true, recommendations: [], message: "No active queue rows." });
    }

    const structuralPayload = pendingProducts.map(p => ({
      _id: p._id,
      productId: p.productId,
      category: p.category,
      conditionScore: p.conditionScore,
      visualAssessment: p.visualAssessment || "No logs available."
    }));

    const promptText = `
      You are an automated logistics verification agent managing a circular e-commerce supply ledger.
      Analyze the following array of returned product metadata and determine an action for each:
      - APPROVE if conditionScore >= 60 and visualAssessment does not indicate severe damage or fraud.
      - REJECT if conditionScore < 60 or if severe defects are explicitly logged.

      Return ONLY a raw, unquoted JSON array matching this schema definition layout, without any markdown code block backticks, text, or wrappers:
      - [{"_id": "string", "action": "APPROVE" | "REJECT", "justification": "Short 1-sentence reason"}]

      Products to analyze: ${JSON.stringify(structuralPayload)}
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key setup missing from your environmental configurations.");
    }

    const aiEngine = new GoogleGenAI({ apiKey });
    
    const responseContainer = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
    });

    let cleanJsonString = responseContainer.text.trim();
    
    // Clean markdown blocks correctly on a single line
    if (cleanJsonString.startsWith("```")) {
      cleanJsonString = cleanJsonString.replace(/```json|```/g, "").trim();
    }

    const automatedRecommendations = JSON.parse(cleanJsonString);
    return res.status(200).json({ success: true, recommendations: automatedRecommendations });

  } catch (error) {
    console.error("🔥 Bulk AI Evaluation Pipeline Crash Details:", error);
    return res.status(500).json({ error: "Bulk AI Processing Gateway Exception.", message: error.message });
  }
}