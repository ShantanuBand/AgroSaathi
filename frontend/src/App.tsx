import React from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import DashboardPage from '@/pages/dashboard';
import MarketPage from '@/pages/market';
import APMCMapPage from '@/pages/apmc-map';
import KrishiSevaKendraPage from '@/pages/krishi-seva-kendra';
import GovOfficesPage from '@/pages/gov-offices';
import EmergencyServicesPage from '@/pages/emergency-services';
import WeatherPage from '@/pages/weather';
import SchemesPage from '@/pages/schemes';
import MarketplacePage from '@/pages/marketplace';
import AiAssistantPage from '@/pages/ai-assistant';
import NotificationsPage from '@/pages/notifications';
import ProfilePage from '@/pages/profile';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import NotFoundPage from '@/pages/not-found';
import { AuthProvider } from '@/context/auth-context';
import { LocationProvider } from '@/context/location-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

import { useAuth } from '@/context/auth-context';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      {/* Protected Routes */}
      <Route path="/" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/market" component={() => <ProtectedRoute component={MarketPage} />} />
      <Route path="/apmc-map" component={() => <ProtectedRoute component={APMCMapPage} />} />
      <Route path="/krishi-seva-kendra" component={() => <ProtectedRoute component={KrishiSevaKendraPage} />} />
      <Route path="/gov-offices" component={() => <ProtectedRoute component={GovOfficesPage} />} />
      <Route path="/emergency-services" component={() => <ProtectedRoute component={EmergencyServicesPage} />} />
      <Route path="/weather" component={() => <ProtectedRoute component={WeatherPage} />} />
      <Route path="/schemes" component={() => <ProtectedRoute component={SchemesPage} />} />
      <Route path="/marketplace" component={() => <ProtectedRoute component={MarketplacePage} />} />
      <Route path="/ai" component={() => <ProtectedRoute component={AiAssistantPage} />} />
      <Route path="/notifications" component={() => <ProtectedRoute component={NotificationsPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      
      <Route component={NotFoundPage} />
    </Switch>
  );
}

import { LanguageProvider } from '@/context/language-context';

function App() {
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const base = baseUrl === '' || baseUrl === '/' ? undefined : baseUrl;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <LocationProvider>
            <WouterRouter base={base}>
              <Router />
            </WouterRouter>
          </LocationProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
