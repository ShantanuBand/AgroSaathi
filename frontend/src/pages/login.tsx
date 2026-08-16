import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLocation, Link } from 'wouter';
import { Sprout, Phone, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, UserCheck, TrendingUp, CloudRain } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please enter your mobile number and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login({ phone, password });
    setLoading(false);

    if (res.success) {
      setLocation('/');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (demoPhone: string, demoPass: string) => {
    setPhone(demoPhone);
    setPassword(demoPass);
    setLoading(true);
    setError(null);

    const res = await login({ phone: demoPhone, password: demoPass });
    setLoading(false);

    if (res.success) {
      setLocation('/');
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden"
      style={{ backgroundImage: `url('/images/login-bg.jpg')` }}
    >
      {/* Overlay to ensure text and card readability */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent hidden md:block"></div>

      <div className="relative z-10 w-full mx-auto flex flex-col md:flex-row items-center justify-center md:justify-end gap-5 lg:gap-8 px-4 sm:px-6 md:px-0 md:pr-12 lg:pr-32 xl:pr-48 pt-10 md:pt-0">
        
        {/* Left Side: Features List (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col max-w-sm">
          <div className="inline-flex items-center justify-center p-3.5 bg-emerald-600 text-white rounded-full shadow-lg mb-6 w-14 h-14">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-3xl lg:text-[2rem] font-extrabold tracking-tight mb-4 leading-tight text-emerald-300 drop-shadow-md">
            Smart Farming,<br />Now At Your Fingertips
          </h1>
          <div className="w-12 h-1 bg-emerald-500/80 rounded-full mb-8"></div>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Daily Market Rates</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Hyper-local Weather</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Government Schemes</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-2.5 bg-emerald-900/40 backdrop-blur-md rounded-xl shadow-sm border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-800/60 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-100 drop-shadow-sm">Expert Crop Advisory</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-card/95 backdrop-blur-md border border-border/50 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
            
            <div className="text-center mb-8">
              <div className="inline-flex md:hidden items-center justify-center p-2.5 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 mb-4">
                <Sprout className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                AgroSaathi <span className="text-primary">Farmer Portal</span>
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Sign in to access hyper-local Market rates, weather advisories & government schemes.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Mobile Number / Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              Don't have a farmer account yet?{' '}
              <Link href="/register" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                Register New Farmer →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
