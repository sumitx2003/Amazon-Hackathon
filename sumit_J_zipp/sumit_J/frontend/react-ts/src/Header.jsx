import React, { useState } from 'react';
// Import clean e-commerce line vectors matching the flux layout style
import { FiSearch, FiUser, FiShoppingBag, FiLogOut } from 'react-icons/fi';

// ⚡ UPDATED: Destructured cartCount prop sent from App.jsx state tree
export default function Header({ currentSession, activeTabSetter, logoutTrigger, cartCount }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileClick = () => {
    if (!currentSession) {
      // If no session exists, smoothly activate login gateway panel layout view
      activeTabSetter('login_gateway');
    } else {
      // If authenticated, navigate to user profile/portfolio overview tracking page
      activeTabSetter('profile_portfolio');
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-900 sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        
        {/* Left Section: Brand Logo Layout */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => activeTabSetter('marketplace')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/10">
            <span className="text-slate-950 text-base font-black">📦</span>
          </div>
          <span className="text-sm font-black tracking-tight text-white uppercase tracking-widest">
            Amazon <span className="text-amber-400">Second Life</span>
          </span>
        </div>

        {/* Center Section: App Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/40 p-1 rounded-xl border border-slate-800/40">
          <button 
            onClick={() => activeTabSetter('marketplace')}
            className="text-xs font-bold tracking-wide px-4 py-2 rounded-lg transition-all text-slate-200 hover:text-white hover:bg-slate-800/60"
          >
            Buy Pre-Owned
          </button>
          
          <button 
            onClick={() => activeTabSetter('return')}
            className="text-xs font-bold tracking-wide px-4 py-2 rounded-lg transition-all text-slate-200 hover:text-white hover:bg-slate-800/60"
          >
            Trade-In Portal
          </button>
          
          {currentSession?.role === 'admin' && (
            <button 
              onClick={() => activeTabSetter('admin')}
              className="text-xs font-black tracking-widest px-4 py-2 rounded-lg transition-all border border-amber-400/40 text-amber-400 bg-amber-400/5 hover:bg-amber-500 hover:text-slate-950 hover:border-transparent"
            >
              ADMIN CORE
            </button>
          )}
        </nav>

        {/* ⚡ FIXED RIGHT CONTAINER: Re-established the grouping alignment wrapper */}
        <div className="flex items-center space-x-5">
          
          {/* 1. Interactive Real-Time Search Bar */}
          <div className="flex items-center">
            {searchOpen ? (
              <div>
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Updates the parent search string query live as you type
                    activeTabSetter('search_query_update', e.target.value);
                  }}
                  onBlur={() => { if(!searchQuery) setSearchOpen(false); }}
                  placeholder="Search products..." 
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 w-44 transition-all"
                />
              </div>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-slate-300 hover:text-white transition-colors p-1"
                title="Search Storefront"
              >
                <FiSearch size={18} />
              </button>
            )}
          </div>

          {/* 2. Portfolio Profile Control Anchor Block */}
          <button 
            onClick={handleProfileClick}
            className={`transition-all p-1.5 rounded-lg border flex items-center justify-center relative group ${
              currentSession 
                ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40" 
                : "text-slate-300 bg-slate-900/60 border-slate-800 hover:text-white hover:border-slate-700"
            }`}
            title={currentSession ? "View Portfolio Ledger" : "Identity Authentication Portal"}
          >
            <FiUser size={18} />
            {currentSession && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            )}
          </button>

          {/* 3. Shopping Cart Bag Tracking Node */}
          {/* ⚡ UPDATED: Changed routing destination to 'cart_view' and wired live badge counts */}
          <button 
            onClick={() => activeTabSetter('cart_view')}
            className="text-slate-300 hover:text-white transition-colors p-1 relative"
            title="Open Shopping Bag"
          >
            <FiShoppingBag size={18} />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center scale-90 select-none shadow-sm">
              {cartCount || 0}
            </span>
          </button>

          {/* 4. Conditional Power Logout Switch Component */}
          {currentSession && (
            <button 
              onClick={logoutTrigger}
              className="text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/20 p-1.5 rounded-lg transition-all"
              title="Disconnect User Passport Node"
            >
              <FiLogOut size={16} />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}