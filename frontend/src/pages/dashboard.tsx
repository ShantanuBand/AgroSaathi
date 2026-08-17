import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { motion } from 'framer-motion';
import { useGetDashboardSummary } from '@workspace/api-client-react';
import { formatCurrency, getTodayDateString } from '@/lib/format';
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
  Bell,
  Bot,
  Newspaper,
  Calendar
} from 'lucide-react';
import { Link } from 'wouter';

import { useAuth } from '@/context/auth-context';
import { useLocationContext } from '@/context/location-context';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { translateName } from '@/lib/translations';

export default function DashboardPage() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { selectedDistrict, selectedCity } = useLocationContext();
  const { data: summary, isLoading } = useGetDashboardSummary({ 
    query: { 
      queryKey: ['dashboard'],
      retry: 2,
      refetchInterval: 15000, // Real-time 15s live update polling
      refetchOnMount: 'always',
    } 
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-muted rounded-xl w-3/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Extract logged in user first name & location dynamically
  const rawFirstName = user?.name ? user.name.trim().split(' ')[0] : (summary?.farmerName ? summary.farmerName.split(' ')[0] : 'Farmer');
  const firstName = translateName(rawFirstName, language);
  
  const activeLocString = selectedCity !== 'All' 
    ? `${selectedCity}, ${selectedDistrict !== 'All' ? selectedDistrict : 'Maharashtra'}` 
    : (selectedDistrict !== 'All' ? `${selectedDistrict}, Maharashtra` : (user?.city ? `${user.city}, Maharashtra` : (summary?.location || 'Amravati, Maharashtra')));
  
  const userLocation = activeLocString;
  
  const todayWeather = summary?.todayWeather || { temperature: 28, condition: 'Sunny', humidity: 45, windSpeed: 12 };
  const topCrops = summary?.topCrops || [];
  const recentNotifications = summary?.recentNotifications || [];
  const marketTrend = summary?.marketTrend || 'up';
  const activeSchemes = summary?.activeSchemes ?? 4;
  const activeListings = summary?.activeListings ?? 2;

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div 
          className="relative text-white rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-xl bg-cover bg-[position:85%_center] md:bg-right border border-emerald-700/30 flex flex-col justify-between min-h-[160px] sm:min-h-[190px] md:min-h-[220px]"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(8, 48, 28, 0.88) 0%, rgba(8, 48, 28, 0.6) 45%, rgba(0,0,0,0) 75%), url('/images/dashboard_hero_bg.png')` 
          }}
        >
          <div className="absolute top-4 right-4 z-20 hidden md:block bg-black/10 hover:bg-black/20 rounded-full backdrop-blur-md transition-all">
            <LanguageSwitcher variant="pill" />
          </div>

          <div className="relative z-10 max-w-[60%] sm:max-w-[62%] md:max-w-xl">
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2 text-white drop-shadow-md leading-tight tracking-tight">
              {language === 'mr' ? (
                <span className="inline-flex items-center gap-2 flex-wrap">
                  <span>राम</span>
                  <span>राम, {firstName}!</span>
                </span>
              ) : (
                `Welcome, ${firstName}!`
              )}
            </h1>
            <p className="text-white/90 text-xs sm:text-base md:text-lg flex items-center gap-1 sm:gap-2 drop-shadow-xs font-medium">
              <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
              <span className="truncate">{userLocation}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/weather" className="bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl p-4 hover:border-sky-400 transition-all cursor-pointer group shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-sky-500/15 text-sky-600 dark:text-sky-400 rounded-xl">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono text-sky-950 dark:text-sky-100">{todayWeather.temperature}°</span>
            </div>
            <p className="font-semibold text-sky-900 dark:text-sky-200">{translateName(todayWeather.condition, language)}</p>
            <p className="text-xs text-sky-700/80 dark:text-sky-300/70 mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {todayWeather.humidity}%</span>
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {todayWeather.windSpeed}km/h</span>
            </p>
          </Link>

          <Link href="/market" className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 hover:border-amber-400 transition-all cursor-pointer group shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl">
                {marketTrend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${marketTrend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/50' : 'bg-red-100 text-red-700 dark:bg-red-900/50'}`}>
                {marketTrend.toUpperCase()}
              </span>
            </div>
            <p className="font-semibold text-amber-900 dark:text-amber-200">{language === 'mr' ? 'बाजार भाव कल' : 'Mandi Price Trend'}</p>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/70 mt-1">{language === 'mr' ? 'महाराष्ट्रातील थेट दर' : 'Live Maharashtra rates'}</p>
          </Link>

          <Link href="/schemes" className="bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 rounded-2xl p-4 hover:border-purple-400 transition-all cursor-pointer shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono text-purple-950 dark:text-purple-100">{activeSchemes}</span>
            </div>
            <p className="font-semibold text-purple-900 dark:text-purple-200">{language === 'mr' ? 'शासकीय योजना' : 'Govt Schemes'}</p>
            <p className="text-xs text-purple-700/80 dark:text-purple-300/70 mt-1">{language === 'mr' ? 'राज्य व केंद्र अनुदान' : 'State & Central grants'}</p>
          </Link>

          <Link href="/marketplace" className="bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 rounded-2xl p-4 hover:border-teal-400 transition-all cursor-pointer shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-xl">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono text-teal-950 dark:text-teal-100">{activeListings}</span>
            </div>
            <p className="font-semibold text-teal-900 dark:text-teal-200">{language === 'mr' ? 'शेतकरी दालन' : 'Your Marketplace'}</p>
            <p className="text-xs text-teal-700/80 dark:text-teal-300/70 mt-1">{language === 'mr' ? 'विक्रीसाठी उपलब्ध माल' : 'Active items on sale'}</p>
          </Link>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/ai" className="bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 p-3.5 rounded-xl hover:border-cyan-400 transition-all flex items-center gap-3 cursor-pointer group shadow-sm">
            <div className="p-2.5 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-cyan-950 dark:text-cyan-100">{language === 'mr' ? 'कृषी मित्राला विचारा' : 'Ask AI Mitra'}</div>
              <div className="text-[11px] text-cyan-700/80 dark:text-cyan-300/70">{language === 'mr' ? 'शेती मार्गदर्शक' : 'Farming Advice'}</div>
            </div>
          </Link>

          <Link href="/marketplace" className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3.5 rounded-xl hover:border-emerald-400 transition-all flex items-center gap-3 cursor-pointer group shadow-sm">
            <div className="p-2.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-emerald-950 dark:text-emerald-100">{language === 'mr' ? 'शेतमाल जाहीर करा' : 'Post Listing'}</div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/70">{language === 'mr' ? 'शेतमाल विका' : 'Sell produce'}</div>
            </div>
          </Link>

          <Link href="/schemes" className="bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/60 p-3.5 rounded-xl hover:border-violet-400 transition-all flex items-center gap-3 cursor-pointer group shadow-sm">
            <div className="p-2.5 bg-violet-500/15 text-violet-600 dark:text-violet-400 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-violet-950 dark:text-violet-100">{language === 'mr' ? 'शासकीय योजना' : 'Govt Schemes'}</div>
              <div className="text-[11px] text-violet-700/80 dark:text-violet-300/70">{language === 'mr' ? 'अनुदानाचा लाभ घ्या' : 'Apply grants'}</div>
            </div>
          </Link>

          <Link href="/market" className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-xl hover:border-amber-400 transition-all flex items-center gap-3 cursor-pointer group shadow-sm">
            <div className="p-2.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-amber-950 dark:text-amber-100">{language === 'mr' ? 'बाजार समिती भाव' : 'Mandi Rates'}</div>
              <div className="text-[11px] text-amber-700/80 dark:text-amber-300/70">{language === 'mr' ? 'आजचे दर पहा' : 'Price trends'}</div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{language === 'mr' ? 'प्रमुख शेतमाल बाजार भाव' : 'Top Crop Prices'}</h2>
                  <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    {language === 'mr' ? 'थेट भाव' : 'LIVE'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{language === 'mr' ? `तारीख: ${getTodayDateString('mr')} (आजचे भाव)` : `Date: ${getTodayDateString('en')} (Today's Live Rates)`}</span>
                </div>
              </div>
              <Link href="/market" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                {language === 'mr' ? 'सर्व पहा' : 'View All'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="divide-y divide-border">
                {topCrops.length > 0 ? (
                  topCrops.map(crop => (
                    <Link key={crop.id} href="/market" className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors block">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                          crop.category?.toLowerCase() === 'cereals' ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/50 dark:text-amber-200' :
                          crop.category?.toLowerCase() === 'oilseeds' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200' :
                          crop.category?.toLowerCase() === 'pulses' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200' :
                          crop.category?.toLowerCase() === 'vegetables' ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-900/50 dark:text-rose-200' :
                          'bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-900/50 dark:text-teal-200'
                        }`}>
                          {crop.cropName ? crop.cropName[0] : 'C'}
                        </div>
                        <div>
                          <h3 className="font-semibold">{translateName(crop.cropName, language)}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <span>{translateName(crop.market, language)}, {translateName(crop.state, language)}</span>
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {getTodayDateString(language)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-lg">{formatCurrency(crop.currentPrice)}<span className="text-xs text-muted-foreground font-sans font-normal">/{translateName(crop.unit, language)}</span></div>
                        <div className={`text-sm font-medium flex items-center justify-end gap-1 ${crop.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {crop.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(crop.changePercent)}%
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">{language === 'mr' ? 'बाजार भाव लोड होत आहेत...' : 'Loading crop prices...'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{language === 'mr' ? 'ताजे इशारे व सूचना' : 'Recent Alerts'}</h2>
              <Link href="/notifications" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                {language === 'mr' ? 'सर्व' : 'All'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.slice(0, 4).map(notification => (
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
                      <h4 className="font-medium text-sm leading-tight">
                        {language === 'mr' && (notification as any).titleMr ? (notification as any).titleMr : translateName(notification.title, language)}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {language === 'mr' && (notification as any).messageMr ? (notification as any).messageMr : translateName(notification.message, language)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">{language === 'mr' ? 'कोणतेही नवीन इशारे नाहीत.' : 'No recent alerts.'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Maharashtra Farm News & Rain Bulletins */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              {language === 'mr' ? 'महाराष्ट्र कृषी बातम्या व हवामान बुलेटिन' : 'Maharashtra Farm News & Monsoon Bulletins'}
            </h2>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full border border-primary/20">
              {language === 'mr' ? 'ताजी माहिती' : 'Live Updates'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(summary as any)?.latestNews && (summary as any).latestNews.length > 0 ? (
              (summary as any).latestNews.map((newsItem: any, idx: number) => {
                const isSky = idx % 3 === 0;
                const isAmber = idx % 3 === 1;
                
                const bgClass = isSky ? "bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 hover:border-sky-400" :
                                isAmber ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 hover:border-amber-400" :
                                "bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/70 hover:border-purple-400";
                
                const badgeClass = isSky ? "bg-sky-200/80 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200" :
                                   isAmber ? "bg-amber-200/80 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200" :
                                   "bg-purple-200/80 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200";
                                   
                const textMutedClass = isSky ? "text-sky-700/80 dark:text-sky-300/80" :
                                       isAmber ? "text-amber-700/80 dark:text-amber-300/80" :
                                       "text-purple-700/80 dark:text-purple-300/80";
                                       
                const textMainClass = isSky ? "text-sky-950 dark:text-sky-100" :
                                      isAmber ? "text-amber-950 dark:text-amber-100" :
                                      "text-purple-950 dark:text-purple-100";
                                      
                const textDescClass = isSky ? "text-sky-800/80 dark:text-sky-200/80" :
                                      isAmber ? "text-amber-800/80 dark:text-amber-200/80" :
                                      "text-purple-800/80 dark:text-purple-200/80";

                const borderClass = isSky ? "border-sky-200/60 dark:border-sky-800/60" :
                                    isAmber ? "border-amber-200/60 dark:border-amber-800/60" :
                                    "border-purple-200/60 dark:border-purple-800/60";

                return (
                  <a key={newsItem.id} href={newsItem.link} target="_blank" rel="noopener noreferrer" className={`border rounded-2xl p-5 transition-all flex flex-col justify-between shadow-sm cursor-pointer ${bgClass}`}>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <span className={`${badgeClass} px-2.5 py-0.5 rounded-full font-bold`}>{translateName(newsItem.category, language)}</span>
                        <span className={`${textMutedClass} font-medium line-clamp-1 max-w-[120px]`}>{translateName(newsItem.district, language)}</span>
                      </div>
                      <h3 className={`font-bold text-base ${textMainClass} mb-2 leading-snug line-clamp-2`}>
                        {translateName(newsItem.title, language)}
                      </h3>
                      <p className={`text-sm ${textDescClass} line-clamp-3 mb-4`}>
                        {translateName(newsItem.summary, language)}
                      </p>
                    </div>
                    <div className={`flex items-center justify-between text-xs ${textMutedClass} pt-3 border-t ${borderClass} font-medium`}>
                      <span className="line-clamp-1 max-w-[140px]">{newsItem.source}</span>
                      <span className="shrink-0">{newsItem.time}</span>
                    </div>
                  </a>
                );
              })
            ) : (
              <p className="col-span-full text-sm text-muted-foreground text-center py-6">{language === 'mr' ? 'बातम्या लोड होत आहेत...' : 'Loading live news...'}</p>
            )}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
