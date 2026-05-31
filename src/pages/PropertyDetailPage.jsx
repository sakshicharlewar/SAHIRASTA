import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalRent, setProposalRent] = useState('');
  const [proposalMsg, setProposalMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success', 'error'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await fetch(`${API_BASE_URL}/api/properties/${id}`);
        const histRes = await fetch(`${API_BASE_URL}/api/properties/${id}/history`);
        
        const propData = await propRes.json();
        
        if (propData.error) {
          setProperty(null);
        } else {
          const histData = await histRes.json();
          setProperty(propData);
          setHistory(Array.isArray(histData) ? histData : []);
          setProposalRent(propData.rent);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProperty(null);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: id,
          user_id: user.id,
          offered_rent: proposalRent,
          message: proposalMsg
        })
      });

      if (response.ok) {
        setBookingStatus('success');
      } else {
        setBookingStatus('error');
      }
    } catch (error) {
      setBookingStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface text-primary font-black text-2xl animate-pulse">Loading Estate Details...</div>;
  if (!property || property.error) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <span className="material-symbols-outlined text-8xl text-slate-200">error</span>
      <h2 className="text-2xl font-black text-secondary">Property not found</h2>
      <button onClick={() => navigate('/properties')} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Back to Properties</button>
    </div>
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body select-none">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-xs font-bold uppercase tracking-widest">Back to Properties</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight leading-tight">{property.name}</h1>
            <div className="flex items-center gap-4 text-secondary font-medium italic">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {property.city}, Nagpur</span>
              <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">home</span> {property.bedrooms} BHK</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 bg-primary-fixed p-6 rounded-3xl shadow-xl shadow-primary/5 min-w-[200px]">
            <span className="text-[10px] uppercase font-black tracking-widest text-primary/60">Asking Rent</span>
            <div className="text-4xl font-headline font-black text-primary">₹{property?.rent?.toLocaleString()}</div>
            <span className="text-xs font-bold text-slate-500 italic">Maintenance incl.</span>
          </div>
        </section>

        {/* Gallery Placeholder */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
           <div className="md:col-span-2 rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
             <img alt="Interior" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" />
           </div>
           <div className="hidden md:flex flex-col gap-4">
             <div className="flex-1 rounded-3xl overflow-hidden border-2 border-white shadow-lg"><img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" /></div>
             <div className="flex-1 rounded-3xl overflow-hidden border-2 border-white shadow-lg"><img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" /></div>
           </div>
           <div className="hidden md:block rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative group">
             <img className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all" src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" />
             <div className="absolute inset-0 flex items-center justify-center p-4">
                <button className="bg-white/90 backdrop-blur text-primary font-black px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest">View All 12 Photos</button>
             </div>
           </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-headline font-black uppercase tracking-tight text-on-surface">Property Essence</h3>
              <p className="text-secondary leading-relaxed text-lg max-w-3xl italic">
                Experience luxury living in the heart of {property.city}. This meticulously designed {property.bedrooms} BHK apartment offers a seamless blend of heritage aesthetics and modern convenience, boasting {property.sqft} sqft of meticulously optimized space.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                 {[['square_foot', property.sqft + ' sqft'], ['bed', property.bedrooms + ' Bedrooms'], ['shower', property.bathrooms + ' Bathrooms'], ['event', 'Available Now']].map(([icon, label]) => (
                   <div key={label} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center text-center">
                     <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                     <span className="text-xs font-black uppercase tracking-tighter text-slate-600">{label}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Commute Insights Card */}
            <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-8xl">commute</span>
               </div>
               <h3 className="text-2xl font-headline font-black mb-6">Commute Analysis</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-6">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                         <span className="text-2xl font-black font-headline">{property.commute_score.toFixed(1)}</span>
                       </div>
                       <div>
                         <h4 className="font-black text-lg">Spatial ROI Score</h4>
                         <p className="text-xs text-secondary font-medium">92nd percentile for this locality</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm font-bold"><span>Traffic Load</span><span className="text-orange-600">Moderate</span></div>
                       <div className="h-2 bg-white rounded-full overflow-hidden border border-outline-variant/10">
                         <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white/50 backdrop-blur rounded-3xl p-6 border border-white space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peak Travel Estimation</h5>
                    {[['directions_car', 'Driving', '22m'], ['directions_bus', 'Transit', '35m'], ['directions_bike', 'Cycling', '18m']].map(([icon, label, time]) => (
                      <div key={label} className="flex items-center justify-between group/icon">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-400 group-hover/icon:text-primary transition-colors">{icon}</span>
                          <span className="text-sm font-bold text-slate-600 uppercase tracking-tighter">{label}</span>
                        </div>
                        <span className="text-sm font-black text-primary">{time}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* Rental History / Past Tenants */}
            <div className="space-y-6">
              <h3 className="text-2xl font-headline font-black uppercase tracking-tight text-on-surface">Community Verification</h3>
              {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {history.map((h) => (
                    <div key={h.id} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-4 transition-all hover:border-primary/20 hover:-translate-y-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                             <span className="material-symbols-outlined text-secondary">person</span>
                           </div>
                           <div>
                             <h4 className="font-black text-sm">{h.tenant_name}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.stay_duration} Stay</p>
                           </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => <span key={i} className={`material-symbols-outlined text-xs ${i <= h.rating ? 'text-orange-400' : 'text-slate-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                        </div>
                      </div>
                      <p className="text-sm text-secondary leading-relaxed italic">"{h.feedback}"</p>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                        <span className="material-symbols-outlined text-xs text-slate-300">call</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{h.tenant_contact.replace(/\d(?=\d{4})/g, "*")}</span>
                        <button className="ml-auto text-primary font-black text-[10px] uppercase tracking-widest hover:underline">Request contact</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center text-slate-400 italic">
                  No verified historical data available for this property yet.
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4 sticky top-28 self-start">
            <div className="bg-on-surface p-8 rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden">
               {bookingStatus === 'success' ? (
                 <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in">
                   <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                     <span className="material-symbols-outlined text-white text-4xl font-black">check</span>
                   </div>
                   <h3 className="text-2xl font-headline font-black text-white">Proposal Sent!</h3>
                   <p className="text-white/60 text-sm leading-relaxed">Your offer of <span className="text-white font-bold">₹{proposalRent.toLocaleString()}</span> has been dispatched to the owner. They correspond within 24 hours.</p>

                   {history.length > 0 && (
                     <div className="mt-8 text-left bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                       <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">Verified Past Tenants</h4>
                       <div className="space-y-4">
                         {history.map(h => (
                           <div key={h.id} className="flex justify-between items-center group">
                             <div>
                               <p className="text-white font-bold text-sm">{h.tenant_name}</p>
                               <div className="flex text-orange-400 text-[10px] mt-1">
                                 {[1,2,3,4,5].map(i => <span key={i} className={`material-symbols-outlined ${i <= h.rating ? 'text-orange-400' : 'text-white/20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                               </div>
                             </div>
                             <a href={`tel:${h.tenant_contact}`} className="bg-primary/20 text-primary w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary hover:text-white transition-all">
                               <span className="material-symbols-outlined text-sm">call</span>
                             </a>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   <button onClick={() => setBookingStatus(null)} className="w-full py-4 mt-6 bg-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">Make Another Offer</button>
                 </div>
               ) : (
                 <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-black text-white leading-tight underline decoration-primary decoration-4 underline-offset-8 italic">Seal the Deal.</h3>
                    <p className="text-white/50 text-xs font-medium">Propose a fair rent and secure your new home.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary">Your Proposal (Monthly)</label>
                       <div className="relative">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-xl">₹</span>
                         <input 
                            type="number" 
                            value={proposalRent}
                            onChange={(e) => setProposalRent(e.target.value)}
                            className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 pl-12 pr-6 text-white text-3xl font-headline font-black focus:border-primary focus:ring-0 transition-all placeholder:text-white/10" 
                            placeholder={property.rent}
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Personal Message to Owner</label>
                       <textarea 
                          value={proposalMsg}
                          onChange={(e) => setProposalMsg(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm focus:border-primary focus:ring-0 min-h-[120px] transition-all resize-none italic" 
                          placeholder="Include mentions of your tenure, lifestyle, or any specific requests..."
                       />
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                       <div className="flex justify-between items-center text-xs">
                         <span className="text-white/60 font-medium">Platform Service Fee</span>
                         <span className="text-white font-black">₹0 (Launch Offer)</span>
                       </div>
                       <div className="h-px bg-white/10"></div>
                       <div className="flex justify-between items-center">
                         <span className="text-white/60 font-bold text-sm">Target Move-in</span>
                         <span className="text-primary font-black text-sm uppercase tracking-tighter">Asap</span>
                       </div>
                    </div>

                    <button 
                      onClick={handleBookNow}
                      disabled={submitting}
                      className="w-full py-6 bg-primary text-white rounded-[32px] font-black shadow-2xl shadow-primary/30 hover:bg-primary-container hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 group"
                    >
                      {submitting ? 'Processing...' : 'Secure Early Booking'}
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
                    </button>
                    
                    <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest">Powered by SahiRasta TrustEngine™</p>
                  </div>
                 </>
               )}
            </div>

            <div className="mt-6 flex items-center gap-4 px-8">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-on-surface bg-slate-800"></div>)}
               </div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-tight">12 other users analyzed <br />this property today</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
