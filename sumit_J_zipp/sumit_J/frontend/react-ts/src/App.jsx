import React, { useState } from 'react';
import Header from '/src/Header';
import ReturnPrevention from './ReturnPrevention'
import Footer from '/src/Footer';
import MarketplaceHome from '/src/MarketplaceHome';
import ReturnPortal from '/src/ReturnPortal';
import AdminDashboard from '/src/AdminDashboard';
import ProfilePortfolio from '/src/ProfilePortfolio';
import ShoppingCartView from '/src/ShoppingCartView'; // Standalone shopping cart view page

export default function App() {
  const [session, setSession] = useState(null); // System authentication state context
  const [activeTab, setActiveTab] = useState('marketplace'); // Default view remains marketplace
  const [searchQuery, setSearchQuery] = useState(''); // Global search filter query string state
  
  // Global E-Commerce Shopping Cart item state stack array
  const [cart, setCart] = useState([]);

  // Auth Form State Fields
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorLog, setErrorLog] = useState('');

  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const executeAuthAction = async (e) => {
    e.preventDefault();
    setErrorLog('');
    const targetEndpoint = isRegistering ? 'register' : 'login';
    try {
      const res = await fetch(`https://amazon-hackathon.onrender.com/api/auth/${targetEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSession(data.user);
      setActiveTab('marketplace'); // Redirect straight back to marketplace home after login
    } catch (err) { setErrorLog(err.message); }
  };

  const handleLogout = () => {
    setSession(null);
    setActiveTab('marketplace'); // Gracefully drop to home view on disconnect
    setSearchQuery(''); // Reset search state
    setCart([]); // Clear out active temporary cart selections
  };

  // Global validation helper function adding items to checkout queues safely
  const handleAddToCart = (productItem) => {
    if (cart.some(item => item._id === productItem._id)) {
      alert("This item is already added inside your shopping cart catalog bag.");
      return;
    }
    setCart([...cart, productItem]);
    alert("📦 Product linked into your checkout cart allocation stack!");
  };

  // 🔒 Intercept state switches cleanly from Header events
  const handleTabChange = (targetTab, extraData) => {
    // INTERCEPT LIVE SEARCH KEYSTROKES: Updates search text state without changing panels
    if (targetTab === 'search_query_update') {
      setSearchQuery(extraData || '');
      return;
    }

    // Unprotected general public views that do not require an active user login passport
    if (targetTab === 'marketplace' || targetTab === 'login_gateway' || targetTab === 'cart_view' || targetTab === 'prevention') {
      setActiveTab(targetTab);
      return;
    }

    // Direct protection gate: check for user session tokens
    if (!session) {
      setActiveTab('login_gateway');
      return;
    }

    // Admin authorization rule verification
    if (targetTab === 'admin' && session.role !== 'admin') {
      setActiveTab('marketplace');
      return;
    }

    setActiveTab(targetTab);
  };

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col justify-between font-sans antialiased">
      <div>
        {/* Passing down cart array tracking metrics directly into Header badge elements */}
        <Header 
          currentSession={session} 
          activeTabSetter={handleTabChange} 
          logoutTrigger={handleLogout} 
          cartCount={cart.length} 
        />
        
        <main className="container mx-auto max-w-7xl p-6">
          
          {/* 🌐 PERMANENT HOME VIEW */}
          {activeTab === 'marketplace' && (
            <MarketplaceHome 
              currentSession={session} 
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart} // Passed product additions tracking property hook
              redirectToLogin={() => setActiveTab('login_gateway')} 
            />
          )}

          {/* ⚡ SHOPPING CART MANAGEMENT ELEMENT PANEL */}
          {activeTab === 'cart_view' && (
            <ShoppingCartView 
              currentSession={session} 
              cartItems={cart} 
              setCartItems={setCart}
              onPurchaseComplete={(updatedCreditsBalance) => {
                // Modifies the active user session token parameters to scale credit updates live on purchase completion
                setSession({ ...session, greenCredits: updatedCreditsBalance });
                setActiveTab('profile_portfolio'); // Direct navigation to view transaction data tables
              }}
              redirectToLogin={() => setActiveTab('login_gateway')}
            />
          )}

          {/* 🤖 HACKATHON ADDITION: AI RETURN PREVENTION ANALYSIS VIEW */}
          {activeTab === 'prevention' && (
            <ReturnPrevention />
          )}

          {/* 🔒 PROTECTED TRADE-IN PORTAL LINK */}
          {activeTab === 'return' && session && (
            <ReturnPortal currentUser={session} session={session} />
          )}

          {/* 🔒 PROTECTED PORTFOLIO LEDGER DASHBOARD */}
          {activeTab === 'profile_portfolio' && session && (
            <ProfilePortfolio currentUser={session} session={session} />
          )}

          {/* 🔒 ADMINISTRATIVE COMMAND CONTROL */}
          {activeTab === 'admin' && session?.role === 'admin' && (
            <AdminDashboard 
              currentUser={session} 
              session={session} 
              // ⚡ NEW EVENT HOOK: Catches batch approvals to recalculate active user balances instantly!
              onCreditsMinted={(addedCredits) => {
                setSession(prev => prev ? { ...prev, greenCredits: prev.greenCredits + addedCredits } : null);
              }}
            />
          )}

          {/* 🔐 GUEST ENTRY PATHWAY */}
          {activeTab === 'login_gateway' && !session && (
            <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 mt-12 animate-fadeIn">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-100">
                  {isRegistering ? 'Register Account Profile' : 'Identity Verification Signature Gateway'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Connect to access Second Life Commerce ledgers.</p>
              </div>

              <form onSubmit={executeAuthAction} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input required type="text" name="name" value={authForm.name} onChange={handleAuthChange} placeholder="John Doe" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-slate-700" />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Identification Address</label>
                  <input required type="email" name="email" value={authForm.email} onChange={handleAuthChange} placeholder="user@example.com" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-slate-700" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Security Entry Key Token</label>
                  <input required type="password" name="password" value={authForm.password} onChange={handleAuthChange} placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-white placeholder-slate-700" />
                </div>
                {isRegistering && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Designated System Group Role Clearance</label>
                    <select name="role" value={authForm.role} onChange={handleAuthChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none text-white bg-slate-950">
                      <option value="user">Standard Circular User Node</option>
                      <option value="admin">Platform Administrative Clearance Node</option>
                    </select>
                  </div>
                )}
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-all tracking-wider uppercase shadow-md shadow-amber-500/5">
                  {isRegistering ? 'Initialize Register Profiles' : 'Authenticate Signature Entry'}
                </button>
              </form>

              {errorLog && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">{errorLog}</div>}

              <div className="text-center text-xs">
                <button onClick={() => { setIsRegistering(!isRegistering); setErrorLog(''); }} className="text-amber-500 hover:underline">
                  {isRegistering ? 'Already have a profile registry entry? Sign In' : 'Need to allocate a new connection passport registry? Create Account'}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
}