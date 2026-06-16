import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfilePortfolio({ currentUser }) {
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'temp',
    email: currentUser?.email || 'temp@gmail.com',
    avatar: currentUser?.avatar || '',
    location: currentUser?.location || 'Jaipur, India',
    joinedDate: currentUser?.joinedDate || '2026-01'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  const [activeSubTab, setActiveSubTab] = useState('purchased');

  const [userProducts, setUserProducts] = useState({
    purchased: [],
    forSale: [],
    pending: [],
    rejected: []
  });

  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const updatedProfile = {
        name: currentUser.name || 'temp',
        email: currentUser.email || 'temp@gmail.com',
        avatar: currentUser.avatar || '',
        location: currentUser.location || 'Jaipur, India',
        joinedDate: currentUser.joinedDate || '2026-01'
      };

      setProfile(updatedProfile);
      setEditForm(updatedProfile);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    axios.get('https://amazon-hackathon-backend-2htg.onrender.com/api/marketplace/all-products')
      .then(res => {
        if (Array.isArray(res.data)) {
          const allItems = res.data;
          const myUserId = currentUser?._id || currentUser?.id;

          const getId = (value) => {
            if (!value) return '';
            if (typeof value === 'object') return String(value._id || value.id || '');
            return String(value);
          };

          const myItems = allItems.filter(p => {
            return getId(p.sellerId) === String(myUserId);
          });

          const purchasedItems = allItems.filter(p => {
            return getId(p.buyerId) === String(myUserId);
          });

          const forSaleItems = myItems.filter(p => {
            const status = String(p.status || '').toUpperCase();
            return status === 'APPROVED' || status === 'RESELL';
          });

          const pendingItems = myItems.filter(p => {
            const status = String(p.status || '').toUpperCase();
            return (
              status.includes('PENDING') ||
              status.includes('APPROVAL') ||
              status.includes('REVIEW') ||
              status.includes('QUOTE') ||
              status === 'QUOTED' ||
              status === 'UNDER_REVIEW'
            );
          });

          const rejectedItems = myItems.filter(p => {
            const status = String(p.status || '').toUpperCase();
            return (
              status === 'REJECTED' ||
              status.includes('REJECT') ||
              status === 'DECLINED'
            );
          });

          setUserProducts({
            purchased: purchasedItems,
            forSale: forSaleItems,
            pending: pendingItems,
            rejected: rejectedItems
          });
        }

        setLoadingHistory(false);
      })
      .catch(err => {
        console.error("Failed to compile profile history tables:", err);
        setLoadingHistory(false);
      });
  }, [currentUser]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setEditForm({ ...editForm, avatar: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const saveProfileModifications = async () => {
    const myUserId = currentUser?._id || currentUser?.id;

    try {
      const response = await axios.put(`https://amazon-hackathon-backend-2htg.onrender.com/api/auth/update-profile/${myUserId}`, {
        name: editForm.name,
        location: editForm.location,
        avatar: editForm.avatar
      });

      if (response.data.success) {
        setProfile({ ...editForm });
        setIsEditing(false);
        alert("🎉 Changes saved permanently to database ledgers!");
      }
    } catch (err) {
      alert("Failed to commit updates to backend records.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">

      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">
            User Node Account Portfolio
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Review decentralized sustainability credentials and micro-settlement parameters.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isEditing) setEditForm({ ...profile });
            setIsEditing(!isEditing);
          }}
          className="text-xs font-bold bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:text-amber-400 px-4 py-2 rounded-xl transition-all"
        >
          {isEditing ? "Cancel Modifications" : "Edit Profile Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative">
          {isEditing ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                  {editForm.avatar ? (
                    <img src={editForm.avatar} alt="Avatar Draft" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">📸</span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <p className="text-[10px] text-slate-500 font-mono">
                  Click widget box to select file
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Display Name"
                />

                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Regional Node Location"
                />

                <button
                  onClick={saveProfileModifications}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] tracking-wider py-2 rounded-lg uppercase transition-all shadow-md"
                >
                  Commit Profile Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="User Node Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{profile.name}</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                    {currentUser?.role || 'user'} node
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3 space-y-2.5 font-mono text-[11px]">
                <div>
                  <p className="text-slate-500 uppercase text-[9px] tracking-wider">Identity Anchor ID</p>
                  <p className="text-slate-300 truncate font-semibold">
                    {currentUser?._id || currentUser?.id || '6a2d9d92397d5739a2514c27'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 uppercase text-[9px] tracking-wider">Communication Interface</p>
                  <p className="text-slate-300 font-semibold">{profile.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-900 pt-2.5 mt-1 text-[10px]">
                  <div>
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider">Location context</p>
                    <p className="text-slate-400 font-semibold">{profile.location}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider">Node Registry</p>
                    <p className="text-slate-400 font-semibold">{profile.joinedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1">
            <h4 className="text-xs font-black font-mono tracking-widest text-emerald-400 uppercase">
              Sustainability Token Allocation
            </h4>
            <p className="text-xs text-slate-400">
              Green credits are dynamically minted by validation agents upon successful circular item lifecycles.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-baseline space-x-2">
            <span className="text-4xl font-black text-white font-mono tracking-tighter">
              +{currentUser?.greenCredits || 0}
            </span>
            <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Green Credits
            </span>
          </div>

          <div className="border-t border-slate-900 pt-3 mt-4 text-[10px] font-mono text-slate-500 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ledger status active and verified synchronized.</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">

        <div className="flex border-b border-slate-900 pb-px overflow-x-auto">
          {[
            { id: 'purchased', label: 'Purchased Items' },
            { id: 'forSale', label: 'Sell Items By Me' },
            { id: 'pending', label: 'Pending Approvals' },
            { id: 'rejected', label: 'Rejected Items' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`text-xs font-black font-mono uppercase tracking-wider pb-3 px-4 border-b-2 transition-all focus:outline-none -mb-px whitespace-nowrap ${
                activeSubTab === tab.id
                  ? tab.id === 'rejected'
                    ? 'border-red-500 text-red-400 font-bold'
                    : 'border-amber-500 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label} ({loadingHistory ? "..." : userProducts[tab.id].length})
            </button>
          ))}
        </div>

        {loadingHistory ? (
          <div className="text-center py-12 font-mono text-xs text-slate-500">
            Querying localized user history grids...
          </div>
        ) : userProducts[activeSubTab].length === 0 ? (
          <div className="border border-dashed border-slate-900 rounded-xl p-12 text-center text-slate-500 text-xs font-mono">
            <span>📋 No ledger records found matching this filtering tab classification.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  <th className="pb-3 pl-2">Asset Reference</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3">Condition Grade</th>
                  <th className="pb-3">Financial Value</th>
                  <th className="pb-3 pr-2 text-right">Status State</th>
                </tr>
              </thead>

              <tbody className="text-xs text-slate-300 font-mono divide-y divide-slate-900/60">
                {userProducts[activeSubTab].map(product => (
                  <tr key={product._id} className="hover:bg-slate-900/20 transition-colors group">
                    <td className="py-3.5 pl-2 font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {product.productId}
                    </td>

                    <td className="py-3.5 text-slate-400">{product.category}</td>

                    <td className="py-3.5">
                      <span className="text-amber-500 font-bold">{product.conditionScore}</span> / 100
                    </td>

                    <td className="py-3.5 font-bold text-slate-100">
                      {product.finalMarketplacePrice || product.marketResaleValuation || 0} Credits
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase border tracking-wider ${
                        activeSubTab === 'purchased'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : activeSubTab === 'forSale'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : activeSubTab === 'rejected'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {activeSubTab === 'purchased' ? 'SECURED' : product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}