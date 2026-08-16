import React from 'react';
import { useLocationContext } from '@/context/location-context';
import { useLanguage } from '@/context/language-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { useListCropPrices, useGetCropPriceSummary, useGetCropPriceHistory, type CropPrice } from '@workspace/api-client-react';
import { formatCurrency, getTodayDateString } from '@/lib/format';
import { TrendingDown, TrendingUp, Search, X, LineChart as LineChartIcon, MapPin, ShieldCheck, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DistrictCitySelector } from '@/components/district-city-selector';
import { translateName } from '@/lib/translations';

// Extended type for AGMARKNET fields
export interface AgmarknetCropPrice extends CropPrice {
  commodity?: string;
  variety?: string;
  grade?: string;
  arrivals?: string;
  arrivalDate?: string;
  modalPrice?: number;
  district?: string;
  isAgmarknetVerified?: boolean;
  mspPrice?: number;
}

function PriceHistoryModal({ crop, onClose }: { crop: AgmarknetCropPrice; onClose: () => void }) {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const { data: history, isLoading } = useGetCropPriceHistory(
    crop.id,
    { query: { queryKey: ['crop-price-history', crop.id] } }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {isMarathi ? 'ॲगमार्कनेट प्रमाणित' : 'AGMARKNET Verified'}
              </span>
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" /> {translateName(crop.market, language)}, {translateName(crop.district || crop.state, language)}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-1 text-foreground">
              {translateName(crop.cropName, language)} {crop.cropNameHindi && <span className="text-sm font-normal text-muted-foreground">({crop.cropNameHindi})</span>}
            </h2>
            <div className="text-xs text-muted-foreground mt-0.5">
              {isMarathi ? 'वाण:' : 'Variety:'} <strong className="text-foreground">{translateName(crop.variety || 'Local', language)}</strong> | {isMarathi ? 'दर्जा:' : 'Grade:'} <strong className="text-foreground">{crop.grade || 'FAQ'}</strong> | {isMarathi ? 'आवक:' : 'Arrivals:'} <strong className="text-foreground">{crop.arrivals || 'N/A'}</strong> | {isMarathi ? 'तारीख:' : 'Date:'} <strong className="text-emerald-700 dark:text-emerald-300">{crop.arrivalDate && crop.arrivalDate !== '29/07/2026' ? crop.arrivalDate : getTodayDateString(language)}</strong>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 bg-muted/40 p-4 rounded-xl border border-border">
            <div>
              <div className="text-xs text-muted-foreground">{isMarathi ? 'प्रचलित भाव (Modal Price)' : 'AGMARKNET Modal Price'}</div>
              <div className="font-mono font-bold text-xl text-primary">{formatCurrency(crop.modalPrice || crop.currentPrice)} <span className="text-xs font-normal text-muted-foreground">/{translateName(crop.unit, language)}</span></div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{isMarathi ? 'किमान / कमाल भाव श्रेणी' : 'Min / Max Range'}</div>
              <div className="font-mono font-bold text-sm text-foreground mt-1">
                {formatCurrency(crop.minPrice)} – {formatCurrency(crop.maxPrice)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{isMarathi ? 'दैनिक भाव कल' : 'Daily Trend'}</div>
              <div className={`font-mono font-bold text-base flex items-center gap-1 ${crop.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {crop.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {crop.changePercent >= 0 ? '+' : ''}{crop.changePercent}%
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-primary" /> {isMarathi ? '३० दिवसांचा एपीएमसी भाव इतिहास (₹/क्विंटल)' : '30-Day APMC Price Trend (₹/quintal)'}
            </h3>
            
            {isLoading ? (
              <div className="h-64 bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">
                {isMarathi ? 'भाव इतिहास लोड होत आहे...' : 'Loading AGMARKNET price history...'}
              </div>
            ) : Array.isArray(history) && history.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val: number) => [`₹${val}/क्विंटल`, isMarathi ? 'प्रचलित भाव' : 'Modal Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-xl">
                {isMarathi ? 'इतिहास माहिती उपलब्ध नाही.' : 'No historical data available.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const {
    selectedDistrict: contextDistrict,
    selectedCity: contextCity,
    setDistrict: setContextDistrict,
    setCity: setContextCity,
  } = useLocationContext();

  const selectedDistrict = contextDistrict === 'All' ? '' : contextDistrict;
  const selectedCity = contextCity === 'All' ? '' : contextCity;

  const [search, setSearch] = React.useState<string>('');
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [selectedCrop, setSelectedCrop] = React.useState<AgmarknetCropPrice | null>(null);

  const { data: rawCropPrices, isLoading } = useListCropPrices(
    { category, search: search || undefined, district: selectedDistrict || undefined },
    { 
      query: { 
        queryKey: ['crop-prices', category, search, selectedDistrict],
        refetchInterval: 15000,
        refetchOnMount: 'always',
      } 
    }
  );

  const cropPrices = rawCropPrices as AgmarknetCropPrice[] | undefined;

  const { data: summary } = useGetCropPriceSummary(
    { 
      query: { 
        queryKey: ['crop-price-summary'],
        refetchInterval: 15000,
        refetchOnMount: 'always',
      } 
    }
  );

  const filteredCrops = React.useMemo(() => {
    if (!Array.isArray(cropPrices)) return [];
    return cropPrices.filter(c => {
      if (selectedCity && !c.market.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
      if (selectedDistrict && !c.market.toLowerCase().includes(selectedDistrict.toLowerCase()) && !c.state.toLowerCase().includes(selectedDistrict.toLowerCase()) && !(c.district && c.district.toLowerCase().includes(selectedDistrict.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [cropPrices, selectedDistrict, selectedCity]);

  return (
    <AppLayout>
      <PageHeader 
        title={isMarathi ? 'ॲगमार्कनेट — अधिकृत एपीएमसी बाजार पोर्टल' : 'AGMARKNET — Official APMC Market Portal'} 
        description={isMarathi ? 'महाराष्ट्रातील दैनिक शासकीय बाजार भाव, प्रचलित भाव, आवक व श्रेणी.' : 'Daily government Mandi rates, Modal prices, variety grades & arrival volumes across India.'}
        accentColor="border-amber-500"
      />

      {/* Official AGMARKNET Header Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm">{isMarathi ? 'ॲगमार्कNET शासकीय डेटाबेस जोडला आहे' : 'AGMARKNET Govt Database Connected'}</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-600 text-white rounded-full">{isMarathi ? 'थेट बाजार भाव' : 'LIVE DATA'}</span>
              <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {isMarathi ? `तारीख: ${getTodayDateString('mr')}` : `Date: ${getTodayDateString('en')}`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isMarathi ? 'कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार अधिकृत डेटा.' : 'Official Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare data.'}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300/60 shrink-0">
          Source: agmarknet.gov.in
        </div>
      </div>

      {/* District & City Filter */}
      <div className="mb-6">
        <DistrictCitySelector
          selectedDistrict={selectedDistrict}
          selectedCity={selectedCity}
          onDistrictChange={(d) => setContextDistrict(d || 'All')}
          onCityChange={(c) => setContextCity(c || 'All')}
        />
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-cyan-50/90 dark:bg-cyan-950/40 border border-cyan-200/90 dark:border-cyan-800 p-4.5 rounded-2xl shadow-sm">
            <div className="text-xs text-cyan-800 dark:text-cyan-300 font-bold uppercase tracking-wider mb-1">{isMarathi ? 'ॲगमार्कनेट मंड्या' : 'AGMARKNET Mandis'}</div>
            <div className="text-3xl font-bold font-mono text-cyan-950 dark:text-cyan-100">
              {summary?.totalCrops ?? 0}
            </div>
          </div>

          <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800 p-4.5 rounded-2xl shadow-sm">
            <div className="text-xs text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-wider mb-1">{isMarathi ? 'सरासरी बाजार बदल' : 'Avg Market Change'}</div>
            <div className={`text-3xl font-bold font-mono flex items-center gap-2 ${(summary?.averageChange ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {(summary?.averageChange ?? 0) >= 0 ? '+' : ''}{(summary?.averageChange ?? 0).toFixed(1)}%
            </div>
          </div>

          <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800 p-4.5 rounded-2xl col-span-2 md:col-span-1 shadow-sm">
            <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400"/> {isMarathi ? 'सर्वाधिक वाढलेला शेतमाल' : 'Top Gainer'}
            </div>
            <div className="font-bold text-emerald-950 dark:text-emerald-100 text-xl truncate">{translateName(summary?.topGainers?.[0]?.cropName || 'Wheat', language)}</div>
            <div className="text-sm text-emerald-700 dark:text-emerald-400 font-mono font-bold mt-0.5">+{summary?.topGainers?.[0]?.changePercent ?? 0}%</div>
          </div>

          <div className="bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-800 p-4.5 rounded-2xl col-span-2 md:col-span-1 shadow-sm">
            <div className="text-xs text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400"/> {isMarathi ? 'सर्वाधिक घसरलेला शेतमाल' : 'Top Loser'}
            </div>
            <div className="font-bold text-rose-950 dark:text-rose-100 text-xl truncate">{translateName(summary?.topLosers?.[0]?.cropName || 'Onion', language)}</div>
            <div className="text-sm text-rose-700 dark:text-rose-400 font-mono font-bold mt-0.5">{summary?.topLosers?.[0]?.changePercent ?? 0}%</div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={isMarathi ? 'शेतमाल, वाण किंवा एपीएमसी मंडी शोधा...' : 'Search commodity, variety, or APMC mandi...'} 
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/40 font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 appearance-none cursor-pointer text-sm shadow-xs transition-colors"
            value={category || ''}
            onChange={(e) => setCategory(e.target.value || undefined)}
          >
            <option value="">{isMarathi ? 'सर्व वर्ग' : 'All Categories'}</option>
            <option value="Cereals">{isMarathi ? 'तृणधान्ये' : 'Cereals'}</option>
            <option value="Pulses">{isMarathi ? 'कडधान्ये' : 'Pulses'}</option>
            <option value="Vegetables">{isMarathi ? 'भाज्या' : 'Vegetables'}</option>
            <option value="Oilseeds">{isMarathi ? 'गळित धान्य' : 'Oilseeds'}</option>
            <option value="Fibre Crops">{isMarathi ? 'कापूस व तंतू पिके' : 'Fibre Crops'}</option>
            <option value="Fruits">{isMarathi ? 'फळे' : 'Fruits'}</option>
          </select>
        </div>
      </div>

      {/* AGMARKNET Mandi Rate Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase font-bold text-muted-foreground">
                <th className="p-4">{isMarathi ? 'शेतमाल / पिक' : 'Commodity / Crop'}</th>
                <th className="p-4">{isMarathi ? 'जात व दर्जा' : 'Variety & Grade'}</th>
                <th className="p-4">{isMarathi ? 'बाजार समिती / जिल्हा' : 'APMC Market / District'}</th>
                <th className="p-4 text-right">{isMarathi ? 'प्रचलित भाव (सरकारी)' : 'Modal Price (Govt)'}</th>
                <th className="p-4 text-right">{isMarathi ? 'किमान – कमाल भाव श्रेणी' : 'Min – Max Range'}</th>
                <th className="p-4 text-right">{isMarathi ? 'आजची आवक' : 'Daily Arrivals'}</th>
                <th className="p-4 text-center">{isMarathi ? 'ॲगमार्कनेट' : 'AGMARKNET'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm font-medium">
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-muted w-24 rounded"></div></td>
                    <td className="p-4"><div className="h-4 bg-muted w-24 rounded"></div></td>
                    <td className="p-4"><div className="h-4 bg-muted w-32 rounded"></div></td>
                    <td className="p-4"><div className="h-4 bg-muted w-16 ml-auto rounded"></div></td>
                    <td className="p-4"><div className="h-4 bg-muted w-24 ml-auto rounded"></div></td>
                    <td className="p-4"><div className="h-4 bg-muted w-16 ml-auto rounded"></div></td>
                    <td className="p-4"><div className="h-8 bg-muted w-20 mx-auto rounded-xl"></div></td>
                  </tr>
                ))
              ) : filteredCrops.length > 0 ? (
                filteredCrops.map(crop => (
                  <tr 
                    key={crop.id} 
                    onClick={() => setSelectedCrop(crop)}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        {translateName(crop.cropName, language)}
                        {crop.cropNameHindi && <span className="text-xs text-muted-foreground font-normal">({crop.cropNameHindi})</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{translateName(crop.category, language)}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-foreground text-xs">{translateName(crop.variety || 'Local', language)}</div>
                      <div className="text-[11px] text-muted-foreground">{isMarathi ? 'दर्जा:' : 'Grade:'} {crop.grade || 'FAQ'}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-foreground text-xs">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> {translateName(crop.market, language)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{translateName(crop.district || 'District', language)}, {translateName(crop.state, language)}</div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="font-mono font-bold text-base text-primary">{formatCurrency(crop.modalPrice || crop.currentPrice)}</div>
                      <div className="text-[10px] text-muted-foreground font-sans font-normal mb-1">{isMarathi ? 'प्रति' : 'Per'} {translateName(crop.unit, language)}</div>
                      {crop.mspPrice && (
                        <div className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded-sm border border-purple-200 dark:border-purple-800">
                          MSP: {formatCurrency(crop.mspPrice)}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right font-mono text-xs text-muted-foreground">
                      {formatCurrency(crop.minPrice)} – {formatCurrency(crop.maxPrice)}
                    </td>

                    <td className="p-4 text-right font-mono text-xs font-semibold text-foreground">
                      {crop.arrivals || '1,200 Qtl'}
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-sans flex items-center justify-end gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {crop.arrivalDate && crop.arrivalDate !== '29/07/2026' ? crop.arrivalDate : getTodayDateString(language)}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCrop(crop);
                        }}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 mx-auto border border-emerald-500/20"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> {isMarathi ? 'भाव इतिहास' : 'Trend'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    {isMarathi ? 'निवडलेल्या फिल्टरनुसार कोणतेही बाजार भाव आढळले नाहीत.' : 'No AGMARKNET mandi records found for selected filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCrop && (
        <PriceHistoryModal 
          crop={selectedCrop} 
          onClose={() => setSelectedCrop(null)} 
        />
      )}
    </AppLayout>
  );
}
