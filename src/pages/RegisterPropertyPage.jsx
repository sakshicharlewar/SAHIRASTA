import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

const RegisterPropertyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    mobile: '',
    email: '',
    propType: 'Apartment',
    furnishing: 'Unfurnished',
    address: '',
    pincode: '',
    lat: '',
    lng: '',
    rent: '',
    deposit: '',
    availableFrom: '',
    bhk: '2',
    sqft: '',
    bathrooms: '2',
    balconies: '1',
    amenities: ['High-speed WiFi', 'Parking'],
    landmark: '',
    station: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create properties payload for the API
      const payload = {
        name: formData.name || `Premium ${formData.propType} in Nagpur`,
        rent: parseFloat(formData.rent),
        lat: parseFloat(formData.lat || 21.1458),
        lng: parseFloat(formData.lng || 79.0882),
        bedrooms: parseInt(formData.bhk),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        amenities: formData.amenities,
        available_from: formData.availableFrom || new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/map-view'), 2000);
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || 'Failed to register property'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body bg-surface text-on-surface">
      {/* TopNavBar Shell */}
      <header className="bg-slate-50 dark:bg-slate-900 full-width top-0 sticky z-50">
        <nav className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div 
            className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-400 font-headline cursor-pointer"
            onClick={() => navigate('/')}
          >
            SahiRasta
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200" href="/">Home</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200" href="/properties">Search Homes</a>
            <a className="text-blue-700 dark:text-blue-400 font-bold border-b-2 border-orange-600" href="#">Register Your Property</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200" href="#">About / How It Works</a>
            <a className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200" href="#">Contact / Support</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 font-medium hover:text-primary transition-all">Language</button>
            <button 
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-95 duration-150 ease-in-out"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-jali pb-20">
        {/* Success Modal */}
        {success && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 animate-in fade-in zoom-in duration-300">
              <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">check_circle</span>
              <h2 className="text-2xl font-headline font-bold mb-2">Registration Successful!</h2>
              <p className="text-secondary">Your property is now live. Redirecting to map view...</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto pt-16 px-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-wider text-tertiary font-bold">List Your Asset</span>
              <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-on-surface leading-tight">
                Turn your <span className="text-primary">Heritage</span> into a <span className="text-tertiary">Legacy</span>.
              </h1>
              <p className="text-lg text-on-surface-variant max-w-lg">
                Reach thousands of verified tenants in Nagpur with our premium property management and listing service. Professional, transparent, and guided.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-surface-container-low">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Modern luxury apartment interior" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIGxjS0oa-Ymf42ZAE_5dCbS6oRpk3TK9JQQT7pHK9iBswMHYzlN5_Gff1ym8IzBJGzivU2QkCJ0Uvr75CL-RRPD-aZfXkJ-uC4QdK1j7OmcrxFR1xDEJ5zy_19rtMjNsx9zNgJEQbRdeOocGWQm3pJsSFINLLeKYNyrMax6oZLcE0Mj1plc-lsbADVN2_KEmis5dyL4ZVyaI6Iq4XBaXKeL2w013d4xCew3ZPCFi-V1BnvCf29bHQLVIT_ChdFqb_Pz21agbUHukr"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 commute-badge p-6 rounded-xl shadow-xl flex items-center gap-4">
                <div className="text-center">
                  <span className="block text-3xl font-headline font-bold text-primary">9.8</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Visibility Score</span>
                </div>
                <div className="w-[1px] h-12 bg-outline-variant opacity-20"></div>
                <p className="text-sm font-medium leading-tight"> नागपुर (Nagpur) properties<br/>get viewed 2x faster.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Section Form */}
        <form className="max-w-5xl mx-auto px-8" onSubmit={handleSubmit}>
          <div className="space-y-12">
            {/* 0. Property Headline */}
            <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm border-b-4 border-primary">
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">home_work</span>
                <h2 className="text-2xl font-headline font-bold">Property Headline</h2>
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Listing Name / Title</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none font-bold text-lg" 
                  placeholder="e.g. Modern 2BHK in Dharampeth with Lake View" 
                  type="text" 
                  required
                />
              </div>
            </div>

            {/* 1. Owner Information */}
            <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-tertiary text-3xl">person</span>
                <h2 className="text-2xl font-headline font-bold">Owner Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Full Name</label>
                  <input 
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                    placeholder="Enter your full name" 
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Mobile Number</label>
                  <input 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                    placeholder="+91 00000 00000" 
                    type="tel"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                    placeholder="name@example.com" 
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Location Context</label>
                  <input className="w-full bg-surface-container border-none rounded-lg p-4 text-on-surface-variant font-medium cursor-not-allowed" disabled type="text" defaultValue="Nagpur, Maharashtra, India"/>
                </div>
              </div>
            </div>

            {/* 2. Property Address & Location */}
            <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-tertiary text-3xl">location_on</span>
                <h2 className="text-2xl font-headline font-bold">Property Address & Location</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Property Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['Apartment', 'PG / Hostel', 'Villa', 'Penthouse'].map((type) => (
                      <label key={type} className="cursor-pointer">
                        <input 
                          className="hidden peer" 
                          name="propType" 
                          type="radio" 
                          value={type}
                          checked={formData.propType === type}
                          onChange={handleChange}
                        />
                        <span className="px-6 py-3 rounded-full bg-surface-container-low peer-checked:bg-primary peer-checked:text-white transition-all inline-block font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Furnishing Status</label>
                  <select 
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                  >
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Fully Furnished</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Full Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                    placeholder="Flat No, Wing, Building Name, Society, Area" 
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Pin Code</label>
                    <input 
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all outline-none" 
                      placeholder="440001" 
                      type="text"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Lat/Long (GPS)</label>
                    <div className="flex gap-2">
                      <input 
                        name="lat"
                        value={formData.lat}
                        onChange={handleChange}
                        className="w-1/2 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none" 
                        placeholder="Lat" 
                        type="text"
                      />
                      <input 
                        name="lng"
                        value={formData.lng}
                        onChange={handleChange}
                        className="w-1/2 bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none" 
                        placeholder="Long" 
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 & 4. Financials & Space */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Rent & Lease */}
              <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-8 lg:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <span className="material-symbols-outlined text-tertiary text-3xl">payments</span>
                  <h2 className="text-2xl font-headline font-bold">Rent & Lease</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Monthly Rent (₹)</label>
                    <input 
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 font-bold text-xl text-primary focus:ring-1 focus:ring-primary/20 outline-none" 
                      placeholder="0.00" 
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Security Deposit (₹)</label>
                    <input 
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 outline-none" 
                      placeholder="0.00" 
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Availability Date</label>
                    <input 
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 outline-none" 
                      type="date"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div>
                      <span className="block font-bold">Ready to Move</span>
                      <span className="text-xs text-on-surface-variant">Immediate possession</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Area Details */}
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 lg:p-10 shadow-sm border-l-4 border-primary">
                <div className="flex items-center gap-4 mb-8">
                  <span className="material-symbols-outlined text-primary text-3xl">square_foot</span>
                  <h2 className="text-2xl font-headline font-bold">Area Details</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">Config (BHK)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button 
                          key={n}
                          type="button"
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${formData.bhk === n.toString() ? 'bg-primary text-white' : 'border border-outline-variant hover:bg-slate-50'}`}
                          onClick={() => setFormData(prev => ({ ...prev, bhk: n.toString() }))}
                        >
                          {n}{n === 4 ? '+' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Carpet Area (Sqft)</label>
                    <input 
                      name="sqft"
                      value={formData.sqft}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 outline-none" 
                      placeholder="e.g. 1250" 
                      type="number"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Bathrooms</label>
                      <select 
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-1 outline-none"
                      >
                        <option>1</option><option>2</option><option>3</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Balconies</label>
                      <select 
                        name="balconies"
                        value={formData.balconies}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-1 outline-none"
                      >
                        <option>0</option><option>1</option><option>2</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Amenities & Facilities */}
            <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-tertiary text-3xl">pool</span>
                <h2 className="text-2xl font-headline font-bold">Amenities & Facilities</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[
                  { icon: 'ac_unit', label: 'Air Cond.' },
                  { icon: 'wifi', label: 'High-speed WiFi' },
                  { icon: 'directions_car', label: 'Parking' },
                  { icon: 'security', label: 'Security' },
                  { icon: 'elevator', label: 'Lift Access' },
                  { icon: 'bolt', label: 'Power Backup' },
                  { icon: 'park', label: 'Garden' },
                  { icon: 'fitness_center', label: 'Gym' },
                ].map((item) => (
                  <label key={item.label} className="group cursor-pointer">
                    <input 
                      className="hidden peer" 
                      type="checkbox" 
                      checked={formData.amenities.includes(item.label)}
                      onChange={() => handleAmenityChange(item.label)}
                    />
                    <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-surface-container-low border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary-fixed transition-all group-hover:scale-105 duration-200">
                      <span className="material-symbols-outlined text-3xl text-secondary">{item.icon}</span>
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Commute Highlights */}
            <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-tertiary text-3xl">commute</span>
                <h2 className="text-2xl font-headline font-bold">Commute & Rasta</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Nearest Landmark</label>
                    <input 
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 outline-none" 
                      placeholder="e.g. Futala Lake, Sitabuldi Market" 
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Nearest Station / Bus Stop</label>
                    <input 
                      name="station"
                      value={formData.station}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-1 focus:ring-primary/20 outline-none" 
                      placeholder="e.g. Nagpur Junction, Metro Station" 
                      type="text"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Transport Accessibility</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">directions_bus</span>
                        <span className="font-medium">Bus Access</span>
                      </div>
                      <span className="text-sm font-bold text-tertiary">Excellent</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">train</span>
                        <span className="font-medium">Metro Access</span>
                      </div>
                      <span className="text-sm font-bold text-secondary">Moderate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Photos & Submit */}
            <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-tertiary text-3xl">cloud_upload</span>
                <h2 className="text-2xl font-headline font-bold">Verification & Media</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-low group hover:border-primary transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-5xl text-outline mb-4 group-hover:text-primary">add_a_photo</span>
                    <h3 className="font-bold">Property Images</h3>
                    <p className="text-sm text-on-surface-variant mt-2">Upload 3-5 high-quality photos for better reach.</p>
                    <input className="hidden" multiple type="file"/>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden opacity-50 border border-outline-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline">image</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant">Identity Verification (PDF/JPG)</label>
                    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-2xl text-secondary">upload_file</span>
                      <span className="text-sm font-medium flex-grow">Aadhar or Property Tax Receipt</span>
                      <button className="text-primary font-bold text-sm uppercase tracking-tighter" type="button">Browse</button>
                    </div>
                  </div>
                  <div className="p-6 bg-tertiary/5 rounded-xl border-l-4 border-tertiary">
                    <p className="text-sm font-medium text-on-tertiary-fixed-variant leading-relaxed">
                      By submitting, you agree to SahiRasta's Terms of Service and verify that all information provided is accurate to the best of your heritage records.
                    </p>
                  </div>
                  <button 
                    disabled={loading}
                    className={`w-full bg-primary text-on-primary py-5 rounded-xl font-headline font-extrabold text-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                    type="submit"
                  >
                    {loading ? 'Processing...' : 'Register Property'} 
                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Footer Shell */}
      <footer className="bg-slate-100 dark:bg-slate-950 full-width border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-7xl mx-auto">
          <div className="space-y-4 mb-8 md:mb-0 text-center md:text-left">
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">SahiRasta</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">© 2024 SahiRasta. The Guided Heritage in Real Estate.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-slate-500 dark:text-slate-400 text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-all" href="#">Privacy Policy</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-all" href="#">Terms of Service</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-all" href="#">Cookie Settings</a>
            <a className="text-slate-500 dark:text-slate-400 text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-all" href="#">Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPropertyPage;
