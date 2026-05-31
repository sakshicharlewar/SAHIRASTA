import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
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
                className="text-slate-600 font-medium hover:text-blue-800 transition-colors font-label text-[0.75rem] uppercase tracking-widest cursor-pointer"
                href="#"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-slate-600 font-medium hover:text-blue-800 transition-colors font-label text-[0.75rem] uppercase tracking-widest">
              Sign In
            </button>
            <button className="bg-primary text-white px-5 py-2 rounded-lg font-bold transition-all hover:bg-primary-container active:scale-95">
              List Property
            </button>
          </div>
        </div>
      </nav>

      {/* Main Form Area */}
      <main className="flex-grow flex items-center justify-center jali-pattern pt-24 pb-12 px-6">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-[0_12px_40px_rgba(25,28,29,0.06)] relative overflow-hidden">
          {/* Saffron accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary rounded-l-2xl"></div>

          <div className="mb-10 text-center">
            <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant font-medium">Continue your heritage journey.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignIn}>
            {/* Email */}
            <div className="space-y-2">
              <label className="block font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-xl border-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline"
                  placeholder="name@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold">
                  Password
                </label>
                <a className="text-[0.75rem] font-bold text-tertiary hover:underline underline-offset-4" href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-xl border-none focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 duration-150"
              type="submit"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant opacity-30"></div>
              <span className="flex-shrink mx-4 text-outline font-label text-[0.65rem] uppercase tracking-widest">
                or continue with
              </span>
              <div className="flex-grow border-t border-outline-variant opacity-30"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors active:scale-95"
                type="button"
              >
                <img
                  alt="Google Logo"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdsI6DYRihoQPbGe9jMPU2Vlswa-t_RsocN96Z-hmqJxkUPvaaHlI12u4CSpJO7aReJI5zGRqkgwd6XsQdGMfG93b1yzpnUXlt9Q2BrvVFOqfxHoWRPLyoMd7WxzEhJhW_Ht2v3dT7vP8yawyhWKmxPWaMb001om_-rbLMa66dRZ8POpY77fpiWoz8d_L7NLkzGxG4ujMaM9bxMoVNjwNPUUTzHvvpIOMLkDET2sye2TL2BAlzv1ub_qmcejePJqr7rcrNjxdBq-oa"
                />
                <span className="font-bold text-sm text-on-surface-variant">Google</span>
              </button>
              <button
                className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors active:scale-95"
                type="button"
              >
                <span
                  className="material-symbols-outlined text-[#1877F2]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  social_leaderboard
                </span>
                <span className="font-bold text-sm text-on-surface-variant">Facebook</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-on-surface-variant text-sm">
            Don't have an account?{' '}
            <a
              className="text-primary font-bold hover:underline underline-offset-4 cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Join SahiRasta
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div>
            <div className="text-xl font-bold text-blue-700 font-headline mb-4">SahiRasta</div>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
              Guided Heritage in every step. Finding your way home with cultural warmth and tech precision.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-label text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant">Platform</span>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">About Us</a>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Careers</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-label text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant">Support</span>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Contact Support</a>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Privacy Policy</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-label text-[0.75rem] uppercase tracking-widest font-bold text-on-surface-variant">Legal</span>
            <a className="text-slate-500 hover:text-blue-600 hover:underline underline-offset-4 transition-all" href="#">Terms of Service</a>
            <p className="mt-4 text-[0.65rem] text-slate-400">© 2024 SahiRasta. The Guided Heritage.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;