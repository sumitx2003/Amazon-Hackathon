import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Consolidated network abstraction continuity

// ⚡ UPDATED: Parameter structures explicitly capture the onCreditsMinted state synchronization callback prop
export default function AdminDashboard({ onCreditsMinted }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryView, setShowHistoryView] = useState(false); // State to toggle history table layout

  // ⚡ AUTOMATED AI COPILOT STATES
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const fetchQueueList = () => {
    // Swapped 'admin-queue' with 'all-products' so past accepted/rejected items are loaded into the array
    axios.get('https://amazon-hackathon.onrender.com/api/marketplace/all-products')
      .then(res => {
        setQueue(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to query administrative operational pipelines:", err);
        setQueue([]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchQueueList(); }, []);

  // ⚡ FIXED: Hardened manual action workflow handler to bypass stale array contexts completely
  const processAction = async (id, action) => {
    try {
      const res = await axios.put(`https://amazon-hackathon.onrender.com/api/marketplace/admin-decision/${id}`, { action });
      if (res.status === 200) {
        
        // 🚀 THE FIX: Pull the fresh product values directly from the server response update package!
        const updatedProductFromDatabase = res.data.product;
        
        if (action === "APPROVE" && typeof onCreditsMinted === "function") {
          if (updatedProductFromDatabase && updatedProductFromDatabase.allocatedGreenCredits) {
            // Priority 1: Safe numeric evaluation straight from fresh database document configurations
            onCreditsMinted(Number(updatedProductFromDatabase.allocatedGreenCredits));
          } else {
            // Priority 2: Fallback lookup matching against local queue state fields
            const clickedProduct = queue.find(q => q._id === id);
            if (clickedProduct) {
              const trueCredits = clickedProduct.allocatedGreenCredits || clickedProduct.greenCredits || 0;
              onCreditsMinted(Number(trueCredits));
            }
          }
        }
        
        alert(`🎉 Item tracking record updated successfully to status: ${action}`);
        fetchQueueList();
      }
    } catch (err) { 
      console.error("Failed to modify admin routing choice structure tracking entry:", err); 
      alert("Error executing administrative choice update command.");
    }
  };

  // ⚡ GEMINI API INTERACTIVE MULTI-AGENT COMPILER EXECUTION
  const handleTriggerBulkAiAgent = async () => {
    setAiLoading(true);
    try {
      const res = await axios.post('https://amazon-hackathon.onrender.com/api/marketplace/bulk-ai-audit');
      if (res.data.success) {
        setAiSuggestions(res.data.recommendations);
      }
    } catch (err) {
      alert("Failed to gather automated Gemini responses. Ensure your backend endpoint router has loaded the pipeline.");
    } finally {
      setAiLoading(false);
    }
  };

  // ⚡ COMMIT BULK APPRAISALS WITH AUTOMATED LIVE USER LEDGER SYNC
  const handleCommitBulkChoices = async () => {
    setLoading(true);
    let cumulativeMintedCredits = 0;

    try {
      // Execute decisions sequentially to prevent database connection bottlenecks
      for (const item of aiSuggestions) {
        const res = await axios.put(`https://amazon-hackathon.onrender.com/api/marketplace/admin-decision/${item._id}`, { 
          action: item.action 
        });

        // Sum up the value profile of items approved by Gemini
        if (res.status === 200 && item.action === "APPROVE") {
          // If the backend drops back the freshly modified item record directly, prioritize it
          const updatedProduct = res.data.product;
          if (updatedProduct && updatedProduct.allocatedGreenCredits) {
            cumulativeMintedCredits += Number(updatedProduct.allocatedGreenCredits);
          } else {
            // Standard fallback lookup scanning active state array indices matching MongoDB object identifiers
            const associatedProductRow = queue.find(q => q._id === item._id);
            if (associatedProductRow) {
              cumulativeMintedCredits += Number(associatedProductRow.allocatedGreenCredits || 0);
            }
          }
        }
      }

      // 🚀 Sync the true accumulated credit profile back up to the user account state context safely
      if (cumulativeMintedCredits > 0 && typeof onCreditsMinted === "function") {
        onCreditsMinted(cumulativeMintedCredits);
      }

      alert(`🎉 Mass ledger execution complete! Committed decisions and successfully added exactly +${cumulativeMintedCredits} credits to the user side profile tab view.`);
      setAiSuggestions([]);
      fetchQueueList();
    } catch (err) {
      console.error("Failed structural processing of automated bulk choices:", err);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-12 text-xs text-slate-500 font-mono">Loading administrative ledger channels...</div>;

  // Dynamically separate pending requests from historical decisions
  const pendingItems = queue.filter(item => item.status === "PENDING_ADMIN_REVIEW");
  const processedHistoryItems = queue.filter(item => ["APPROVED", "REJECTED", "SOLD"].includes(item.status));

  return (
    <div className="space-y-8 pb-12">
      
      {/* 🛠️ HEADER CONTAINER PANEL WITH ENFORCED SIDE-BY-SIDE BUTTON ELEMENTS */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wider">
            {showHistoryView ? "📜 Archived Decision History" : "Administrative Routing Control Core"}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {showHistoryView 
              ? "Review past historical actions, executed credit transfers, and system audits."
              : "Audit, finalize, and process incoming multi-agent circular product recommendations."}
          </p>
        </div>
        
        {/* ⚙️ ACTION TRIGGERS CONTAINER W/ FIXED POSITION STYLING */}
        <div className="flex flex-row items-center space-x-3 w-full sm:w-auto justify-end">
          
          {/* 🤖 THE MAGICAL AI AGENT RUNNER BUTTON */}
          {!showHistoryView && pendingItems.length > 0 && (
            <button
              onClick={handleTriggerBulkAiAgent}
              disabled={aiLoading}
              className="font-mono text-xs px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold border border-violet-500/20 transition-all active:scale-95 disabled:opacity-40 flex items-center space-x-2 cursor-pointer shadow-lg shadow-indigo-500/10 shrink-0"
            >
              <span>{aiLoading ? "✨ Gemini Auditing..." : "🤖 Run Gemini Bulk Copilot"}</span>
            </button>
          )}

          {/* HISTORY ACTION TOGGLE */}
          <button
            onClick={() => { setShowHistoryView(!showHistoryView); setAiSuggestions([]); }}
            className={`font-mono text-xs px-4 py-2.5 rounded-xl border transition-all active:scale-95 flex items-center space-x-2 cursor-pointer shrink-0 ${
              showHistoryView 
                ? "bg-amber-500 text-slate-950 font-black border-amber-500 shadow-md shadow-amber-500/10" 
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700"
            }`}
          >
            <span>{showHistoryView ? "📂 Open Active Queues" : "📜 View Action History"}</span>
            <span className="bg-slate-900 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 font-bold text-slate-300">
              {showHistoryView ? pendingItems.length : processedHistoryItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* 🔮 INTERCEPT LOG SHEET LAYER: DISPLAYS BULK ANALYSIS FOR FINAL VERIFICATION */}
      {aiSuggestions.length > 0 && (
        <div className="bg-slate-950 border border-violet-500/30 rounded-2xl p-6 font-mono text-xs shadow-2xl space-y-4 transform scale-100 transition-all">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 gap-4">
            <div>
              <h3 className="text-sm font-black text-violet-400 uppercase tracking-wider">✨ AI Copilot Bulk Recommendations</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Review Gemini diagnostics decisions prior to shifting transactional block records.</p>
            </div>
            <div className="flex space-x-2 shrink-0">
              <button onClick={() => setAiSuggestions([])} className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Discard</button>
              <button onClick={handleCommitBulkChoices} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-1.5 rounded-lg shadow-md transition-colors cursor-pointer">Apply and Commit Decisions</button>
            </div>
          </div>

          <div className="divide-y divide-slate-900 overflow-y-auto max-h-64 pr-1">
            {aiSuggestions.map(item => {
              const itemMatch = queue.find(q => q._id === item._id);
              return (
                <div key={item._id} className="py-3 flex items-center justify-between text-[11px]">
                  <div className="space-y-0.5">
                    <p className="text-slate-200 font-bold">Asset Code: {itemMatch?.productId || "Unknown Asset ID"}</p>
                    <p className="text-slate-500 italic">Justification: "{item.justification}"</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase shrink-0 ml-4 ${
                    item.action === 'APPROVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>{item.action === 'APPROVE' ? 'RECOMMEND ACCEPT' : 'RECOMMEND REJECT'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 📜 VIEW 1: IMMUTABLE AUDIT DECISION LOG TABLE */}
      {showHistoryView ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs shadow-2xl animate-fadeIn">
          {processedHistoryItems.length === 0 ? (
            <div className="text-center py-16 text-slate-600 italic">No historical actions logged inside database tables yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-widest">
                    <th className="pb-3 pl-2">Asset Code</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">AI Selected Route</th>
                    <th className="pb-3">Condition Score</th>
                    <th className="pb-3 text-right pr-2">Settled State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {processedHistoryItems.map((asset) => (
                    <tr key={asset._id} className="hover:bg-slate-900/30 transition-colors group">
                      <td className="py-3.5 pl-2 font-bold text-slate-200 group-hover:text-amber-400 select-all">{asset.productId}</td>
                      <td className="py-3.5 text-slate-400 uppercase text-[11px]">{asset.category}</td>
                      <td className="py-3.5 font-bold text-slate-400">
                        <span className="bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-slate-400 text-[11px]">
                          {asset.lifecycleRoute}
                        </span>
                      </td>
                      <td className="py-3.5 text-amber-500 font-bold">{asset.conditionScore}/100</td>
                      <td className="py-3.5 text-right pr-2">
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-black border tracking-wider uppercase ${
                          asset.status === 'REJECTED' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>{asset.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        
        /* 📂 VIEW 2: ACTIVE REVENUE PIPELINE QUEUES KANBAN LAYOUT */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-fadeIn">
          {["RESELL", "REFURBISH", "DONATE", "RECYCLE"].map((routeTrack) => {
            const filteredChannelItems = pendingItems.filter(item => item.lifecycleRoute === routeTrack);

            return (
              <div key={routeTrack} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4 min-h-[500px]">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className={`text-xs font-black font-mono tracking-widest ${
                    routeTrack === 'RESELL' ? 'text-emerald-400' :
                    routeTrack === 'REFURBISH' ? 'text-cyan-400' :
                    routeTrack === 'DONATE' ? 'text-amber-400' : 'text-red-400'
                  }`}>{routeTrack} QUEUE</h3>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                    {filteredChannelItems.length}
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {filteredChannelItems.map((asset) => (
                    <div key={asset._id} className="bg-slate-900 rounded-lg p-3.5 border border-slate-800/80 space-y-3 text-xs hover:border-slate-700 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-300 font-mono">ID: {asset.productId}</span>
                        <span className="text-amber-400 font-bold font-mono">{asset.conditionScore}/100</span>
                      </div>
                      
                      {asset.base64Image && (
                        <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                          <img src={asset.base64Image} alt="Review Asset Thumbnail" className="w-full h-full object-cover opacity-70" />
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-800/40">
                        "{asset.visualAssessment || 'No tracking visual analytics saved.'}"
                      </p>
                      <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
                        <p>Seller Identity: <span className="text-slate-300">{asset.sellerId?.name || 'Unknown User'}</span></p>
                        <p>Incentive Reward: <span className="text-emerald-400 font-bold">+{asset.allocatedGreenCredits} Credits</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
                        <button 
                          onClick={() => processAction(asset._id, 'APPROVE')} 
                          className="bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 font-bold text-[10px] py-1.5 rounded transition-all tracking-wider text-emerald-400 cursor-pointer"
                        >
                          ACCEPT
                        </button>
                        <button 
                          onClick={() => processAction(asset._id, 'REJECT')} 
                          className="bg-red-500/10 hover:bg-red-600 hover:text-slate-100 border border-red-500/30 font-bold text-[10px] py-1.5 rounded transition-all tracking-wider text-red-400 cursor-pointer"
                        >
                          REJECT
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredChannelItems.length === 0 && (
                    <div className="text-center py-12 text-[11px] text-slate-600 italic font-mono">
                      Clear tracking line channel
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}