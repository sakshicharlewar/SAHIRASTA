import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const navLinks = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'directions_transit', label: 'Commute Setup', path: '/commute-setup' },
  { icon: 'search_check', label: 'Saved Searches', path: '/saved-homes' },
  { icon: 'trending_up', label: 'Market Trends', path: '/commute-insights' },
  { icon: 'person_outline', label: 'Account', path: '/account', active: true },
];

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, updateWorkplace, logout } = useAuth();
  const [workplace, setWorkplace] = useState({
    lat: user?.workplace_lat || 21.1458,
    lng: user?.workplace_lng || 79.0882,
    address: user?.workplace_address || ''
  });
  const [saveStatus, setSaveStatus] = useState('');

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setWorkplace(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
      },
    });
    return workplace.lat ? <Marker position={[workplace.lat, workplace.lng]} /> : null;
  };

  const handleSaveProfile = async () => {
    setSaveStatus('Saving...');
    const result = await updateWorkplace({
      workplace_lat: workplace.lat,
      workplace_lng: workplace.lng,
      workplace_address: workplace.address
    });
    if (result.success) {
      setSaveStatus('Saved Successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('Failed to save.');
    }
  };
  return (
    <div className="bg-surface text-on-surface font-body">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-full mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black text-blue-700 tracking-tight font-headline cursor-pointer" onClick={() => navigate('/dashboard')}>SahiRasta</span>
            <nav className="hidden md:flex gap-6 items-center">
              {[['Properties', '/properties'], ['Map View', '/map-view'], ['Saved Homes', '/saved-homes'], ['Insights', '/commute-insights']].map(([label, path]) => (
                <a key={label} className="text-slate-600 font-medium hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(path)}>{label}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-50"><span className="material-symbols-outlined text-on-surface-variant">notifications</span></button>
            <button className="p-2 rounded-full hover:bg-slate-50" onClick={logout} title="Sign Out">
              <span className="material-symbols-outlined text-on-surface-variant">logout</span>
            </button>
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm font-bold text-on-surface-variant hidden md:block">{user?.name}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20">
                <img alt="User" src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-4 gap-2 bg-slate-50 w-64">
          <div className="px-4 py-6 mb-4">
            <h2 className="text-xl font-bold text-blue-700">SahiRasta</h2>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">The Guided Heritage</p>
          </div>
          <div className="flex flex-col gap-1 flex-grow">
            {navLinks.map(({ icon, label, path, active }) => (
              <a key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white text-blue-700 shadow-sm font-semibold translate-x-1' : 'text-slate-500 hover:text-blue-600'}`} onClick={() => navigate(path)}>
                <span className="material-symbols-outlined">{icon}</span>
                <span className="font-medium">{label}</span>
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 pt-4">
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-blue-600 rounded-xl cursor-pointer"><span className="material-symbols-outlined">help_outline</span><span className="font-medium">Help Center</span></a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-blue-600 rounded-xl cursor-pointer" onClick={logout}><span className="material-symbols-outlined">logout</span><span className="font-medium">Sign Out</span></a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow p-6 lg:p-12 max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">Account Settings</h1>
            <p className="text-secondary font-medium">Manage your heritage journey and commute preferences.</p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-8">
              {/* Personal Info */}
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_40px_rgba(25,28,29,0.04)]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2 font-headline">
                    <span className="material-symbols-outlined text-primary">person</span>Personal Information
                  </h3>
                  <button className="text-sm font-bold text-tertiary uppercase tracking-wider hover:opacity-80">Edit Profile</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-outline uppercase tracking-[0.05em]">Full Name</label>
                    <div className="bg-surface-container-high rounded-lg px-4 py-3 text-on-surface font-medium">{user?.name}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-outline uppercase tracking-[0.05em]">Email Address</label>
                    <div className="bg-surface-container-high rounded-lg px-4 py-3 text-on-surface font-medium">{user?.email}</div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-[0.05em]">Primary Workplace / Office Address</label>
                    <input 
                      type="text"
                      className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-on-surface font-medium border-none focus:ring-1 focus:ring-primary"
                      value={workplace.address}
                      onChange={(e) => setWorkplace({ ...workplace, address: e.target.value })}
                      placeholder="Enter your workplace address"
                    />
                  </div>
                  
                  {/* Workplace Map Picker */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-[0.05em]">Pin Workplace Location (Used for Commute Scores)</label>
                    <div className="h-[250px] w-full rounded-xl overflow-hidden border border-outline-variant/20 shadow-inner">
                      <MapContainer center={[workplace.lat, workplace.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker />
                      </MapContainer>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-[0.65rem] text-outline font-bold uppercase">Lat: {workplace.lat.toFixed(4)}, Lng: {workplace.lng.toFixed(4)}</p>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={saveStatus === 'Saving...'}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2"
                      >
                        {saveStatus === 'Saving...' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {saveStatus || 'Save Workplace Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Family */}
              <section className="bg-surface-container-low rounded-xl p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-1 font-headline">Family Commute Circle</h3>
                  <p className="text-secondary text-sm">Manage family members linked to your heritage commute profile.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Priya Varma', role: 'Spouse • Daily Metro', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABt-rnUAYDVsF5Tp8aCd0miXTjuHrFfc8naxvaSbWq12kBSawISXNBnyHaXSJBg-i5EdVF2FksGBm10GeRNDhxjLbpqcRKcXlUbVhqAn9RMyn3rXlcgZsmrhAm3dAnda7pZDBG8ngVL65G1MGsYoeqL_Y4RceKj2bZ72qY1nazyao01nLoWUetCsOtC2nGkyhIeb5biPYLgqj3UZecXNr9edLobsjus1NHHf_BVUpN2Cr6u6KrtPAXnxOacPVvOPG9bOzXsd9J4Gvv' },
                    { name: 'Karan Varma', role: 'Son • School Bus', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwcOkngtWE0dbjkr3bvuQ1rX0nc8FL2M3xH0IThqzo18fZc_FnYHrKxDvUr9mhiW3x2yvpkJaIWLlQRy3z67H6KfuBn4PUyqYR11Cl29LLGtaCvrkQLnfa51gdsWcsdxXWID28cLNVBA_OPdyOOoq6HwPDkeEm84u2kBSXP092dveLLMWsDZy2HNx-8p2wWRKp3PvL56MBMCF7Tpim3QbQPz4RgjFmTDhQVma1duOCJgxZtPNEEbOvGo96G6wBc52sxAwxSnT9z5z8' },
                  ].map(({ name, role, img }) => (
                    <div key={name} className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-sm" style={{ borderLeft: '2px solid #8e4d00' }}>
                      <img alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" src={img} />
                      <div className="flex-grow">
                        <h4 className="font-bold text-on-surface">{name}</h4>
                        <p className="text-[0.7rem] text-outline font-bold uppercase tracking-wider">{role}</p>
                      </div>
                      <button className="text-outline-variant hover:text-error transition-colors"><span className="material-symbols-outlined">do_not_disturb_on</span></button>
                    </div>
                  ))}
                  <button className="bg-surface-container-high border-2 border-dashed border-outline-variant/30 rounded-xl p-4 flex items-center justify-center gap-2 text-outline font-bold hover:bg-surface-container-highest transition-all group">
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person_add</span>Add Family Member
                  </button>
                </div>
              </section>

              {/* Security */}
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-8 font-headline">Security &amp; Privacy</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-fixed text-on-primary-fixed-variant p-2 rounded-lg"><span className="material-symbols-outlined">lock_reset</span></div>
                      <div><p className="font-bold">Password</p><p className="text-sm text-secondary">Last updated 3 months ago</p></div>
                    </div>
                    <button className="text-sm font-bold text-primary hover:underline">Change</button>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant p-2 rounded-lg"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span></div>
                      <div><p className="font-bold">Two-Factor Authentication</p><p className="text-sm text-secondary">Active via SMS and Authenticator app</p></div>
                    </div>
                    <button className="text-sm font-bold text-error">Disable</button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Plan */}
              <div className="bg-primary text-white rounded-xl p-8 overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] opacity-80 mb-4">Current Plan</h3>
                  <div className="flex items-baseline gap-2 mb-2"><span className="text-4xl font-black font-headline">Heritage Gold</span></div>
                  <p className="text-sm opacity-90 mb-6">Unlimited listings, real-time commute AI, and priority site visits.</p>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-8">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2"><span>Renewal Date</span><span>Oct 12, 2024</span></div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white w-3/4"></div></div>
                  </div>
                  <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">Manage Subscription</button>
                </div>
                <div className="absolute -bottom-8 -right-8 opacity-10"><span className="material-symbols-outlined text-[12rem]">potted_plant</span></div>
              </div>

              {/* Notifications */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 font-headline">Notifications</h3>
                <div className="space-y-6">
                  {[['New Listing Alerts', true], ['Commute Updates', true], ['Market Insights', false]].map(([label, checked]) => (
                    <label key={label} className="flex items-center justify-between cursor-pointer group">
                      <span className="font-medium text-on-surface group-hover:text-primary transition-colors">{label}</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked={checked} className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-surface-container-low rounded-xl p-6 border-l-4 border-tertiary">
                <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-tertiary">support_agent</span><span className="font-bold text-on-surface">Concierge Support</span></div>
                <p className="text-sm text-secondary mb-4">Need help with your heritage commute profile? Our specialists are available 24/7.</p>
                <a className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">Start a chat <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
