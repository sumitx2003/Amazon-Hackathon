import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // ⚡ NEW: Added tracking reference to know which user purchased the asset
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  
  category: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  conditionScore: { type: Number, required: true },
  defectsList: [{ type: String }],
  visualAssessment: { type: String },
  lifecycleRoute: { type: String, required: true, enum: ["RESELL", "REFURBISH", "DONATE", "RECYCLE"] },
  marketResaleValuation: { type: Number, required: true },
  allocatedGreenCredits: { type: Number, required: true },
  allocationJustification: { type: String },
  
  base64Image: { type: String, default: "" },
  
  // Extended Lifecycle Pipeline Tracking Attributes
  status: { 
    type: String, 
    // ⚡ FIX: Added "SOLD" to the authorized enum string stack array list
    enum: ["QUOTED", "PENDING_ADMIN_REVIEW", "APPROVED", "REJECTED", "SOLD"], 
    default: "QUOTED" 
  },
  bankAccountInfo: {
    accountName: String,
    accountNumber: String,
    routingNumber: String
  },
  
  // ⚡ NEW: Stores physical address logistics metadata sent from CheckoutForm
  shippingDetails: {
    fullName: { type: String, default: "" },
    shippingAddress: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    deliveryMethod: { type: String, default: "STANDARD_SUSTAINABLE" }
  },

  isListedOnMarketplace: { type: Boolean, default: false },
  finalMarketplacePrice: { type: Number, default: 0 },
  processedTimestamp: { type: Date, default: Date.now }
});

export const Product = mongoose.model("Product", productSchema);