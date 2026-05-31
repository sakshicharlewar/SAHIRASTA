import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Heatmap component
const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !points) return;
    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'rgba(0,0,255,0.7)', 0.6: 'rgba(0,255,0,0.7)', 1: 'rgba(255,0,0,0.8)' }
    }).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, points]);
  return null;
};

const MapViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showTraffic, setShowTraffic] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const comparisonList = location.state?.comparison || [];
  const isComparisonMode = comparisonList.length > 0;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const trafficPoints = properties.map(p => [p.lat, p.lng, 0.8]);

  const displayedProperties = isComparisonMode ? properties.filter(p => comparisonList.some(c => c.id === p.id)) : properties;

  return (
    <div className="bg-surface text-on-surface font-body h-screen flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm z-50 flex justify-between items-center w-full px-6 py-3 shrink-0">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-blue-700 tracking-tight font-headline cursor-pointer" onClick={() => navigate('/dashboard')}>SahiRasta</span>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/properties')}>Properties</a>
            <a className="text-blue-700 font-bold border-b-2 border-orange-500 pb-1">Map View</a>
            <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/saved-homes')}>Saved Homes</a>
            <a className="text-slate-600 font-medium hover:text-blue-600 cursor-pointer" onClick={() => navigate('/commute-insights')}>Insights</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isComparisonMode && (
            <button 
              onClick={() => navigate('/map-view', { state: {} })}
              className="bg-error text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Clear Comparison
            </button>
          )}
          <button className="p-2 rounded-full hover:bg-slate-50"><span className="material-symbols-outlined">notifications</span></button>
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
      </header>

      <main className="relative flex-grow w-full overflow-hidden bg-surface-container">
        {/* Real Leaflet Map */}
        <div className="absolute inset-0 z-0">
          <MapContainer center={[21.1458, 79.0882]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {showTraffic && <HeatmapLayer points={trafficPoints} />}

            {displayedProperties.map((prop) => (
              <React.Fragment key={prop.id}>
                <Marker 
                  position={[prop.lat, prop.lng]}
                  icon={L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="bg-white text-on-surface font-headline font-bold px-3 py-1.5 rounded-full shadow-md border border-outline-variant/30 transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform ${isComparisonMode ? 'border-2 border-primary' : ''}">₹${(prop.rent/1000).toFixed(1)}k</div>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                  })}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold">{prop.name}</h3>
                      <p className="text-primary font-bold">₹{prop.rent.toLocaleString()}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Commute Analysis</span>
                        <div className="flex justify-between items-center text-xs">
                          <span>Driving Time:</span>
                          <span className="font-bold text-orange-600">18 min</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Commute Score:</span>
                          <span className="font-bold text-blue-700">8.8/10</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                {isComparisonMode && user?.workplace_lat && (
                  <Polyline 
                    positions={[[user.workplace_lat, user.workplace_lng], [prop.lat, prop.lng]]} 
                    pathOptions={{ color: 'blue', weight: 3, dashArray: '10, 10', opacity: 0.5 }} 
                  />
                )}
              </React.Fragment>
            ))}

            {/* Workplace Pin */}
            {(user?.workplace_lat && user?.workplace_lng) && (
              <Marker 
                position={[user.workplace_lat, user.workplace_lng]}
                icon={L.divIcon({
                  className: 'workplace-icon',
                  html: `<div class="bg-primary text-white p-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                          <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">work</span>
                        </div>`,
                  iconSize: [0, 0],
                  iconAnchor: [0, 0]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold">Your Workplace</h4>
                    <p className="text-xs text-secondary">{user.workplace_address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Comparison Summary Panel */}
        {isComparisonMode && (
          <div className="absolute top-6 left-6 z-[1000] w-80 flex flex-col gap-4">
            <div className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
              <h3 className="text-xl font-headline font-black text-blue-800 mb-4">Comparison Focus</h3>
              <div className="space-y-4">
                {displayedProperties.map(p => (
                  <div key={p.id} className="flex flex-col gap-1 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:bg-white transition-all cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h4>
                      <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">₹{(p.rent/1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-secondary">
                        <span className="material-symbols-outlined text-xs">directions_car</span>
                        18 min
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700">
                        <span className="material-symbols-outlined text-xs">award_star</span>
                        Score: 8.8
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={() => navigate('/commute-insights')}
              >
                Deep Comparison Report
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        {!isComparisonMode && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-4">
            <div className="rounded-xl shadow-lg p-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
              <div className="flex-1 flex items-center bg-surface-container-high rounded-lg px-4 py-2">
                <span className="material-symbols-outlined text-secondary mr-2">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-on-surface w-full placeholder:text-secondary/60 text-sm" placeholder="Search locality, workplace, or property..." type="text" />
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-container transition-all">
                <span className="material-symbols-outlined">tune</span>Filters
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-10 left-6 z-[1000] flex flex-col gap-4">
          <div className="p-4 rounded-xl shadow-md border-l-4 border-primary" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
            <h4 className="font-headline text-sm font-bold mb-3 uppercase tracking-wider">Map Context</h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs font-label uppercase tracking-wider text-secondary">Properties</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-primary" style={{ border: '2px solid white' }}></div>
              <span className="text-xs font-label uppercase tracking-wider text-secondary">Your Workplace</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute right-6 bottom-10 z-[1000] flex flex-col gap-2">
          {!isComparisonMode && (
            <button 
              className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-md transition-all ${showTraffic ? 'bg-primary text-white' : 'bg-white/85 text-secondary'}`}
              onClick={() => setShowTraffic(!showTraffic)}
              title="Toggle Traffic Heatmap"
            >
              <span className="material-symbols-outlined">traffic</span>
            </button>
          )}
          <button className="w-12 h-12 flex items-center justify-center rounded-xl shadow-md bg-white/85 text-secondary hover:bg-white" style={{ backdropFilter: 'blur(12px)' }}>
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        {/* Sidebar Nav */}
        <div className="absolute left-6 top-6 z-[999]">
          {!isComparisonMode && (
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl flex flex-col gap-1 w-16 items-center">
              {[
                ['dashboard', '/dashboard', false],
                ['public', '/map-view', true],
                ['favorite', '/saved-homes', false],
                ['insights', '/commute-insights', false]
              ].map(([icon, path, active]) => (
                <div 
                  key={path} 
                  className={`w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-all ${active ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-white/80'}`}
                  onClick={() => navigate(path)}
                >
                  <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MapViewPage;
