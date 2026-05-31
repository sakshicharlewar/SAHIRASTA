import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleProtectedLink = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div
            className="text-2xl font-bold tracking-tighter text-blue-700 font-headline cursor-pointer"
            onClick={() => navigate('/')}
          >
            SahiRasta
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {['Buy', 'Rent', 'Commute Score', 'Guides'].map((item) => (
              <a
                key={item}
                className="text-slate-600 font-medium hover:text-blue-800 transition-colors cursor-pointer"
                href="#"
                onClick={handleProtectedLink}
              >
                {item}
              </a>
            ))}
            <button className="bg-primary text-white px-5 py-2 rounded-full font-bold hover:bg-primary-container transition-all active:scale-95">
              List Property
            </button>
            <a
              className="text-blue-700 font-bold border-b-2 border-orange-600 cursor-pointer"
              href="#"
              onClick={() => navigate('/login')}
            >
              Sign In
            </a>
          </div>
          <div className="md:hidden">
            <span className="material-symbols-outlined text-on-surface">menu</span>
          </div>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute inset-0 jali-pattern pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-[480px] z-10">
          {/* Registration Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-[0_12px_40px_rgba(25,28,29,0.06)] border border-outline-variant/20">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3">
                Begin your journey.
              </h1>
              <p className="text-on-surface-variant font-medium">
                Create an account to unlock heritage insights and personalized commute scores.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold ml-1">
                  Full Name
                </label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface placeholder:text-outline/60"
                  placeholder="Arjun Malhotra"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold ml-1">
                  Email Address
                </label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface placeholder:text-outline/60"
                  placeholder="arjun@sahirasta.in"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold ml-1">
                    Password
                  </label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface placeholder:text-outline/60"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold ml-1">
                    Confirm
                  </label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface placeholder:text-outline/60"
                    placeholder="••••••••"
                    type="password"
                    required
                    // Confirm field intentionally matches password state for now
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/30 bg-surface-container-high"
                    id="terms"
                    type="checkbox"
                    required
                  />
                </div>
                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
                  I agree to the{' '}
                  <a className="text-primary font-bold hover:underline underline-offset-4" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="text-primary font-bold hover:underline underline-offset-4" href="#">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* CTA */}
              <button
                className="w-full py-4 bg-primary text-white rounded-full font-headline font-bold text-lg hover:bg-primary-container shadow-lg shadow-primary/10 transition-all active:scale-[0.98] mt-4"
                type="submit"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
              <p className="text-on-surface-variant">
                Already have an account?{' '}
                <a
                  className="text-tertiary font-bold ml-1 hover:underline underline-offset-4 transition-all cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
              <span className="text-[0.65rem] font-label uppercase tracking-tighter font-bold">Secure Data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">shield</span>
              <span className="text-[0.65rem] font-label uppercase tracking-tighter font-bold">Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">map</span>
              <span className="text-[0.65rem] font-label uppercase tracking-tighter font-bold">Guided Paths</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 mt-auto bg-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-xl font-bold text-blue-700 font-headline">SahiRasta</div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Finding your way home through the lanes of heritage and the pulse of modernity.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Company</span>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">About Us</a>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Careers</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Legal</span>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Support</span>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Contact Support</a>
            <div className="flex gap-4 mt-2">
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">share</span>
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">alternate_email</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/10 text-center md:text-left">
          <p className="text-slate-500 text-xs font-label uppercase tracking-widest">© 2024 SahiRasta. The Guided Heritage.</p>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;