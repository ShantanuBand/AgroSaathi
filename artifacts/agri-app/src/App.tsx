import React from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import DashboardPage from '@/pages/dashboard';
import MarketPage from '@/pages/market';
import WeatherPage from '@/pages/weather';
import SchemesPage from '@/pages/schemes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-muted-foreground">{title} Coming Soon</h1>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/market" component={MarketPage} />
      <Route path="/weather" component={WeatherPage} />
      <Route path="/schemes" component={SchemesPage} />
      <Route path="/marketplace" component={() => <PlaceholderPage title="Marketplace" />} />
      <Route path="/ai" component={() => <PlaceholderPage title="AI Assistant" />} />
      <Route path="/notifications" component={() => <PlaceholderPage title="Notifications" />} />
      <Route path="/profile" component={() => <PlaceholderPage title="Profile" />} />
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-muted-foreground">404 - Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
