import React, { useState } from 'react';
import axios from 'axios';
import CheckoutForm from './CheckoutForm'; // Imports the logistics details layout page

export default function ShoppingCartView({ currentSession, cartItems, setCartItems, onPurchaseComplete, redirectToLogin }) {
  const [step, setStep] = useState('view_cart'); // Steps: 'view_cart' or 'fill_details'
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Accumulate total cost directly as Green Credit tokens instead of cash
  const totalCreditCost = cartItems.reduce((acc, item) => acc + (item.finalMarketplacePrice || 0), 0);
  const userBalance = currentSession?.greenCredits || 0;
  const balanceIsInsufficient = userBalance < totalCreditCost;

  // This function runs after the user fills out details and clicks "Sign & Authorize Transfer"
  const handleFinalCheckout = async (shippingDetails) => {
    setLoading(true);
    setErrorText('');
    try {
      // Loop over items in the cart and send purchase requests to the backend loop
      for (const item of cartItems) {
        await axios.post('http://localhost:5000/api/marketplace/purchase', {
          productId: item._id,
          buyerId: currentSession._id || currentSession.id,
          shippingData: shippingDetails // Passes along the filled out user details
        });
      }

      alert("🎉 Settlement complete! Credits transferred to admin and items removed from storefront.");
      const updatedBalanceValue = userBalance - totalCreditCost;
      
      setCartItems([]); // Empty the cart bag upon success
      onPurchaseComplete(updatedBalanceValue); // Sync the new credit score globally in App.jsx
    } catch (err) {
      setErrorText(err.response?.data?.error || "Transaction failed to clear credit ledger systems.");
    } finally {
      setLoading(false);
    }
  };

  // Render the Shipping details form if the user moves to step 2
  if (step === 'fill_details') {
    return (
      <div className="py-6">
        {loading ? (
          <div className="text-center py-12 font-mono text-xs text-slate-500 animate-pulse">
            Executing decentralized credit swap & notifying logistics networks...
          </div>
        ) : (
          <CheckoutForm 
            totalCost={totalCreditCost}
            userBalance={userBalance}
            onConfirmCheckout={handleFinalCheckout}
            onCancel={() => setStep('view_cart')}
          />
        )}
        {errorText && <div className="mt-4 max-w-xl mx-auto p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-mono">{errorText}</div>}
      </div>
    );
  }

  // Default View: Step 1 - View Items in Cart
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">Your Shopping Bag Stack</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">Review items gathered from the peer-to-peer sustainable circular market ledger.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="border border-dashed border-slate-900 rounded-2xl p-16 text-center text-slate-500 font-mono text-sm">
          🛒 Your shopping cart queue contains zero active product references.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Cart Rows List */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-4">
                  {item.base64Image && (
                    <img src={item.base64Image} alt="Thumb" className="w-12 h-12 rounded-lg object-cover border border-slate-800" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Asset Ref: {item.productId}</h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">{item.category} • Condition {item.conditionScore}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400 font-mono">{item.finalMarketplacePrice} Credits</p>
                  <button 
                    onClick={() => setCartItems(cartItems.filter(c => c._id !== item._id))} 
                    className="text-[10px] text-red-400 font-mono hover:underline mt-0.5 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Balance Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl h-fit space-y-4">
            <h3 className="text-xs font-black font-mono tracking-widest text-amber-400 uppercase">Settlement Summary</h3>
            
            <div className="space-y-2 border-b border-slate-900 pb-3 font-mono text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Your Wallet Balance:</span>
                <span className="text-emerald-400 font-bold">{userBalance} CR</span>
              </div>
              <div className="flex justify-between">
                <span>Total Items Cost:</span>
                <span className="text-white">{totalCreditCost} CR</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Required:</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalCreditCost} <span className="text-xs font-normal text-slate-400">CR</span></span>
            </div>

            {balanceIsInsufficient && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg text-center font-mono leading-relaxed">
                ⚠️ Insufficient balance. You need {totalCreditCost - userBalance} more credits to clear this transaction.
              </div>
            )}

            <button 
              onClick={() => {
                if (!currentSession) { redirectToLogin(); return; }
                setStep('fill_details'); // Advances layout interface to step 2 details form
              }} 
              disabled={balanceIsInsufficient} 
              className={`w-full font-black text-xs py-3 rounded-xl uppercase tracking-widest transition-all shadow-md flex items-center justify-center ${
                balanceIsInsufficient 
                  ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed" 
                  : "bg-amber-500 hover:bg-amber-600 text-slate-950 active:scale-95 cursor-pointer"
              }`}
            >
              Proceed to Shipping Details
            </button>
          </div>

        </div>
      )}
    </div>
  );
}