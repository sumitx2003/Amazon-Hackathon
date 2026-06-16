import React, { useState } from "react";
import axios from "axios";

// ⚡ FIX: Added a prop guard layer ensuring both "currentUser" or "session" pass down smoothly
export default function ReturnPortal({ currentUser, session }) {
  
  // ⚡ FIX: Checks all possible naming properties across both layout state bindings
  const activeUser = currentUser || session;
  const sellerId = activeUser?.id || activeUser?._id; 

  const [productData, setProductData] = useState({
    productId: "",
    originalPrice: "",
    category: "Electronics",
    base64Image: "" 
  });

  const [bankInfo, setBankInfo] = useState({
    accountHolderName: "",
    accountNumber: "",
    routingNumber: ""
  });

  const [evaluatedProfile, setEvaluatedProfile] = useState(null);
  const [uiMessage, setUiMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  // Sync state modifications safely via input "name" matching
  const handleItemChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e) => {
    setBankInfo({ ...bankInfo, [e.target.name]: e.target.value });
  };

  // Convert uploaded item image to readable base64 stream strings
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData({ ...productData, base64Image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ACTION 1: Run through multi-modal appraisal loops
  const handleEvaluateSubmission = async (e) => {
    e.preventDefault();
    if (!sellerId) {
      setUiMessage({ text: "🔒 Session Expired: Please log back into your profile.", isError: true });
      return;
    }
    if (!productData.base64Image) {
      setUiMessage({ text: "Please upload an assessment photo first.", isError: true });
      return;
    }

    setLoading(true);
    setUiMessage({ text: "", isError: false });
    try {
      // ⚡ FIX: Updated endpoint path prefix to match your backend marketplace routing controller
      const response = await axios.post("https://amazon-hackathon-backend-2htg.onrender.com/api/marketplace/process-return", {
        ...productData,
        sellerId
      });
      
      if (response.data.success) {
        setEvaluatedProfile(response.data.assetProfile);
        setUiMessage({ text: "AI evaluation complete! Please complete checkout settlement fields below.", isError: false });
      }
    } catch (err) {
      setUiMessage({ 
        text: err.response?.data?.error || "AI evaluation routing engine error boundary hit.", 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // ACTION 2: Confirm final agreement and push to management review queue
  const handleAcceptAndDisburse = async () => {
    if (!bankInfo.accountHolderName || !bankInfo.accountNumber || !bankInfo.routingNumber) {
      setUiMessage({ text: "Please fill out all settlement account fields.", isError: true });
      return;
    }

    setLoading(true);
    setUiMessage({ text: "", isError: false });
    try {
      const payload = {
        assetProfile: {
          ...evaluatedProfile,
          sellerId, // ⚡ FIX: Reinforce passing the verified real user ID string explicitly here
          base64Image: productData.base64Image 
        }, 
        bankAccountInfo: {
          accountName: bankInfo.accountHolderName,
          accountNumber: bankInfo.accountNumber,
          routingNumber: bankInfo.routingNumber
        }
      };

      // ⚡ FIX: Updated endpoint to point accurately to the marketplace confirmation router pipeline
      const response = await axios.post("https://amazon-hackathon-backend-2htg.onrender.com/api/marketplace/finalize-agreement", payload);
      if (response.data.success) {
        setUiMessage({ text: "🎉 Return successfully submitted to the platform administrative review queue!", isError: false });
        setEvaluatedProfile(null);
        setProductData({ productId: "", originalPrice: "", category: "Electronics", base64Image: "" });
        setBankInfo({ accountHolderName: "", accountNumber: "", routingNumber: "" });
      }
    } catch (err) {
      setUiMessage({ 
        text: err.response?.data?.error || "Failed to commit record data parameters to database layers.", 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-black text-slate-100 tracking-tight">Automated Return & Trade-In Portal</h2>
        <p className="text-xs text-slate-500 font-mono mt-1">Submit asset configurations to trigger multimodal agent valuation pricing models.</p>
      </div>

      {uiMessage.text && (
        <div className={`p-4 rounded-xl text-xs font-medium border transition-all duration-300 ${
          uiMessage.isError 
            ? "bg-red-500/10 border-red-500/30 text-red-400 shadow-md shadow-red-950/20" 
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-950/20"
        }`}>
          {uiMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <h3 className="text-xs font-black font-mono tracking-widest text-amber-500 uppercase">1. Return Asset Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Product Identification Code</label>
              <input type="text" name="productId" placeholder="e.g. AMZN-REF-99281" onChange={handleItemChange} value={productData.productId} className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Original Price ($)</label>
                <input type="number" name="originalPrice" placeholder="1000" onChange={handleItemChange} value={productData.originalPrice} className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Category Classification</label>
                <select name="category" value={productData.category} onChange={handleItemChange} className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none transition-colors">
                  <option value="Electronics">Electronics</option>
                  <option value="Home Apparel">Home Apparel</option>
                  <option value="Automotive Parts">Automotive Parts</option>
                  <option value="Office Equipment">Office Equipment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Upload Condition Assessment Photo</label>
              <div className="group relative border border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-900/40 rounded-xl p-5 transition-all text-center cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <p className="text-xs text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                  {productData.base64Image ? "📸 Photo Attached Successfully" : "📁 Drag & drop or click to upload file"}
                </p>
              </div>
            </div>

            <button 
              onClick={handleEvaluateSubmission} 
              disabled={loading || !productData.productId || !productData.originalPrice}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all tracking-widest uppercase shadow-md shadow-amber-500/5"
            >
              {loading ? "Running AI Evaluation Loop..." : "Submit to Evaluation Loop"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center items-center text-center min-h-[200px] shadow-2xl overflow-hidden">
            {productData.base64Image ? (
              <img src={productData.base64Image} alt="Upload Analysis Snapshot Preview" className="w-full h-40 object-cover rounded-xl border border-slate-800" />
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600 text-sm">🖼️</div>
                <p className="text-[11px] text-slate-600 italic">No image reference file selected</p>
              </div>
            )}
          </div>

          {evaluatedProfile && (
            <div className="bg-slate-950 border border-emerald-500/20 rounded-2xl p-5 shadow-2xl space-y-3.5 animate-slideUp">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-[10px] font-black font-mono text-emerald-400 tracking-wider uppercase">AI Appraisal Metrics</h4>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono rounded-md">Score: {evaluatedProfile.conditionScore}/100</span>
              </div>
              <p className="text-xs text-slate-400 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800/40 font-serif leading-relaxed">
                "{evaluatedProfile.visualAssessment}"
              </p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] font-mono text-slate-500">
                <p>Assigned Route: <span className="text-slate-200 font-bold">{evaluatedProfile.lifecycleRoute}</span></p>
                <p>Base Valuation: <span className="text-amber-400 font-bold">${evaluatedProfile.marketResaleValuation}</span></p>
                <p className="col-span-2 border-t border-slate-900 pt-2 mt-1">Sustainability Allocation: <span className="text-emerald-400 font-bold">+{evaluatedProfile.allocatedGreenCredits} Green Credits</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {evaluatedProfile && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-slideUp">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black font-mono tracking-widest text-emerald-400 uppercase">2. Configure Payout Settlement Parameters</h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">Provide secure routing indices to initialize your automated banking micro-disbursal transfer link.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Account Holder Name</label>
              <input type="text" name="accountHolderName" placeholder="Sumit Jangid" onChange={handleBankChange} value={bankInfo.accountHolderName} className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-700 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Account Number</label>
              <input type="password" name="accountNumber" placeholder="••••••••••••" onChange={handleBankChange} value={bankInfo.accountNumber} className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-700 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-1.5">Routing Number</label>
              <input type="text" name="routingNumber" placeholder="021000021" onChange={handleBankChange} value={bankInfo.routingNumber} className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-700 focus:outline-none transition-colors" />
            </div>
          </div>

          <button 
            onClick={handleAcceptAndDisburse} 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all tracking-widest uppercase shadow-md shadow-emerald-500/5"
          >
            {loading ? "Processing Ledger Disbursal Link..." : "Accept Valuation & Request Disbursal"}
          </button>
        </div>
      )}
    </div>
  );
}