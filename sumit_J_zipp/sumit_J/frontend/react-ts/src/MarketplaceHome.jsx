import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MarketplaceHome({ currentSession, onAddToCart, redirectToLogin, searchQuery = '' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://amazon-hackathon.onrender.com/api/marketplace/products')
      .then(response => {
        if (Array.isArray(response.data)) {
          const activeCatalog = response.data.filter(product => {
            const status = String(product.status || "").toUpperCase();
            return status === "APPROVED" || status === "RESELL";
          });

          setItems(activeCatalog);
        } else {
          setItems([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Storefront retrieval error state exception:", error);
        setItems([]);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter(product => {
    const searchString = searchQuery.toLowerCase();

    return (
      product.productId?.toLowerCase().includes(searchString) ||
      product.category?.toLowerCase().includes(searchString) ||
      product.visualAssessment?.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          The Sustainable Circular Economy Marketplace
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Browse and purchase high-quality premium electronic goods, certified refurbished and peer-reviewed by autonomous generative valuation agents.
        </p>
      </div>

      {loading ? (
        <div className="text-center p-12 text-sm text-slate-500">
          Loading catalog from core ledger items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center p-16 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          <p className="text-lg mb-1">🔍 No Matching Products Found</p>
          <p className="text-xs text-slate-600">
            We couldn't find anything matching "{searchQuery}". Try updating your search criteria parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((product) => (
            <div
              key={product._id}
              className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {product.base64Image && (
                <div className="w-full h-44 bg-slate-900 border-b border-slate-800/80 overflow-hidden">
                  <img
                    src={product.base64Image}
                    alt={`Asset Ref ${product.productId}`}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              )}

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      product.lifecycleRoute === 'RESELL'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}
                  >
                    {product.lifecycleRoute}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-200">
                     {product.productId}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">
                    "{product.visualAssessment || 'No asset remarks supplied.'}"
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-500">
                      Condition Grading
                    </p>
                    <p className="text-sm font-bold text-amber-500">
                      {product.conditionScore} / 100
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase font-semibold text-slate-500">
                      Original Valuation
                    </p>
                    <p className="text-xs text-slate-400 line-through">
                      ${product.originalPrice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono font-semibold text-slate-500 tracking-wider">
                    Asset Cost
                  </span>
                  <span className="text-base font-mono font-black text-emerald-400">
                    {product.finalMarketplacePrice}{' '}
                    <span className="text-xs font-normal text-slate-400 font-sans">
                      CR
                    </span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!currentSession) {
                      alert("🔒 Authentication Required: Please log into your profile to construct your checkout cart stack.");
                      redirectToLogin();
                      return;
                    }

                    onAddToCart(product);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}