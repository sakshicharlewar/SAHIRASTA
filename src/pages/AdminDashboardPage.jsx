import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgRent: 0, highestScore: 0 });
  const [backendStatus, setBackendStatus] = useState('Checking...');

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        calculateStats(data);
        setBackendStatus('Healthy');
      } else {
        setBackendStatus('Error');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setBackendStatus('Offline');
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) return;
    const total = data.length;
    const avgRent = Math.round(data.reduce((acc, curr) => acc + curr.rent, 0) / total);
    const highestScore = Math.max(...data.map(p => p.commute_score || 0));
    setStats({ total, avgRent, highestScore });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
        calculateStats(properties.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-headline tracking-tight">SahiRasta Admin</h1>
            <p className="text-slate-500">Database & Backend Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
              backendStatus === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'Healthy' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              Backend: {backendStatus}
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Total Listings</span>
            <span className="text-4xl font-black text-blue-700 font-headline">{stats.total}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Avg. Rent</span>
            <span className="text-4xl font-black text-slate-900 font-headline">₹{stats.avgRent.toLocaleString()}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Highest Commute Score</span>
            <span className="text-4xl font-black text-orange-500 font-headline">{stats.highestScore}%</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800">Property Listings</h2>
            <button 
              onClick={fetchProperties}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="Refresh Data"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name & Location</th>
                  <th className="px-6 py-4">Rent</th>
                  <th className="px-6 py-4">Commute Score</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading properties...</td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No properties found.</td>
                  </tr>
                ) : properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{prop.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{prop.name}</div>
                      <div className="text-xs text-slate-400">{prop.city}, {prop.state}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">₹{prop.rent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              prop.commute_score >= 80 ? 'bg-emerald-500' : 
                              prop.commute_score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${prop.commute_score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{prop.commute_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Property"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
