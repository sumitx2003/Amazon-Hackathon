import React from 'react';
// Official social media brand icons
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
// Official premium payment brand icons
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCcDiscover, 
  FaPaypal, 
  FaApplePay, 
  FaGooglePay 
} from 'react-icons/fa6';
import { SiShopify } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto text-slate-200">
      
      {/* Upper Footer: Multi-Column E-Commerce Layout */}
      <div className="container mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-900">
        
        {/* Column 1: About */}
        <div className="space-y-3">
          <h4 className="text-xs font-black font-mono uppercase tracking-widest text-white">About</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Who We Are</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Terms of Service</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Reviews</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Wholesale</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Column 2: Help */}
        <div className="space-y-3">
          <h4 className="text-xs font-black font-mono uppercase tracking-widest text-white">Help</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Shipping Policy</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Returns Policy</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Start Your Return</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Help Center</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* Column 3: Follow Us (Vector Shapes) */}
        <div className="space-y-3">
          <h4 className="text-xs font-black font-mono uppercase tracking-widest text-white">Follow us</h4>
          <div className="flex items-center space-x-5 text-lg">
            <a 
              href="https://www.instagram.com/amazon/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200"
              title="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a 
              href="https://www.facebook.com/search/top?q=amazon%20india" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200"
              title="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
            <a 
              href="https://www.linkedin.com/company/amazon/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200"
              title="LinkedIn"
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>

        {/* Column 4: We Accept (⚡ FIXED: Added small high-contrast white box backgrounds) */}
        <div className="space-y-3">
          <h4 className="text-xs font-black font-mono uppercase tracking-widest text-white">We accept</h4>
          <div className="flex flex-wrap gap-2 max-w-[220px]">
            
            {/* Visa */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="Visa">
              <FaCcVisa size={22} className="text-[#1a1f71]" />
            </div>
            
            {/* Mastercard */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="Mastercard">
              <FaCcMastercard size={22} className="text-[#eb001b]" />
            </div>
            
            {/* Amex */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="American Express">
              <FaCcAmex size={22} className="text-[#0170b2]" />
            </div>
            
            {/* Discover */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="Discover">
              <FaCcDiscover size={22} className="text-[#f48120]" />
            </div>
            
            {/* PayPal */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="PayPal">
              <FaPaypal size={22} className="text-[#003087]" />
            </div>
            
            {/* Apple Pay */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="Apple Pay">
              <FaApplePay size={22} className="text-black" />
            </div>
            
            {/* Google Pay */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="Google Pay">
              <FaGooglePay size={22} className="text-black" />
            </div>
            
            {/* Shopify Pay */}
            <div className="bg-white border border-white px-2 py-1 rounded shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center" title="Shopify Pay">
              <SiShopify size={22} className="text-[#96bf48]" />
            </div>

          </div>
        </div>

      </div>

      {/* Lower Footer: Operational Status Receipts */}
      <div className="container mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono tracking-wide text-slate-300">
        
        {/* Left Row */}
        <div className="flex items-center space-x-2 text-center md:text-left">
          <span className="text-white font-medium">&copy; 2026 Amazon Second Life Commerce.</span>
          <span className="hidden md:inline text-slate-800">|</span>
          <span>Logistics Optimization Engine</span>
        </div>

        {/* Center Row: Node Clusters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            <span>Cluster-01 Stable</span>
          </div>
          <span className="text-slate-800">•</span>
          <div>
            <span>API Latency: <span className="text-emerald-400 font-bold">14ms</span></span>
          </div>
        </div>

        {/* Right Row */}
        <div className="hover:text-amber-400 font-medium transition-colors cursor-pointer text-center md:text-right">
          <span>HackOn with Amazon Submission</span>
        </div>

      </div>
    </footer>
  );
}