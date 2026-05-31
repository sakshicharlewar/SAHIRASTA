import React from 'react';
import { useNavigate } from 'react-router-dom';

const benefits = [
  {
    icon: 'analytics',
    title: 'Commute-Matched Tenants',
    desc: 'We surface your property to renters whose workplace is within optimal commute range — reducing vacancy and increasing quality leads.',
    accent: 'border-primary',
    iconColor: 'text-primary',
    bg: 'bg-primary-fixed',
  },
  {
    icon: 'verified',
    title: 'Verified Listing Badge',
    desc: 'Get the Heritage Verified badge after a quick inspection — boosting credibility and commanding premium rent.',
    accent: 'border-tertiary',
    iconColor: 'text-tertiary',
    bg: 'bg-tertiary-fixed',
  },
  {
    icon: 'auto_graph',
    title: 'Real-Time Market Insights',
    desc: 'Access live rental price trends, locality demand heat maps, and occupancy forecasts — all in your owner dashboard.',
    accent: 'border-secondary',
    iconColor: 'text-secondary',
    bg: 'bg-secondary-container',
  },
  {
    icon: 'support_agent',
    title: 'Dedicated Concierge Support',
    desc: 'From listing setup to tenant onboarding, our property experts guide you at every step — in Hindi, Marathi, or English.',
    accent: 'border-primary',
    iconColor: 'text-primary',
    bg: 'bg-primary-fixed',
  },
];

const steps = [
  { n: '01', label: 'Sign Up as an Owner', desc: 'Create your free property owner account in under 2 minutes.' },
  { n: '02', label: 'List Your Property', desc: 'Add details, photos, and set your price. We guide you through it.' },
  { n: '03', label: 'Get Commute-Matched Leads', desc: 'Our AI matches tenants whose office is within their commute budget.' },
  { n: '04', label: 'Close & Manage', desc: 'Handle visits, agreements, and payments from a single dashboard.' },
];

const ListPropertySection = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-on-surface py-24 px-6">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#c1c6d6 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
        />
        {/* saffron accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-label font-bold uppercase tracking-[0.15em] text-tertiary">
              <span className="w-6 h-px bg-tertiary" />
              For Property Owners
            </span>
            <h2 className="text-5xl lg:text-6xl font-headline font-extrabold text-white leading-tight">
              List your property on <span className="text-tertiary">SahiRasta.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
              Reach thousands of commute-conscious renters and buyers. Our platform intelligently matches your property with people whose workplace is within their ideal travel zone — so you attract serious, long-term tenants.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                className="px-8 py-4 bg-tertiary text-white font-bold rounded-xl shadow-xl shadow-tertiary/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
                onClick={() => navigate('/register-property')}
              >
                Register Your Property
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              {[['12K+', 'Active Listings'], ['₹180Cr+', 'Rent Facilitated'], ['4.9★', 'Owner Rating']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-2xl font-headline font-extrabold text-white">{val}</p>
                  <p className="text-xs font-label font-bold uppercase tracking-widest text-slate-400">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map(({ icon, title, desc, accent, iconColor, bg }) => (
              <div
                key={title}
                className={`bg-white/5 backdrop-blur-sm border-l-4 ${accent} rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group`}
              >
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <h4 className="text-white font-headline font-bold mb-2">{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-surface-container-low py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-label font-bold uppercase tracking-[0.15em] text-tertiary">Simple Process</span>
            <h3 className="text-4xl font-headline font-extrabold text-on-surface mt-2">How listing works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, label, desc }, i) => (
              <div key={n} className="relative bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-all group">
                {/* connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-outline-variant/40 z-10" />
                )}
                <div className="text-5xl font-headline font-black text-outline-variant/20 mb-4 group-hover:text-primary/10 transition-colors">{n}</div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${i % 2 === 0 ? 'bg-primary-fixed text-primary' : 'bg-tertiary-fixed text-tertiary'}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {['how_to_reg', 'add_home', 'group', 'task_alt'][i]}
                  </span>
                </div>
                <h4 className="font-headline font-bold text-on-surface mb-2">{label}</h4>
                <p className="text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-on-surface-variant font-medium">Join 3,200+ property owners already on SahiRasta.</p>
            <button
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2"
              onClick={() => navigate('/register-property')}
            >
              Get Started Free
              <span className="material-symbols-outlined text-lg">east</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListPropertySection;
