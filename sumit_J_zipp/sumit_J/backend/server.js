import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
// Security authorization module boundaries
import { register, login, updateProfile } from "./controllers/authController.js";

// Circular ecosystem operational pipelines controller models
import {
  processProductReturn,
  finalizeUserAgreement,
  getAdminPipelineQueue,
  executeAdminDecision,
  getMarketplaceProducts,
  getAllSystemProducts,
  purchaseProduct,
  preventProductReturn,
  bulkAiEvaluation // ⚡ FIXED: Added this import so the compiler can bind the path execution row!
} from "./controllers/productController.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Stabilizes incoming JSON payload arrays up to 20MB for processing camera photos
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ==========================================
// 🔐 Security Authorization Router Mounts
// ==========================================
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/marketplace/purchase", purchaseProduct);
app.put("/api/auth/update-profile/:id", updateProfile);

// ==========================================
// 🔄 Circular Logistics & Marketplace Routes
// ==========================================
app.post("/api/marketplace/process-return", processProductReturn);
app.post("/api/marketplace/finalize-agreement", finalizeUserAgreement);
app.get("/api/marketplace/products", getMarketplaceProducts);
app.post("/api/marketplace/prevent-return", preventProductReturn);
app.get("/api/marketplace/all-products", getAllSystemProducts);

// ==========================================
// ⚡ Admin Control Pipeline Routers
// ==========================================
app.get("/api/marketplace/admin-queue", getAdminPipelineQueue);
app.put("/api/marketplace/admin-decision/:id", executeAdminDecision);

// 🤖 HACKATHON ROUTE: REGISTER THE COPILOT MULTI-AGENT PIPELINE
app.post("/api/marketplace/bulk-ai-audit", bulkAiEvaluation);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Amazon Hackathon Backend is Running 🚀"
  });
});

app.listen(port, () => console.log(`🚀 Decoupled Unified Application Engine running on port ${port}`));