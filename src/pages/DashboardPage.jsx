import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !points || points.length === 0) return;
    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.4: 'rgba(0,0,255,0.5)', 0.65: 'rgba(0,255,0,0.5)', 1: 'rgba(255,0,0,0.5)' }
    }).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, points]);
  return null;
};

const workplaceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const workplacePos = [user?.workplace_lat || 21.1458, user?.workplace_lng || 79.0882];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data.slice(0, 5)); // Just top 5 for dashboard
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="bg-background font-body text-on-background min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span
              className="text-2xl font-black text-blue-800 tracking-tighter font-headline cursor-pointer"
              onClick={() => navigate('/')}
            >
              SahiRasta
            </span>
            <nav className="hidden md:flex gap-6 items-center">
              <a className="text-blue-700 border-b-2 border-orange-500 pb-1 font-bold font-headline cursor-pointer">Home</a>
              <a className="text-slate-600 hover:text-blue-600 transition-colors font-headline cursor-pointer" onClick={() => navigate('/properties')}>Properties</a>
              <a className="text-slate-600 hover:text-blue-600 transition-colors font-headline cursor-pointer" onClick={() => navigate('/commute-setup')}>Commute Setup</a>
              <a className="text-slate-600 hover:text-blue-600 transition-colors font-headline cursor-pointer" onClick={() => navigate('/saved-homes')}>Saved Homes</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="bg-surface-container-high border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64"
                placeholder="Search locality..."
                type="text"
              />
            </div>
            <button className="p-2 hover:bg-blue-50/50 rounded-lg transition-all">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <button className="p-2 hover:bg-blue-50/50 rounded-lg transition-all" onClick={logout} title="Sign Out">
              <span className="material-symbols-outlined text-on-surface-variant">logout</span>
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

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="h-[calc(100vh-72px)] w-64 hidden lg:flex flex-col bg-slate-50 fixed left-0 top-[72px] pt-8 pb-8 px-4 gap-2 z-40">
          <div className="px-4 mb-6">
            <h2 className="text-xl font-bold text-blue-900 font-headline">Your Journey</h2>
            <p className="text-xs text-slate-500 font-medium">The Guided Heritage</p>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { icon: 'dashboard', label: 'Dashboard', path: '/dashboard', active: true },
              { icon: 'home', label: 'Properties', path: '/properties', active: false },
              { icon: 'map', label: 'Map View', path: '/map-view', active: false },
              { icon: 'directions_transit', label: 'Commute Setup', path: '/commute-setup', active: false },
              { icon: 'favorite', label: 'Saved Homes', path: '/saved-homes', active: false },
              { icon: 'route', label: 'Commute Insights', path: '/commute-insights', active: false },
              { icon: 'person', label: 'Account', path: '/account', active: false },
            ].map(({ icon, label, path, active }) => (
              <a
                key={label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-transform duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-blue-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
                onClick={() => navigate(path)}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                <span className="font-label">{label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto px-2">
            <button className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-container transition-all" onClick={() => navigate('/properties')}>
              Start New Search
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">

          {/* Welcome & Quick Stats */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8 space-y-2">
              <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-background">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-lg text-secondary font-medium">Find homes within your ideal {user?.workplace_address ? 'commute to work' : 'lifestyle'}.</p>
              <div className="mt-6 inline-flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20">
                <span className="text-xs font-bold font-label uppercase tracking-widest text-outline">Active Profile</span>
                <div className="h-4 w-[1px] bg-outline-variant/30"></div>
                <span className="text-sm font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">verified</span>
                  {user?.workplace_address || "Nagpur Heritage Zone"}
                </span>
              </div>
            </div>
            <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-4">
              {[
                { color: 'blue-600', icon: 'home', label: 'Properties near you', value: '1,240 Units' },
                { color: 'orange-600', icon: 'speed', label: 'Avg Commute Score', value: '88/100' },
                { color: 'green-600', icon: 'payments', label: 'Estimated Savings', value: '₹4,500' },
              ].map(({ color, icon, label, value }) => (
                <div key={label} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm flex items-center gap-4`} style={{ borderLeftColor: color }}>
                  <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}10` }}>
                    <span className={`material-symbols-outlined`} style={{ color }}>{icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold font-label text-outline uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold font-headline">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dashboard Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left: Setup + Map */}
            <div className="xl:col-span-8 space-y-8">
              {/* Commute Setup Panel */}
              <div className="bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 pointer-events-none opacity-5"
                  style={{ backgroundImage: 'radial-gradient(#c1c6d6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
                ></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-headline">Commute Preferences</h3>
                    <button className="text-primary text-sm font-bold flex items-center gap-1" onClick={() => navigate('/commute-setup')}>
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Modify Profile
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-label text-outline uppercase tracking-widest">Workplace</label>
                      <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                        <span className="material-symbols-outlined text-primary">work</span>
                        <span className="text-sm font-bold truncate">{user?.workplace_address || 'Not Set'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-label text-outline uppercase tracking-widest">Max Commute</label>
                      <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                        <span className="material-symbols-outlined text-orange-500">timer</span>
                        <span className="text-sm font-bold">45 Minutes</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-label text-outline uppercase tracking-widest">Transport Mode</label>
                      <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
                        <span className="material-symbols-outlined text-blue-500">directions_car</span>
                        <span className="text-sm font-bold">Driving</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden h-[500px] relative border border-outline-variant/10 shadow-sm z-10">
                <MapContainer center={workplacePos} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <HeatmapLayer points={properties.map(p => [p.lat, p.lng, 1.0])} />
                  <Marker position={workplacePos} icon={workplaceIcon}>
                    <Popup>
                      <div className="font-bold">Your Workplace</div>
                      <div className="text-xs">{user?.workplace_address}</div>
                    </Popup>
                  </Marker>
                  <Circle center={workplacePos} radius={3000} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />
                  {properties.map(p => (
                    <Marker key={p.id} position={[p.lat, p.lng]}>
                      <Popup>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-primary font-bold">₹{p.rent}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                
                {/* Heatmap Legend */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl z-[1000] border border-outline-variant/20">
                  <p className="text-[10px] font-bold font-label mb-2 uppercase tracking-wider">Commute Reach</p>
                  <div className="h-2 w-48 bg-gradient-to-r from-blue-500 via-green-400 to-yellow-500 rounded-full"></div>
                  <div className="flex justify-between mt-1 text-[10px] font-bold text-outline">
                    <span>FAST</span>
                    <span>LIMIT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Property Sidebar */}
            <div className="xl:col-span-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold font-headline">Smart Matches</h3>
                <button className="text-xs font-bold text-primary flex items-center gap-1" onClick={() => navigate('/properties')}>
                  View All <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
              <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2 scrollbar-hide">
                {loading ? (
                  <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                ) : properties.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl p-4 transition-all hover:shadow-md cursor-pointer group border border-slate-100" onClick={() => navigate('/properties')}>
                    <div className="relative rounded-lg overflow-hidden mb-4 h-40">
                      <img alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-white/80 backdrop-blur-md border-l-2 border-orange-500">
                        <span className="text-xs font-black text-on-surface">{(p.commute_score || 8.5).toFixed(1)}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-lg font-headline line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-secondary mb-3">{p.locality || 'Nagpur, MH'}</p>
                    <div className="flex items-center justify-between mt-4 py-3 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">directions_car</span>
                        <span className="text-sm font-bold">15 min</span>
                      </div>
                      <p className="text-lg font-extrabold text-blue-900">
                        ₹{(p.rent/1000).toFixed(1)}k<span className="text-[10px] text-secondary font-medium uppercase tracking-tighter ml-1">/mo</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recently Viewed */}
          <section className="space-y-4">
            <h3 className="text-2xl font-extrabold font-headline">Recently Viewed Heritage</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {properties.map((p) => (
                <div key={p.id} className="flex-none w-80 bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                  <div className="flex gap-4">
                    <img alt={p.name} className="w-24 h-24 rounded-lg object-cover" src={p.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} />
                    <div className="flex flex-col justify-between py-1">
                      <div className="max-w-[170px]">
                        <h5 className="font-bold text-sm truncate">{p.name}</h5>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">{p.locality}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Compare</button>
                        <button className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest hover:bg-slate-200 transition-all">Quick View</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 mt-auto border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto w-full gap-4">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-body">
            © 2024 SahiRasta - The Guided Heritage. All rights reserved.
          </span>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Help Center', 'Contact Support'].map((link) => (
              <a key={link} className="text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 underline underline-offset-4" href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
