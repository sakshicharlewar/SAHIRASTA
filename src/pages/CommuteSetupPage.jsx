import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and move view
const MapHandler = ({ setWorkplace, workplace }) => {
  const map = useMap();
  useMapEvents({
    click(e) {
      setWorkplace(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
    },
  });

  useEffect(() => {
    map.flyTo([workplace.lat, workplace.lng], map.getZoom());
  }, [workplace.lat, workplace.lng, map]);

  return <Marker position={[workplace.lat, workplace.lng]} />;
};

const CommuteSetupPage = () => {
  const navigate = useNavigate();
  const { user, updateWorkplace, logout } = useAuth();
  const [workplace, setWorkplace] = useState({
    lat: user?.workplace_lat || 21.1458,
    lng: user?.workplace_lng || 79.0882,
    address: user?.workplace_address || ''
  });
  const [maxTime, setMaxTime] = useState(30);
  const [mode, setMode] = useState('car');
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = async () => {
    setSaveStatus('Saving...');
    const result = await updateWorkplace({
      workplace_lat: workplace.lat,
      workplace_lng: workplace.lng,
      workplace_address: workplace.address
    });
    if (result.success) {
      setSaveStatus('Profile Saved!');
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('Error saving profile.');
    }
  };

  const navLinks = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'directions_transit', label: 'Commute Setup', path: '/commute-setup', active: true },
    { icon: 'map', label: 'Properties Map', path: '/map-view' },
    { icon: 'search_check', label: 'Saved Searches', path: '/saved-homes' },
    { icon: 'person_outline', label: 'Account', path: '/account' },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col lg:flex-row overflow-x-hidden font-body">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-4 gap-2 bg-slate-50 w-64 z-40 border-r border-slate-200">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white">directions_transit</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-700 tracking-tight font-headline">SahiRasta</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">The Guided Heritage</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navLinks.map(({ icon, label, path, active }) => (
            <a key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${active ? 'bg-primary text-white shadow-md font-semibold' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`} onClick={() => navigate(path)}>
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-medium text-sm">{label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 pt-4">
          <a className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 rounded-xl cursor-pointer" onClick={logout}><span className="material-symbols-outlined">logout</span><span className="font-medium">Sign Out</span></a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-surface min-h-screen">
        <header className="flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="hidden lg:flex items-center gap-8">
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight font-headline">Commute Preferences</h2>
          </div>
          <div className="lg:hidden text-2xl font-black text-blue-700 tracking-tight font-headline cursor-pointer" onClick={() => navigate('/dashboard')}>SahiRasta</div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <div className="flex items-center gap-3 px-1 py-1 bg-surface-container rounded-full border border-outline-variant/10">
              <span className="text-sm font-bold ml-2 text-on-surface-variant hidden md:block">{user?.name}</span>
              <img alt="User" className="w-8 h-8 rounded-full object-cover border border-outline-variant/20 shadow-sm" src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <section className="space-y-4">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">Step 1: Workplace Setup</span>
            <h3 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-none font-headline">Where do you <span className="text-primary underline decoration-primary/20 underline-offset-8">work?</span></h3>
            <p className="text-secondary text-lg max-w-2xl leading-relaxed">Pin your office location on the real map below. We'll use this to calculate travel times for every property you view.</p>
          </section>

          {/* Interactive Map Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[600px]">
            {/* Map Column */}
            <div className="xl:col-span-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group h-full">
              <MapContainer center={[workplace.lat, workplace.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapHandler workplace={workplace} setWorkplace={setWorkplace} />
              </MapContainer>
              <div className="absolute top-4 left-4 z-[1000] p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/50 max-w-xs">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <span className="material-symbols-outlined font-black">add_location_alt</span>
                  <span className="font-headline font-bold text-sm">Location Picked</span>
                </div>
                <p className="text-[10px] font-mono text-secondary truncate">{workplace.lat.toFixed(6)}, {workplace.lng.toFixed(6)}</p>
                <div className="mt-2 text-xs text-secondary leading-tight italic">Drag the map or click to update the pin to your exact office spot.</div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="xl:col-span-4 flex flex-col gap-6 overflow-y-auto">
              {/* Address Input */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <label className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Workplace Description</label>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">apartment</span>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                      placeholder="e.g. IT Park, Nagpur"
                      value={workplace.address}
                      onChange={(e) => setWorkplace({ ...workplace, address: e.target.value })}
                    />
                  </div>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex justify-between text-xs font-bold text-secondary mb-1">
                      <span>Coordinates Saved</span>
                      <span>Live Feed</span>
                    </div>
                    <p className="text-sm font-mono font-bold text-on-surface">{workplace.lat.toFixed(4)}, {workplace.lng.toFixed(4)}</p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex-1 flex flex-col gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Max Commute Time</label>
                  <div className="flex flex-col gap-4">
                    <input 
                      className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary" 
                      max="120" min="10" type="range" 
                      value={maxTime}
                      onChange={(e) => setMaxTime(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between items-center bg-primary/10 p-3 rounded-xl border border-primary/20">
                      <span className="text-xs font-bold text-primary">Travel Threshold</span>
                      <span className="text-xl font-black text-primary">{maxTime} min</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Commute Mode</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      ['directions_car', 'car', 'Car'], 
                      ['directions_bus', 'bus', 'Bus'],
                      ['directions_bike', 'bike', 'Bike'],
                      ['directions_walk', 'walk', 'Walk']
                    ].map(([icon, m, label]) => (
                      <button 
                        key={icon} 
                        onClick={() => setMode(m)}
                        title={label}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${mode === m ? 'bg-primary text-white shadow-xl scale-105' : 'bg-slate-50 text-secondary hover:bg-slate-100'}`}
                      >
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                        <span className="text-[10px] font-bold uppercase">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={handleSave}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    {saveStatus === 'Saving...' && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span className="material-symbols-outlined">verified</span>
                    {saveStatus || 'Confirm Profile'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Real Map Visibility Info */}
          <section className="bg-surface-container-high p-8 rounded-3xl border border-white/50 shadow-inner">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="h-24 w-24 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0 border border-slate-100">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">map</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-on-surface font-headline italic">Real Map Verification</h4>
                <p className="text-secondary leading-relaxed">The map above is an interactive <span className="text-primary font-bold">OpenStreetMap</span> instance. Changes you make here are synchronized instantly with your property search results. You can see your workplace location anchor on the dashboard map as well once saved.</p>
              </div>
              <button 
                onClick={() => navigate('/properties')}
                className="ml-auto bg-white text-primary px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95"
              >
                Go to Listings
                <span className="material-symbols-outlined">explore</span>
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-auto border-t border-outline-variant/10 p-10 bg-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-primary font-headline">SahiRasta</h2>
              <p className="text-secondary text-sm font-medium">Built for the Nagpur Heritage Commute.</p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 SahiRasta Commute Intelligence</div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CommuteSetupPage;
