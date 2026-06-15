import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReturnPrevention() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch system products to populate the inspector selector dropdown
    axios.get('https://amazon-hackathon.onrender.com/api/marketplace/all-products')
      .then(res => { if (Array.isArray(res.data)) setProducts(res.data); })
      .catch(err => console.error("Error fetching prevention list:", err));
  }, []);

  const handleRunAnalysis = async (productId) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await axios.post(`https://amazon-hackathon.onrender.com/api/marketplace/prevent-return`, { productId });
      if (res.data.success) {
        setAnalysis(res.data.riskProfile);
      }
    } catch (err) {
      alert("Failed to compile predictive sentiment analysis rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn font-mono text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">🤖 AI Return Prevention Engine</h2>
        <p className="text-xs text-slate-500 mt-0.5">Proactive sentiment analysis parsing risk indicators prior to ledger checkout.</p>
      </div>

      {/* Target Selection Dropdown Menu */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Storefront Inventory Target Asset</label>
        <div className="flex gap-4">
          <select 
            onChange={(e) => setSelectedProduct(products.find(p => p._id === e.target.value))}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 bg-slate-950"
          >
            <option value="">-- Choose Product Reference --</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.productId} ({p.category})</option>
            ))}
          </select>
          <button
            onClick={() => selectedProduct && handleRunAnalysis(selectedProduct._id)}
            disabled={!selectedProduct || loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black px-6 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
          >
            {loading ? "Analyzing Reviews..." : "Predict Return Risk"}
          </button>
        </div>
      </div>

      {/* AI Risk Score Visualization Matrices Display Panel */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
          {/* Left Summary Card */}
          <div className="md:col-span-1 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between items-center text-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Calculated Risk Factor</p>
              <p className={`text-4xl font-black mt-4 font-mono ${analysis.riskScore > 70 ? 'text-red-500' : analysis.riskScore > 40 ? 'text-amber-500' : 'text-emerald-400'}`}>
                {analysis.riskScore}%
              </p>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border block mx-auto mt-2 w-fit ${
                analysis.riskScore > 70 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>{analysis.riskScore > 70 ? 'CRITICAL RISK' : 'STABLE NODE'}</span>
            </div>
            
            <p className="text-[11px] font-serif text-slate-400 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 mt-4 leading-relaxed">
              "{analysis.summaryJustification}"
            </p>
          </div>

          {/* Right Warning Checklist Parameters Panel */}
          <div className="md:col-span-2 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="text-[10px] uppercase font-bold text-amber-500 tracking-wider border-b border-slate-900 pb-2">Pre-Purchase Intercept Warning Flags</h4>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                <div>
                  <p className="font-bold text-slate-200">Size & Fit Discrepancy Risk</p>
                  <p className="text-[11px] text-slate-500 font-mono">Triggers user sizing configuration alerts.</p>
                </div>
                <span className={`font-mono text-[10px] font-bold ${analysis.flags.sizeFitWarning ? 'text-red-400' : 'text-slate-500'}`}>
                  {analysis.flags.sizeFitWarning ? '⚠️ HIGH MATCH' : '✅ CLEAR'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                <div>
                  <p className="font-bold text-slate-200">Material Structural Quality Threat</p>
                  <p className="text-[11px] text-slate-500 font-mono">Flags durability vulnerabilities mentioned in feed reviews.</p>
                </div>
                <span className={`font-mono text-[10px] font-bold ${analysis.flags.qualityRisk ? 'text-red-400' : 'text-slate-500'}`}>
                  {analysis.flags.qualityRisk ? '⚠️ HIGH RISK' : '✅ CLEAR'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                <div>
                  <p className="font-bold text-slate-200">Listing Meta-Description Mismatch</p>
                  <p className="text-[11px] text-slate-500 font-mono">Catches description divergence flags.</p>
                </div>
                <span className={`font-mono text-[10px] font-bold ${analysis.flags.listingMismatch ? 'text-amber-400' : 'text-slate-500'}`}>
                  {analysis.flags.listingMismatch ? '⚠️ DETECTED' : '✅ CLEAR'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}