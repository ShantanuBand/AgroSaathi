import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useGetCurrentWeather, useGetWeatherForecast, useGetWeatherAlerts } from '@workspace/api-client-react';
import { CloudRain, Wind, Droplets, Sun, MapPin, AlertTriangle, ThermometerSun, Eye, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/format';

export default function WeatherPage() {
  const { data: current, isLoading: currentLoading } = useGetCurrentWeather({ query: { queryKey: ['current-weather'] } });
  const { data: forecast, isLoading: forecastLoading } = useGetWeatherForecast({ query: { queryKey: ['weather-forecast'] } });
  const { data: alerts } = useGetWeatherAlerts({ query: { queryKey: ['weather-alerts'] } });

  return (
    <AppLayout>
      <PageHeader 
        title="Weather & Advisories" 
        description="Hyper-local forecasting for your farm."
      />

      {alerts && alerts.length > 0 && (
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
                  {alert.title}
                  <span className="text-xs uppercase px-2 py-0.5 rounded-full font-bold bg-white/50 border border-black/10">
                    {alert.severity}
                  </span>
                </h3>
                <p className="mt-1 text-sm opacity-90">{alert.description}</p>
                <p className="mt-2 text-xs font-mono opacity-80">
                  Valid until: {formatDate(alert.validUntil)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-2xl mb-8"></div>
      ) : current ? (
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-primary-foreground/80 font-medium mb-4">
                <MapPin className="w-5 h-5" />
                {current.location}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-7xl font-bold font-mono tracking-tighter">
                  {current.temperature}°
                </div>
                <div>
                  <div className="text-2xl font-semibold mb-1">{current.condition}</div>
                  <div className="text-primary-foreground/80">Feels like {current.feelsLike}°</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/70 mb-1 text-sm"><Droplets className="w-4 h-4"/> Humidity</div>
                <div className="font-mono text-xl font-semibold">{current.humidity}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/70 mb-1 text-sm"><Wind className="w-4 h-4"/> Wind</div>
                <div className="font-mono text-xl font-semibold">{current.windSpeed} km/h <span className="text-sm font-sans">{current.windDirection}</span></div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/70 mb-1 text-sm"><CloudRain className="w-4 h-4"/> Rain</div>
                <div className="font-mono text-xl font-semibold">{current.rainfall} mm</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/70 mb-1 text-sm"><Sprout className="w-4 h-4"/> Soil Moisture</div>
                <div className="font-mono text-xl font-semibold">{current.soilMoisture !== null ? `${current.soilMoisture}%` : 'N/A'}</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
        </div>
      ) : null}

      <h2 className="text-xl font-bold mb-4">7-Day Forecast & Advisories</h2>
      <div className="space-y-4">
        {forecastLoading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl"></div>)
        ) : forecast ? (
          forecast.map((day, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={day.date} 
              className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between md:w-48 shrink-0">
                <div>
                  <div className="font-bold text-lg">{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.dayOfWeek}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(day.date)}</div>
                </div>
                <div className="md:hidden">
                  <div className="font-mono font-bold text-xl">{day.high}° <span className="text-muted-foreground text-sm">{day.low}°</span></div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:w-32 shrink-0">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  {day.conditionCode.includes('rain') ? <CloudRain className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                </div>
                <div className="font-medium">{day.condition}</div>
              </div>

              <div className="hidden md:block w-24 shrink-0 font-mono font-bold text-xl text-center">
                {day.high}° <span className="text-muted-foreground text-sm font-normal">{day.low}°</span>
              </div>

              <div className="flex-1 bg-accent/30 p-3 rounded-lg border border-accent">
                <div className="flex items-start gap-2">
                  <Sprout className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{day.farmingAdvice}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : null}
      </div>
    </AppLayout>
  );
}
