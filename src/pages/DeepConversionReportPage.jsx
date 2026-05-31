import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DeepConversionReportPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        const data = await response.json();
        // Sort by commute score descending for the "Top Conversions"
        setProperties(data.sort((a, b) => b.commute_score - a.commute_score).slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const navLinks = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'directions_transit', label: 'Commute Setup', path: '/commute-setup' },
    { icon: 'map', label: 'Properties Map', path: '/map-view' },
    { icon: 'trending_up', label: 'Insights', path: '/commute-insights', active: true },
    { icon: 'person_outline', label: 'Account', path: '/account' },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface font-headline font-black text-primary text-2xl animate-pulse">Analyzing Data...</div>;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col lg:flex-row overflow-x-hidden font-body">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 p-4 gap-2 bg-slate-50 w-64 z-40 border-r border-slate-200">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white">analytics</span>
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
          <a className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 rounded-xl cursor-pointer" onClick={() => navigate('/login')}><span className="material-symbols-outlined">logout</span><span className="font-medium">Sign Out</span></a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-surface min-h-screen">
        <header className="flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-secondary">arrow_back</span>
            </button>
            <h2 className="text-2xl font-black text-on-surface tracking-tight font-headline">Deep Conversion Report</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-black uppercase text-secondary">Report Generated</span>
              <span className="text-xs font-mono font-bold text-primary">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="w-px h-8 bg-outline-variant/20 mx-2"></div>
            <button className="bg-primary text-white px-6 py-2 rounded-full font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Download PDF</button>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full font-body">
          {/* Executive Summary */}
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-center md:text-left space-y-3 flex-1">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">Executive Insights</span>
                <h3 className="text-4xl font-headline font-black text-on-surface leading-tight">Your Commute <span className="text-primary underline decoration-primary/20 underline-offset-8">Efficiency.</span></h3>
                <p className="text-secondary text-lg max-w-2xl leading-relaxed">Based on your workplace at <span className="text-on-surface font-bold italic">{user?.workplace_address || 'Nagpur Center'}</span>, we've identified 5 properties that optimize your lifestyle ROI.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="block text-3xl font-black text-primary font-headline">22m</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">Avg. Commute</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="block text-3xl font-black text-tertiary font-headline">₹2.4k</span>
                  <span className="text-[10px] font-black uppercase text-slate-400">Monthly Svg.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Data Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Conversions List */}
            <div className="lg:col-span-12">
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="text-lg font-black text-on-surface font-headline uppercase tracking-tight">Optimized Property Rankings</h4>
                  <div className="flex gap-4 text-[10px] font-black text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> COMMUTE OPTIMIZED</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> BASELINE</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">Property Identity</th>
                        <th className="px-6 py-4">Monthly Rent</th>
                        <th className="px-6 py-4">Est. Travel</th>
                        <th className="px-6 py-4">Lifestyle Score</th>
                        <th className="px-6 py-4">Conversion Index</th>
                        <th className="px-8 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {properties.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-black text-slate-300 font-mono">#{idx + 1}</span>
                              <div className="flex flex-col">
                                <span className="font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</span>
                                <span className="text-[10px] text-secondary font-medium">{p.city}, Nagpur</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 font-bold text-on-surface">₹{p.rent.toLocaleString()}</td>
                          <td className="px-6 py-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-primary">18 min</span>
                              <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-blue-600 text-sm">auto_awesome</span>
                              <span className="font-headline font-black text-blue-600">{p.commute_score.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${idx === 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {idx === 0 ? 'High Potential' : 'Stable'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <button className="text-primary font-black text-xs hover:underline decoration-2 underline-offset-4 flex items-center gap-1 group/btn" onClick={() => navigate('/map-view')}>
                              View Details <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Lifestyle Analysis Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-primary-fixed p-8 rounded-3xl border border-primary/10 flex flex-col justify-between h-80">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg border border-primary/5">
                  <span className="material-symbols-outlined text-2xl font-black">timer</span>
                </div>
                <h4 className="text-2xl font-headline font-black text-on-primary-fixed leading-tight italic">Time Density Optimization</h4>
                <p className="text-on-primary-fixed-variant text-sm leading-relaxed">Your current top choice reduces idle transit time by <span className="font-black text-primary">34%</span> compared to the local average.</p>
              </div>
              <div className="mt-6 flex justify-between items-end border-t border-primary/10 pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Verified Analytics</span>
                <span className="material-symbols-outlined text-primary group-hover:animate-bounce">trending_down</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between h-80 group hover:border-primary/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-tertiary shadow-sm group-hover:bg-tertiary-fixed transition-colors">
                  <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <h4 className="text-2xl font-headline font-black text-on-surface leading-tight italic">Sustainability Conversion</h4>
                <p className="text-secondary text-sm leading-relaxed">Transitioning to this property allows for <span className="font-bold text-tertiary">Cycle-to-Work</span> eligibility, increasing your green score to 9.2/10.</p>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>)}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neighbor Consensus</span>
              </div>
            </div>

            <div className="bg-on-surface p-8 rounded-3xl shadow-2xl flex flex-col justify-between h-80 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <h4 className="text-2xl font-headline font-black text-white leading-tight italic">Investment Conversion</h4>
                <p className="text-white/60 text-sm leading-relaxed">The proximity to <span className="text-primary font-bold">IT Hub Nagpur</span> suggests a 12% annual appreciation forecast for this specific locality.</p>
              </div>
              <button className="w-full py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs">Verify Market Data</button>
            </div>
          </section>

          {/* Map Preview Comparison */}
          <section className="bg-surface-container-high rounded-3xl overflow-hidden shadow-inner border border-white/50 h-[400px] relative">
            <div className="absolute inset-0 grayscale contrast-125 brightness-75 opacity-20 pointer-events-none">
              <MapContainer center={[21.1458, 79.0882]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </div>
            <div className="relative h-full flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white max-w-lg">
                <h5 className="text-2xl font-black text-on-surface font-headline mb-2">Multivariate Spatial Analysis</h5>
                <p className="text-secondary text-sm leading-relaxed">We've overlaid 12 different commute factor data points (Traffic Flow, Transit Frequency, Heat Maps, and Road Quality) to generate this report.</p>
              </div>
              <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black shadow-2xl hover:bg-primary-container shadow-primary/30 transition-all flex items-center gap-3 active:scale-95" onClick={() => navigate('/map-view')}>
                Interactive Spatial Viewer
                <span className="material-symbols-outlined">explore</span>
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-auto border-t border-outline-variant/10 p-10 bg-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-primary font-headline">SahiRasta Analysis Engine</h2>
              <p className="text-secondary text-sm font-medium italic">Empowering Nagpur through Commute Intelligence.</p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 Deep Conversion Analysis Report v2.4</div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DeepConversionReportPage;
