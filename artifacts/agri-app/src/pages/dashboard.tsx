import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { motion } from 'framer-motion';
import { useGetDashboardSummary } from '@workspace/api-client-react';
import { AnimatedNumber } from '@/components/animated-number';
import { formatCurrency } from '@/lib/format';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  ShieldCheck,
  Store,
  Bell
} from 'lucide-react';
import { Link } from 'wouter';

export default function DashboardPage() {
  const { data: summary, isLoading, isError } = useGetDashboardSummary({ query: { queryKey: ['dashboard'] } });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-muted rounded-xl w-3/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !summary) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-muted-foreground">
          Failed to load dashboard data. Please try again.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Ram Ram, {summary.farmerName.split(' ')[0]}!
            </h1>
            <p className="text-primary-foreground/80 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {summary.location}
            </p>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/weather" className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono">{summary.todayWeather.temperature}°</span>
            </div>
            <p className="font-medium">{summary.todayWeather.condition}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {summary.todayWeather.humidity}%</span>
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {summary.todayWeather.windSpeed}km/h</span>
            </p>
          </Link>

          <Link href="/market" className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                {summary.marketTrend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <span className={`text-sm font-bold ${summary.marketTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {summary.marketTrend.toUpperCase()}
              </span>
            </div>
            <p className="font-medium">Market Trend</p>
            <p className="text-xs text-muted-foreground mt-1">Based on local mandi prices</p>
          </Link>

          <Link href="/schemes" className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono">{summary.activeSchemes}</span>
            </div>
            <p className="font-medium">Active Schemes</p>
            <p className="text-xs text-muted-foreground mt-1">Govt grants available</p>
          </Link>

          <Link href="/marketplace" className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono">{summary.activeListings}</span>
            </div>
            <p className="font-medium">Your Listings</p>
            <p className="text-xs text-muted-foreground mt-1">Active items in market</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Top Crop Prices</h2>
              <Link href="/market" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="divide-y divide-border">
                {summary.topCrops.map(crop => (
                  <div key={crop.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                        {crop.cropName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">{crop.cropName}</h3>
                        <p className="text-sm text-muted-foreground">{crop.market}, {crop.state}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-lg">{formatCurrency(crop.currentPrice)}<span className="text-xs text-muted-foreground font-sans font-normal">/{crop.unit}</span></div>
                      <div className={`text-sm font-medium flex items-center justify-end gap-1 ${crop.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crop.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(crop.changePercent)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Alerts</h2>
              <Link href="/notifications" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
              {summary.recentNotifications.length > 0 ? (
                summary.recentNotifications.slice(0, 4).map(notification => (
                  <div key={notification.id} className="flex gap-3 items-start pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className={`p-2 rounded-full mt-1 shrink-0 ${
                      notification.type === 'weather_alert' ? 'bg-red-100 text-red-600' :
                      notification.type === 'price_alert' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'weather_alert' ? <CloudRain className="w-4 h-4" /> : 
                       notification.type === 'price_alert' ? <TrendingUp className="w-4 h-4" /> : 
                       <Bell className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent alerts.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
