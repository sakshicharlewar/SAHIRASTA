import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Haversine formula for distance calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

const DashboardSidebar = ({ filters, setFilters, applyFilters }) => (
  <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-6 gap-8 w-80 bg-slate-50 border-r-0 overflow-y-auto">
    <div className="flex flex-col gap-6">
      <h2 className="font-headline text-xl font-bold text-on-surface">Filters</h2>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-label font-bold uppercase tracking-widest text-secondary">Max Budget (₹{filters.maxRent.toLocaleString()})</span>
        <div className="bg-surface-container-high rounded-xl p-4 flex flex-col gap-2">
          <input 
            className="w-full accent-primary" 
            max="200000" 
            min="10000" 
            step="5000" 
            type="range" 
            value={filters.maxRent}
            onChange={(e) => setFilters({...filters, maxRent: parseInt(e.target.value)})}
          />
          <div className="flex justify-between text-sm font-semibold text-on-surface-variant">
            <span>₹10k</span><span>₹200k+</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-label font-bold uppercase tracking-widest text-secondary">Max Commute Time</span>
        <div className="flex flex-wrap gap-2">
          {[15, 30, 45, 60].map((t) => (
            <button 
              key={t} 
              onClick={() => setFilters({...filters, maxCommute: t})}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filters.maxCommute === t ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-white'}`}
            >
              {t === 60 ? '60+ min' : `${t} min`}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-label font-bold uppercase tracking-widest text-secondary">Property Type</span>
        <div className="flex flex-col gap-2">
          {[['Apartments', true], ['Independent Floor', false], ['Villas', false]].map(([label, checked]) => (
            <label key={label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-all cursor-pointer group">
              <input defaultChecked={checked} className="rounded border-none bg-surface-container-highest text-primary focus:ring-primary/20" type="checkbox" />
              <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary">{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-label font-bold uppercase tracking-widest text-secondary">Preferred Commute</span>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setFilters({...filters, transportMode: 'car'})}
            className={`flex items-center gap-2 p-3 rounded-xl transition-all ${filters.transportMode === 'car' ? 'bg-white shadow-sm border border-primary/20 text-primary' : 'bg-surface-container-low hover:bg-white'}`}
          >
            <span className="material-symbols-outlined text-xl" style={filters.transportMode === 'car' ? {fontVariationSettings: "'FILL' 1"} : {}}>directions_car</span>
            <span className="text-xs font-bold">Driving</span>
          </button>
          <button 
            onClick={() => setFilters({...filters, transportMode: 'bus'})}
            className={`flex items-center gap-2 p-3 rounded-xl transition-all ${filters.transportMode === 'bus' ? 'bg-white shadow-sm border border-primary/20 text-primary' : 'bg-surface-container-low hover:bg-white'}`}
          >
            <span className="material-symbols-outlined text-xl" style={filters.transportMode === 'bus' ? {fontVariationSettings: "'FILL' 1"} : {}}>train</span>
            <span className="text-xs font-bold">Transit</span>
          </button>
        </div>
      </div>
    </div>
    <div className="mt-auto pt-6">
      <button 
        onClick={applyFilters}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
      >
        Apply Selection
      </button>
    </div>
  </aside>
);

const PropertiesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [allProperties, setAllProperties] = useState([]);
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonList, setComparisonList] = useState([]);
  
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  
  const [filters, setFilters] = useState({
    maxRent: 200000,
    maxCommute: 45,
    transportMode: 'car'
  });

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/saved/user/${user.id}`);
      const data = await response.json();
      if (!data.error) {
        setSavedPropertyIds(new Set(data.map(p => p.id)));
      }
    } catch (error) {
      console.error('Error fetching saved:', error);
    }
  };

  const toggleSave = async (propertyId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/saved/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId, user_id: user.id })
      });
      const data = await res.json();
      
      setSavedPropertyIds(prev => {
        const next = new Set(prev);
        if (data.saved) next.add(propertyId);
        else next.delete(propertyId);
        return next;
      });
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/properties');
      const data = await response.json();
      setAllProperties(data);
      setDisplayedProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allProperties.filter(p => p.rent <= filters.maxRent);
    
    if (user?.workplace_lat) {
      filtered = filtered.filter(p => {
        const dist = calculateDistance(user.workplace_lat, user.workplace_lng, p.lat, p.lng);
        const timeFactor = filters.transportMode === 'car' ? 3 : 5; // Simple multiplier
        const travelTime = Math.round(dist * timeFactor);
        return travelTime <= filters.maxCommute;
      });
    }
    
    setDisplayedProperties(filtered);
  };

  const toggleComparison = (property) => {
    if (comparisonList.find(p => p.id === property.id)) {
      setComparisonList(comparisonList.filter(p => p.id !== property.id));
    } else {
      if (comparisonList.length < 3) {
        setComparisonList([...comparisonList, property]);
      } else {
        alert('You can compare up to 3 properties.');
      }
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-full mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black text-blue-700 tracking-tight font-headline cursor-pointer" onClick={() => navigate('/dashboard')}>SahiRasta</span>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-blue-700 font-bold border-b-2 border-orange-500 pb-1 font-body" href="#">Properties</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/map-view')}>Map View</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/saved-homes')}>Saved Homes</a>
              <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/commute-insights')}>Insights</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {comparisonList.length > 0 && (
              <button 
                onClick={() => navigate('/map-view', { state: { comparison: comparisonList } })}
                className="bg-tertiary text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce"
              >
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                Compare {comparisonList.length}
              </button>
            )}
            <button className="p-2 rounded-full hover:bg-slate-50"><span className="material-symbols-outlined text-slate-600">notifications</span></button>
            <button className="p-2 rounded-full hover:bg-slate-50" onClick={logout} title="Sign Out">
              <span className="material-symbols-outlined text-slate-600">logout</span>
            </button>
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm font-bold text-on-surface-variant hidden md:block">{user?.name}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20">
                <img 
                  alt="User" 
                  className="w-full h-full object-cover cursor-pointer" 
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
                  onClick={() => navigate('/account')} 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        <DashboardSidebar filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
        <main className="flex-1 bg-surface relative" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(193,198,214,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h1 className="text-5xl font-headline font-extrabold text-on-surface mb-4 leading-tight">Heritage living meets modern commute.</h1>
                <p className="text-secondary max-w-lg leading-relaxed">Discover {displayedProperties.length} verified properties tailored to your work-life rhythm in {user?.workplace_address?.split(',')[0] || 'Nagpur'} and beyond.</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-lowest rounded-full font-bold text-sm shadow-sm hover:bg-white transition-all">
                <span className="material-symbols-outlined text-lg">swap_vert</span>Sort by: Relevance
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full h-64 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : displayedProperties.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
                  <h3 className="text-2xl font-bold text-secondary">No properties match your filters</h3>
                  <button onClick={() => { setFilters({maxRent: 200000, maxCommute: 45, transportMode: 'car'}); setDisplayedProperties(allProperties); }} className="mt-4 text-primary font-bold hover:underline">Clear all filters</button>
                </div>
              ) : displayedProperties.map((p) => {
                const distance = calculateDistance(user?.workplace_lat, user?.workplace_lng, p.lat, p.lng);
                const isInComparison = comparisonList.find(item => item.id === p.id);
                
                return (
                  <div key={p.id} className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={p.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      />
                      <div className="absolute top-4 left-4 px-4 py-3 rounded-xl border-l-[3px] border-tertiary flex flex-col shadow-2xl" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
                        <span className="text-[0.6rem] font-label font-bold uppercase tracking-wider text-secondary">Commute Score</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-headline font-extrabold text-on-surface">{p.commute_score ? p.commute_score.toFixed(1) : (distance ? (10 - distance/2).toFixed(1) : '8.5')}</span>
                          <span className="text-xs font-bold text-tertiary">/10</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }} className={`w-10 h-10 ${savedPropertyIds.has(p.id) ? 'bg-error text-white hover:bg-white hover:text-error' : 'bg-white/80 backdrop-blur-md text-on-surface hover:text-error'} rounded-full flex items-center justify-center transition-all shadow-lg`}>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: savedPropertyIds.has(p.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                        <button 
                          onClick={() => toggleComparison(p)}
                          className={`w-10 h-10 ${isInComparison ? 'bg-tertiary text-white' : 'bg-white/80 text-on-surface'} backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-lg`}
                        >
                          <span className="material-symbols-outlined">compare_arrows</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-headline font-bold text-on-surface line-clamp-1">{p.name}</h3>
                          <p className="text-sm text-secondary">{p.locality || 'Nagpur, MH'}</p>
                        </div>
                        <span className="text-xl font-headline font-extrabold text-primary min-w-fit">₹{(p.rent/1000).toFixed(1)}k<span className="text-xs font-medium text-secondary ml-1">/mo</span></span>
                      </div>
                      <div className="flex items-center gap-4 py-4 bg-surface-container-low rounded-xl px-4 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-secondary text-lg">bed</span><span className="text-sm font-bold">{p.bedrooms || '2'} BHK</span></div>
                        <div className="flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-secondary text-lg">square_foot</span><span className="text-sm font-bold">{p.sqft || '1,200'}</span></div>
                        <div className="flex items-center gap-2 whitespace-nowrap text-primary">
                          <span className="material-symbols-outlined text-lg">{filters.transportMode === 'car' ? 'directions_car' : 'train'}</span>
                          <span className="text-sm font-bold">{distance ? `${Math.round(distance * (filters.transportMode === 'car' ? 3 : 5))} min` : '15 min'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <button 
                          onClick={() => navigate('/map-view', { state: { comparison: [p] } })}
                          className="py-3 px-4 bg-surface-container-highest text-on-surface font-bold rounded-xl text-sm hover:bg-surface-container-high transition-all"
                        >
                          Quick Map View
                        </button>
                        <button 
                          onClick={() => navigate(`/properties/${p.id}`)}
                          className="py-3 px-4 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                          Book Now <span className="material-symbols-outlined text-sm">bolt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CTA Card */}
              <div className="flex flex-col bg-primary-container rounded-xl overflow-hidden relative p-8 justify-center items-start text-white xl:col-span-2">
                <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                  <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                </div>
                <h2 className="text-3xl font-headline font-extrabold mb-4 relative z-10">Don't see your perfect match?</h2>
                <p className="text-lg opacity-90 mb-8 max-w-md relative z-10">Our AI-guided pathfinder can scan unlisted off-market properties based on your office location and lifestyle preferences.</p>
                <button className="px-8 py-4 bg-tertiary text-white rounded-xl font-bold hover:bg-tertiary-container transition-all shadow-xl shadow-black/20 relative z-10 active:scale-95">Start AI Search Journey</button>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-16">
              <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-full">
                {[1, 2, 3].map((n) => (
                  <button key={n} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${n === 1 ? 'bg-white shadow-sm text-primary' : 'hover:bg-white text-secondary transition-all'}`}>{n}</button>
                ))}
                <span className="px-2 text-secondary">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-secondary font-bold transition-all">14</button>
                <button className="flex items-center gap-2 pl-4 pr-6 py-2 rounded-full bg-white shadow-sm font-bold text-primary hover:bg-primary hover:text-white transition-all">
                  Next <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-3 flex justify-between items-center z-50">
        {[['home', 'Explore', true], ['favorite', 'Saved', false], ['trending_up', 'Trends', false], ['person', 'Profile', false]].map(([icon, label, active]) => (
          <button key={label} className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default PropertiesPage;
