import React from 'react';
import { useLocationContext } from '@/context/location-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useGetCurrentWeather, useGetWeatherForecast, useGetWeatherAlerts } from '@workspace/api-client-react';
import { CloudRain, Wind, Droplets, Sun, MapPin, AlertTriangle, Sprout, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/format';
import { DistrictCitySelector } from '@/components/district-city-selector';
import { useLanguage } from '@/context/language-context';
import { translateName } from '@/lib/translations';

export default function WeatherPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const {
    selectedDistrict: contextDistrict,
    selectedCity: contextCity,
    setDistrict: setContextDistrict,
    setCity: setContextCity,
  } = useLocationContext();

  const selectedDistrict = contextDistrict === 'All' ? 'Amravati' : contextDistrict;
  const selectedCity = contextCity === 'All' ? '' : contextCity;

  const { data: current, isLoading: currentLoading, refetch } = useGetCurrentWeather(
    { location: selectedCity || selectedDistrict, district: selectedDistrict, city: selectedCity },
    { query: { queryKey: ['current-weather', selectedDistrict, selectedCity], refetchInterval: 10000, refetchOnMount: 'always' } }
  );

  const { data: forecast, isLoading: forecastLoading } = useGetWeatherForecast(
    { location: selectedCity || selectedDistrict, district: selectedDistrict, city: selectedCity },
    { query: { queryKey: ['weather-forecast', selectedDistrict, selectedCity], refetchInterval: 10000, refetchOnMount: 'always' } }
  );

  const { data: alerts } = useGetWeatherAlerts(
    { query: { queryKey: ['weather-alerts', selectedDistrict, selectedCity], refetchInterval: 10000, refetchOnMount: 'always' } }
  );

  return (
    <AppLayout>
      <PageHeader 
        title={isMarathi ? 'हवामान अंदाज आणि कृषी सल्ला' : 'Weather & Advisories'} 
        description={isMarathi ? 'महाराष्ट्रातील प्रत्येक जिल्हा व शहरासाठी हवामान अंदाज आणि सल्ला.' : 'Hyper-local real-time forecasting for every District & City in Maharashtra.'}
        accentColor="border-sky-500"
        actions={
          <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            {isMarathi ? 'थेट हवामान अंदाज (Open-Meteo सक्रिय)' : 'No API Key Required (Open-Meteo Active)'}
          </div>
        }
      />

      {/* District & City Selector */}
      <div className="mb-6">
        <DistrictCitySelector
          selectedDistrict={selectedDistrict}
          selectedCity={selectedCity}
          onDistrictChange={(d) => setContextDistrict(d || 'All')}
          onCityChange={(c) => setContextCity(c || 'All')}
        />
      </div>

      {Array.isArray(alerts) && alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-4 rounded-xl border flex gap-4 ${
              alert.severity === 'severe' ? 'bg-red-50 border-red-200 text-red-900' :
              alert.severity === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
              'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${
                alert.severity === 'severe' ? 'text-red-600' :
                alert.severity === 'warning' ? 'text-amber-600' :
                'text-blue-600'
              }`} />
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  {isMarathi && (alert as any).titleMr ? (alert as any).titleMr : translateName(alert.title, language)}
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full font-bold bg-white/50 border border-black/10">
                    {isMarathi ? ((alert.severity as string) === 'severe' ? 'गंभीर' : (alert.severity as string) === 'warning' ? 'इशारा' : 'माहिती') : alert.severity}
                  </span>
                </h3>
                <p className="mt-1 text-sm opacity-90">{isMarathi && (alert as any).descriptionMr ? (alert as any).descriptionMr : translateName(alert.description, language)}</p>
                <p className="mt-2 text-xs font-mono opacity-80">
                  {isMarathi ? 'मुदत शेवट:' : 'Valid until:'} {formatDate(alert.validUntil)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-2xl mb-8"></div>
      ) : current ? (
        <div 
          className="relative text-white rounded-2xl p-5 sm:p-6 md:p-8 mb-8 overflow-hidden shadow-2xl bg-cover bg-center border border-emerald-800/40 min-h-[220px] transition-all"
          style={{ backgroundImage: `linear-gradient(to right, rgba(8, 42, 25, 0.85), rgba(12, 58, 35, 0.72)), url('/images/weather_farm_bg.png')` }}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-white/95 font-medium mb-3">
                <MapPin className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="text-base sm:text-lg font-bold tracking-tight">{translateName(current.location, language)}</span>
                <button 
                  onClick={() => refetch()} 
                  title={isMarathi ? 'हवामान डेटा अपडेट करा' : 'Refresh Weather Data'}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors ml-1 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-white/80" />
                </button>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-5xl sm:text-6xl md:text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
                  {current.temperature}°
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-semibold mb-0.5 text-white drop-shadow-sm">{translateName(current.condition, language)}</div>
                  <div className="text-xs sm:text-sm text-white/85">{isMarathi ? 'जाणवणारे तापमान' : 'Feels like'} {current.feelsLike}°</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-8 pt-2 md:pt-0 border-t md:border-t-0 border-white/15">
              <div className="bg-black/20 md:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="flex items-center gap-1.5 text-white/85 mb-1 text-xs sm:text-sm"><Droplets className="w-4 h-4 text-sky-300"/> {isMarathi ? 'आर्द्रता' : 'Humidity'}</div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">{current.humidity}%</div>
              </div>
              <div className="bg-black/20 md:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="flex items-center gap-1.5 text-white/85 mb-1 text-xs sm:text-sm"><Wind className="w-4 h-4 text-teal-300"/> {isMarathi ? 'वाऱ्याचा वेग' : 'Wind'}</div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">{current.windSpeed} <span className="text-xs font-normal">किमी/तास</span> <span className="text-xs font-sans text-white/80">{current.windDirection}</span></div>
              </div>
              <div className="bg-black/20 md:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="flex items-center gap-1.5 text-white/85 mb-1 text-xs sm:text-sm"><CloudRain className="w-4 h-4 text-blue-300"/> {isMarathi ? 'पाऊस' : 'Rain'}</div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">{current.rainfall} <span className="text-xs font-normal">मिमी</span></div>
              </div>
              <div className="bg-black/20 md:bg-transparent p-2.5 sm:p-0 rounded-xl">
                <div className="flex items-center gap-1.5 text-white/85 mb-1 text-xs sm:text-sm"><Sprout className="w-4 h-4 text-emerald-300"/> {isMarathi ? 'मातीतील ओलावा' : 'Soil Moisture'}</div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">{current.soilMoisture !== null ? `${current.soilMoisture}%` : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <h2 className="text-xl font-bold mb-4">{isMarathi ? '७ दिवसांचा हवामान अंदाज आणि कृषी सल्ला' : '7-Day Forecast & Advisories'}</h2>
      <div className="space-y-4">
        {forecastLoading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl"></div>)
        ) : Array.isArray(forecast) && forecast.length > 0 ? (
          forecast.map((day, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={day.date} 
              className="bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center hover:border-sky-400 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between md:w-48 shrink-0">
                <div>
                  <div className="font-bold text-lg">{i === 0 ? (isMarathi ? 'आज' : 'Today') : i === 1 ? (isMarathi ? 'उद्या' : 'Tomorrow') : translateName(day.dayOfWeek, language)}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(day.date)}</div>
                </div>
                <div className="md:hidden">
                  <div className="font-mono font-bold text-xl">{day.high}° <span className="text-muted-foreground text-sm">{day.low}°</span></div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:w-32 shrink-0">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  {(day.conditionCode || '').toLowerCase().includes('rain') ? <CloudRain className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                </div>
                <div className="font-medium">{translateName(day.condition, language)}</div>
              </div>

              <div className="hidden md:block w-24 shrink-0 font-mono font-bold text-xl text-center">
                {day.high}° <span className="text-muted-foreground text-sm font-normal">{day.low}°</span>
              </div>

              <div className="flex-1 bg-accent/30 p-3 rounded-lg border border-accent">
                <div className="flex items-start gap-2">
                  <Sprout className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{translateName(day.farmingAdvice, language)}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : null}
      </div>
    </AppLayout>
  );
}
