import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SavedHomesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSavedProperties();
  }, [user]);

  const fetchSavedProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/saved/user/${user.id}`);
      const data = await res.json();
      if (!data.error) {
        setSavedProperties(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId) => {
    try {
      await fetch('http://localhost:5000/api/saved/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId, user_id: user.id })
      });
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompareAll = () => {
    if (savedProperties.length > 0) {
      navigate('/map-view', { state: { comparison: savedProperties } });
    }
  };

  const navLinks = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'directions_transit', label: 'Commute Setup', path: '/commute-setup' },
    { icon: 'search_check', label: 'Saved Searches', path: '/saved-homes', active: true },
    { icon: 'trending_up', label: 'Market Trends', path: '/commute-insights' },
    { icon: 'person_outline', label: 'Account', path: '/account' },
  ];

  return (
    <div className="flex min-h-screen bg-surface font-body text-on-surface">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-4 gap-2 w-64 bg-slate-50">
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold text-blue-700 tracking-tight font-headline cursor-pointer" onClick={() => navigate('/dashboard')}>SahiRasta</h1>
          <p className="text-[0.65rem] uppercase tracking-widest text-slate-500 font-label mt-1">The Guided Heritage</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navLinks.map(({ icon, label, path, active }) => (
            <a key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white text-blue-700 shadow-sm font-semibold translate-x-1' : 'text-slate-500 hover:bg-white/80'}`} onClick={() => navigate(path)}>
              <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
              <span className="font-medium">{label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-outline-variant/20 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/80 rounded-xl"><span className="material-symbols-outlined">help_outline</span><span className="font-medium">Help Center</span></button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/80 rounded-xl" onClick={logout}><span className="material-symbols-outlined">logout</span><span className="font-medium">Sign Out</span></button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="flex justify-between items-center w-full px-6 py-3 bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <div className="lg:hidden text-2xl font-black text-blue-700 tracking-tight font-headline cursor-pointer" onClick={() => navigate('/dashboard')}>SahiRasta</div>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/properties')}>Properties</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/map-view')}>Map View</a>
              <a className="text-blue-700 font-bold border-b-2 border-orange-500 pb-1">Saved Homes</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/commute-insights')}>Insights</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-50"><span className="material-symbols-outlined">notifications</span></button>
            <button className="p-2 rounded-full hover:bg-slate-50"><span className="material-symbols-outlined">settings</span></button>
            <img alt="User" className="h-8 w-8 rounded-full object-cover" src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Hero */}
          <section className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
            <div>
              <span className="text-xs font-label font-bold text-tertiary tracking-[0.1em] uppercase mb-4 block">Personal Gallery</span>
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight">Your Saved Homes</h2>
              <p className="mt-4 text-secondary text-lg max-w-xl">You have {savedProperties.length} properties saved to your collection.</p>
            </div>
            
            {savedProperties.length > 0 && (
              <button 
                onClick={handleCompareAll}
                className="flex items-center justify-center gap-3 bg-tertiary text-white px-8 py-5 rounded-2xl font-black shadow-xl shadow-tertiary/20 hover:scale-[1.02] hover:shadow-2xl transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">compare_arrows</span>
                COMPARE ALL SAVED ({savedProperties.length})
              </button>
            )}
          </section>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : savedProperties.length === 0 ? (
            <div className="bg-surface-container-lowest p-16 rounded-3xl text-center shadow-sm border border-outline-variant/20 flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-6">bookmark_added</span>
              <h3 className="text-2xl font-headline font-black text-on-surface mb-2">No Saved Properties Yet</h3>
              <p className="text-secondary max-w-md mx-auto mb-8">Start exploring the properties page and click the heart icon to securely save top candidate properties here.</p>
              <button onClick={() => navigate('/properties')} className="px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary-container hover:-translate-y-1 transition-all shadow-lg shadow-primary/20">Explore Properties</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {savedProperties.map((p) => (
                <div key={p.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={p.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} />
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderLeft: '3px solid #8e4d00', boxShadow: '0 12px 40px rgba(25,28,29,0.06)' }}>
                      <span className="text-[0.65rem] font-label font-bold text-secondary block">COMMUTE SCORE</span>
                      <span className="text-xl font-headline font-bold text-on-surface">{p.commute_score ? p.commute_score.toFixed(1) : '8.5'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-headline font-bold text-on-surface line-clamp-1">{p.name}</h3>
                        <p className="text-sm text-secondary">{p.locality || 'Nagpur, MH'}</p>
                      </div>
                      <span className="text-lg font-bold text-primary min-w-fit">₹{(p.rent/1000).toFixed(1)}k</span>
                    </div>
                    
                    <div className="flex items-center gap-4 py-4 mt-2 border-t border-outline-variant/10">
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-sm">bed</span><span className="text-xs font-bold">{p.bedrooms} BHK</span></div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-sm">square_foot</span><span className="text-xs font-bold">{p.sqft} sqft</span></div>
                      <div className="ml-auto bg-surface-container-low px-3 py-1 rounded-full text-primary"><span className="text-[10px] uppercase font-black tracking-widest">SAVED</span></div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => navigate('/map-view', { state: { comparison: [p] } })} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-colors active:scale-95 shadow-lg shadow-primary/20">View on Map</button>
                      <button onClick={() => removeSavedProperty(p.id)} className="px-4 py-3 border border-outline-variant/30 rounded-xl text-error hover:bg-error/10 hover:border-error/30 transition-colors tooltip"><span className="material-symbols-outlined text-sm">heart_minus</span></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <footer className="mt-20 py-10 px-6 border-t border-outline-variant/10 text-center">
          <p className="text-xs font-label text-secondary uppercase tracking-[0.2em]">© 2024 SahiRasta Real Estate Tech. Crafted for precision.</p>
        </footer>
      </main>
    </div>
  );
};

export default SavedHomesPage;
