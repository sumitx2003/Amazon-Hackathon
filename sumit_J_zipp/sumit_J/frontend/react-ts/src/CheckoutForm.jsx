import React, { useState } from 'react';

export default function CheckoutForm({ totalCost, userBalance, onConfirmCheckout, onCancel }) {
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    shippingAddress: '',
    contactNumber: '',
    deliveryMethod: 'STANDARD_SUSTAINABLE'
  });

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userBalance < totalCost) {
      alert("⚠️ Cannot proceed: Insufficient token balances cleared for this checkout layout block.");
      return;
    }
    // Fire the confirmation callback and pass the shipping metadata up
    onConfirmCheckout(shippingDetails);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-xl mx-auto animate-fadeIn space-y-6">
      
      <div className="text-center border-b border-slate-900 pb-3">
        <h3 className="text-base font-black font-mono uppercase tracking-widest text-amber-400">Logistics Routing Details</h3>
        <p className="text-xs text-slate-500 mt-1">Specify destination parameters before authorizing token escrow transfers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Recipient Node Name</label>
          <input 
            required 
            type="text" 
            name="fullName" 
            value={shippingDetails.fullName} 
            onChange={handleInputChange} 
            placeholder="John Doe" 
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" 
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Physical Shipping Address Coordinates</label>
          <textarea 
            required 
            name="shippingAddress" 
            value={shippingDetails.shippingAddress} 
            onChange={handleInputChange} 
            placeholder="123 Sustainable Way, Sector 4..." 
            rows="3"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Comms Contact Number</label>
            <input 
              required 
              type="tel" 
              name="contactNumber" 
              value={shippingDetails.contactNumber} 
              onChange={handleInputChange} 
              placeholder="+91 XXXXX XXXXX" 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono" 
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Logistics Pipeline Route</label>
            <select 
              name="deliveryMethod" 
              value={shippingDetails.deliveryMethod} 
              onChange={handleInputChange} 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none bg-slate-950"
            >
              <option value="STANDARD_SUSTAINABLE">Carbon Neutral Ground (0 CR)</option>
              <option value="EXPRESS_NODE">Priority Hub Routing (+10 CR)</option>
            </select>
          </div>
        </div>

        {/* Financial Recapitulation Wrapper */}
        <div className="bg-slate-900 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between font-mono">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Escrow Authorization Cost</p>
            <p className="text-xl font-black text-emerald-400">{totalCost} Credits</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">Your Wallet State</p>
            <p className="text-xs text-slate-300">{userBalance} Credits</p>
          </div>
        </div>

        {/* Operational Flow Buttons */}
        <div className="flex space-x-3 pt-2 font-bold uppercase tracking-wider text-[11px]">
          <button 
            type="button" 
            onClick={onCancel}
            className="w-1/3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-2.5 rounded-lg transition-all"
          >
            Go Back
          </button>
          <button 
            type="submit"
            className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-lg transition-all shadow-md shadow-emerald-500/10"
          >
            Sign & Authorize Transfer
          </button>
        </div>
      </form>
    </div>
  );
}