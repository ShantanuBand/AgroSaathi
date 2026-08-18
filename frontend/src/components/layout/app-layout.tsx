import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  TrendingUp, 
  CloudSun, 
  Store, 
  ShieldCheck, 
  Bot, 
  Bell, 
  User as UserIcon,
  Menu,
  Leaf,
  LogOut,
  LogIn,
  MapPin,
  Map,
  Landmark,
  Sprout,
  Siren
} from 'lucide-react';
import { useGetDashboardSummary } from '@workspace/api-client-react';
import { useAuth } from '@/context/auth-context';
import { SidebarLocationWidget } from './sidebar-location-widget';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { translateName } from '@/lib/translations';

const navItems = [
  { key: 'nav.dashboard', name: 'Dashboard', path: '/', icon: Home, activeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-600', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'nav.apmc_map', name: 'APMC Map', path: '/apmc-map', icon: Map, activeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-l-4 border-amber-600', iconColor: 'text-amber-600 dark:text-amber-400' },
  { key: 'nav.market_rates', name: 'Market Rates', path: '/market', icon: TrendingUp, activeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-600', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'nav.krishi_seva', name: 'Krishi Seva', path: '/krishi-seva-kendra', icon: Sprout, activeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-l-4 border-teal-600', iconColor: 'text-teal-600 dark:text-teal-400' },
  { key: 'nav.gov_offices', name: 'Govt Offices', path: '/gov-offices', icon: Landmark, activeClass: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-l-4 border-violet-600', iconColor: 'text-violet-600 dark:text-violet-400' },
  { key: 'nav.emergency', name: 'Emergency 24x7', path: '/emergency-services', icon: Siren, activeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-l-4 border-rose-600', iconColor: 'text-rose-600 dark:text-rose-400' },
  { key: 'nav.weather', name: 'Weather', path: '/weather', icon: CloudSun, activeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-l-4 border-sky-600', iconColor: 'text-sky-600 dark:text-sky-400' },
  { key: 'nav.marketplace', name: 'Marketplace', path: '/marketplace', icon: Store, activeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-l-4 border-teal-600', iconColor: 'text-teal-600 dark:text-teal-400' },
  { key: 'nav.schemes', name: 'Schemes', path: '/schemes', icon: ShieldCheck, activeClass: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-l-4 border-violet-600', iconColor: 'text-violet-600 dark:text-violet-400' },
  { key: 'nav.ai_assistant', name: 'AI Assistant', path: '/ai', icon: Bot, activeClass: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-l-4 border-cyan-600', iconColor: 'text-cyan-600 dark:text-cyan-400' },
];

function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const isMarathi = language === 'mr';
  const { data: summary } = useGetDashboardSummary({}, { query: { queryKey: ['dashboard'] } });
  const isOnline = useOnlineStatus();

  const unreadCount = summary?.unreadNotifications || 0;

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background pt-0">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white text-center py-2 px-4 text-[13px] md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
          <Globe className="w-4 h-4 animate-pulse" />
          You are offline. Data displayed may not be real-time.
        </div>
      )}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border sticky top-0 h-screen overflow-hidden">
        <div className="p-3.5 px-4 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5 text-primary font-bold text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="tracking-tight text-foreground">Agro<span className="text-primary">Saathi</span></span>
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold" title="Real-time live data synchronization active">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              LIVE
            </div>
          </div>
        </div>

        {/* Logged in Farmer Profile Badge */}
        {user && (
          <div className="mx-3 mb-2 p-2 px-2.5 bg-muted/40 rounded-lg border border-border flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {translateName(user.name.trim().split(' ')[0], language).charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-foreground truncate">{translateName(user.name.trim().split(' ')[0], language)}</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                <MapPin className="w-2.5 h-2.5 text-primary shrink-0" /> {user.city || user.district}
              </div>
            </div>
          </div>
        )}

        {/* Universal Region & Location Selector in Sidebar */}
        <SidebarLocationWidget />
        
        <nav className="flex-1 px-2.5 space-y-0.5 min-h-0 overflow-y-auto py-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all text-[13px] ${
                  isActive 
                    ? `${item.activeClass} font-semibold shadow-xs` 
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.iconColor : 'text-muted-foreground'}`} />
                <span className="truncate">{t(item.key, item.name)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 px-2.5 border-t border-sidebar-border space-y-0.5 shrink-0">

          <Link 
            href="/notifications"
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition-all text-[13px] ${
              location === '/notifications' 
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-l-4 border-rose-600 font-semibold shadow-xs' 
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Bell className={`w-4 h-4 shrink-0 ${location === '/notifications' ? 'text-rose-600' : 'text-muted-foreground'}`} />
              <span className="truncate">{t('nav.notifications', 'Notifications')}</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link 
            href="/profile"
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all text-[13px] ${
              location === '/profile' 
                ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600 font-semibold shadow-xs' 
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <UserIcon className={`w-4 h-4 shrink-0 ${location === '/profile' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
            <span className="truncate">{t('nav.profile', 'Profile')}</span>
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-[13px] font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="truncate">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all text-[13px] font-bold shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span className="truncate">Farmer Sign In</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-1.5 text-primary font-bold text-lg">
          <Leaf className="w-5 h-5" />
          <span>AgroSaathi</span>
          <span className="flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded-full text-[9px] font-bold ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            LIVE
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher variant="compact" className="py-1 px-2 text-[10px]" />
          <Link href="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border border-card"></span>
            )}
          </Link>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="flex flex-col min-h-full p-4 pb-24">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <div className="font-bold text-foreground">Menu Navigation</div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted-foreground font-bold cursor-pointer hover:text-foreground"
              >
                Close ✕
              </button>
            </div>
            <div className="mb-3">
              <SidebarLocationWidget />
            </div>
            <nav className="flex flex-col gap-2">
              {[...navItems, { name: 'Profile', path: '/profile', icon: UserIcon }, { name: 'Notifications', path: '/notifications', icon: Bell }].map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base sm:text-lg ${
                      isActive 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'bg-card text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    {item.name}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base sm:text-lg bg-destructive/10 text-destructive font-bold mt-4"
                >
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base sm:text-lg bg-primary text-primary-foreground font-bold mt-4"
                >
                  <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                  Farmer Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col pb-24 md:pb-8 min-w-0 overflow-x-hidden">
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { name: isMarathi ? 'मुख्य पृष्ठ' : 'Home', path: '/', icon: Home, activeColor: 'text-emerald-600 dark:text-emerald-400' },
            { name: isMarathi ? 'एपीएमसी नकाशा' : 'APMC Map', path: '/apmc-map', icon: Map, activeColor: 'text-amber-600 dark:text-amber-400' },
            { name: isMarathi ? 'बाजार भाव' : 'Market', path: '/market', icon: TrendingUp, activeColor: 'text-emerald-600 dark:text-emerald-400' },
            { name: isMarathi ? 'कृषी केंद्र' : 'Krishi', path: '/krishi-seva-kendra', icon: Sprout, activeColor: 'text-teal-600 dark:text-teal-400' },
            { name: isMarathi ? 'AI मित्र' : 'AI', path: '/ai', icon: Bot, activeColor: 'text-cyan-600 dark:text-cyan-400' },
          ].map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
                  isActive ? item.activeColor : 'text-muted-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
