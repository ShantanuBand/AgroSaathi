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
  User,
  Menu,
  Leaf
} from 'lucide-react';
import { useGetDashboardSummary } from '@workspace/api-client-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Market', path: '/market', icon: TrendingUp },
  { name: 'Weather', path: '/weather', icon: CloudSun },
  { name: 'Marketplace', path: '/marketplace', icon: Store },
  { name: 'Schemes', path: '/schemes', icon: ShieldCheck },
  { name: 'AI Assistant', path: '/ai', icon: Bot },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: summary } = useGetDashboardSummary({ query: { queryKey: ['dashboard'] } });

  const unreadCount = summary?.unreadNotifications || 0;

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 text-primary font-bold text-xl">
          <Leaf className="w-6 h-6" />
          AgroSaathi
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link 
            href="/notifications"
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
              location === '/notifications' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link 
            href="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              location === '/profile' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <Leaf className="w-5 h-5" />
          AgroSaathi
        </div>
        <div className="flex items-center gap-3">
          <Link href="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border border-card"></span>
            )}
          </Link>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer (simplified as overlay for now) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted-foreground"
              >
                Close
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {[...navItems, { name: 'Profile', path: '/profile', icon: User }].map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg ${
                      isActive 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'bg-card text-foreground'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col pb-20 md:pb-0">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { name: 'Home', path: '/', icon: Home },
            { name: 'Market', path: '/market', icon: TrendingUp },
            { name: 'Weather', path: '/weather', icon: CloudSun },
            { name: 'Store', path: '/marketplace', icon: Store },
            { name: 'AI', path: '/ai', icon: Bot },
          ].map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
