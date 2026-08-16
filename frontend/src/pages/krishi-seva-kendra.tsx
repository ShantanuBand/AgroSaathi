import React, { useEffect, useState } from 'react';
import { useLocationContext } from '@/context/location-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { 
  Store, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Sprout, 
  ShieldCheck, 
  Layers, 
  CheckCircle, 
  Star,
  Wrench
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateName } from '@/lib/translations';

export interface KrishiSevaKendraItem {
  id: string;
  name: string;
  dealerName: string;
  licenseNumber: string;
  address: string;
  district: string;
  taluka: string;
  lat: number;
  lng: number;
  contactNumber: string;
  workingHours: string;
  availableSeeds: string[];
  availableFertilizers: string[];
  availablePesticides: string[];
  availableEquipment: string[];
  inStock: boolean;
  rating: number;
}

export default function KrishiSevaKendraPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const {
    selectedDistrict,
    selectedCity: selectedTaluka,
    districtsList,
    citiesList: availableTalukas,
    setDistrict: handleDistrictChange,
    setCity: setSelectedTaluka,
    resetLocation,
  } = useLocationContext();

  const [kendras, setKendras] = useState<KrishiSevaKendraItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Equipment'>('All');

  // Fetch kendras whenever location or search query changes
  useEffect(() => {
    fetchKendras();
  }, [selectedDistrict, selectedTaluka, searchQuery]);

  const fetchKendras = async () => {
    try {
      let url = '/api/services/krishi-seva-kendras?';
      if (selectedDistrict !== 'All') url += `district=${encodeURIComponent(selectedDistrict)}&`;
      if (selectedTaluka !== 'All') url += `taluka=${encodeURIComponent(selectedTaluka)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setKendras(data);
      }
    } catch (e) {
      console.error('Failed to fetch Krishi Seva Kendras:', e);
    }
  };

  // Filter kendras client-side for immediate precision
  const filteredKendras = React.useMemo(() => {
    return kendras.filter(k => {
      if (selectedDistrict !== 'All') {
        const dKey = selectedDistrict.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
        if (!k.district.toLowerCase().includes(dKey)) return false;
      }
      if (selectedTaluka !== 'All') {
        const tKey = selectedTaluka.toLowerCase().trim();
        const matchTaluka = k.taluka.toLowerCase().includes(tKey) || tKey.includes(k.taluka.toLowerCase());
        const matchAddress = k.address.toLowerCase().includes(tKey);
        if (!matchTaluka && !matchAddress) return false;
      }
      if (activeCategory === 'Seeds' && k.availableSeeds.length === 0) return false;
      if (activeCategory === 'Fertilizers' && k.availableFertilizers.length === 0) return false;
      if (activeCategory === 'Pesticides' && k.availablePesticides.length === 0) return false;
      if (activeCategory === 'Equipment' && k.availableEquipment.length === 0) return false;

      return true;
    });
  }, [kendras, selectedDistrict, selectedTaluka, activeCategory]);

  return (
    <AppLayout>
      <div className="space-y-6 font-sans">
        <PageHeader 
          title={isMarathi ? 'कृषी सेवा केंद्र व कृषी निविष्ठा विक्रेते' : 'Krishi Seva Kendras & Agri-Input Dealers'} 
          description={isMarathi ? 'तुमच्या शहरातील प्रमाणित बियाणे केंद्रे, खत विक्रेते, कीटकनाशक दुकाने आणि शेती अवजारे दुकाने शोधा.' : 'Locate verified seed centers, fertilizer dealers, pesticide shops & farming equipment stores in your city.'}
          accentColor="border-emerald-500"
        />

        {/* Search & Filter Toolbar */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={isMarathi ? 'दुकानाचे नाव, डीलरचे नाव किंवा ठिकाणाने शोधा...' : 'Search by store name, dealer name, or location...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
            {/* District Selector */}
            <div className="relative w-full sm:w-auto flex-1 sm:flex-initial">
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-xs font-bold text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">{isMarathi ? 'सर्व ३६ जिल्हे' : 'All Districts'}</option>
                {districtsList.map(d => (
                  <option key={d} value={d}>{translateName(d, language)}</option>
                ))}
              </select>
            </div>

            {/* Particular City / Taluka Selector */}
            <div className="relative w-full sm:w-auto flex-1 sm:flex-initial">
              <select
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  selectedTaluka !== 'All'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-muted/40 border-input text-foreground'
                }`}
              >
                <option value="All">
                  {selectedDistrict === 'All' 
                    ? (isMarathi ? 'सर्व शहरे / तालुके' : 'All Cities / Talukas') 
                    : (isMarathi ? `${translateName(selectedDistrict, language)} मधील सर्व शहरे` : `All Cities in ${selectedDistrict}`)}
                </option>
                {availableTalukas.map(t => (
                  <option key={t} value={t}>{translateName(t, language)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Location Status Bar */}
        {(selectedDistrict !== 'All' || selectedTaluka !== 'All') && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isMarathi ? 'येथील कृषी सेवा केंद्रे दाखवत आहे: ' : 'Showing Krishi Kendras in: '}
                <span className="font-bold">
                  {selectedTaluka !== 'All' ? translateName(selectedTaluka, language) : (isMarathi ? 'सर्व शहरे' : 'All Cities')}
                </span>
                {selectedDistrict !== 'All' && (
                  <span>, <span className="font-bold">{translateName(selectedDistrict, language)} {isMarathi ? 'जिल्हा' : 'District'}</span></span>
                )}
              </span>
            </div>
            <button
              onClick={() => {
                resetLocation();
              }}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 cursor-pointer ml-2"
            >
              {isMarathi ? 'स्थान रीसेट करा' : 'Reset Location'}
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'All', label: isMarathi ? 'सर्व निविष्ठा' : 'All Supplies', icon: Store },
            { id: 'Seeds', label: isMarathi ? 'प्रमाणित बियाणे' : 'Certified Seeds', icon: Sprout },
            { id: 'Fertilizers', label: isMarathi ? 'खते व पोषक घटक' : 'Fertilizers & Bio-NPK', icon: Layers },
            { id: 'Pesticides', label: isMarathi ? 'कीटकनाशके व औषधे' : 'Crop Protection & Pesticides', icon: ShieldCheck },
            { id: 'Equipment', label: isMarathi ? 'शेती अवजारे' : 'Farm Tools & Equipment', icon: Wrench },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' 
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredKendras.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Store className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isMarathi ? 'कोणतेही कृषी सेवा केंद्र आढळले नाही' : 'No Krishi Seva Kendras Found'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {isMarathi 
                  ? `तुमच्या शोधाशी जुळणारे कृषी निविष्ठा विक्रेते आढळले नाहीत. कृपया दुसरे शहर निवडा किंवा शोध बदला.`
                  : `No agricultural dealers found matching your search query. Try selecting a different city or clearing your filters.`}
              </p>
            </div>
            <button
              onClick={() => {
                resetLocation();
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
            >
              {isMarathi ? 'सर्व कृषी सेवा केंद्रे पहा' : 'Show All Krishi Seva Kendras'}
            </button>
          </div>
        ) : (
          /* Kendras List Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKendras.map((kendra) => (
              <div key={kendra.id} className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-foreground">{translateName(kendra.name, language)}</h3>
                        <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {isMarathi ? 'परवानाधारक' : 'Licensed'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{isMarathi ? 'विक्रेते:' : 'Dealer:'} <span className="font-semibold text-foreground">{translateName(kendra.dealerName, language)}</span> • {isMarathi ? 'परवाना:' : 'Lic:'} <span className="font-mono">{kendra.licenseNumber}</span></p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {kendra.rating}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {translateName(kendra.address, language)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> {translateName(kendra.workingHours, language)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {kendra.contactNumber}
                    </div>
                  </div>

                  {/* Available Inventory Stock Tags */}
                  <div className="pt-2 border-t border-border space-y-2">
                    {(activeCategory === 'All' || activeCategory === 'Seeds') && kendra.availableSeeds.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{isMarathi ? '🌱 दुकानात उपलब्ध बियाणे' : '🌱 Certified Seeds in Stock'}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {kendra.availableSeeds.map((seed, i) => (
                            <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-500/20">
                              {translateName(seed, language)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(activeCategory === 'All' || activeCategory === 'Fertilizers') && kendra.availableFertilizers.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{isMarathi ? '🧪 उपलब्ध खते व पोषक घटक' : '🧪 Fertilizers & Bio-Nutrients'}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {kendra.availableFertilizers.map((fert, i) => (
                            <span key={i} className="px-2.5 py-1 bg-sky-500/10 text-sky-800 dark:text-sky-300 text-[11px] font-bold rounded-lg border border-sky-500/20">
                              {translateName(fert, language)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <a
                    href={`tel:${kendra.contactNumber}`}
                    className="flex-1 py-2.5 px-3 bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> {isMarathi ? 'विक्रेत्याला फोन करा' : 'Call Dealer'}
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${kendra.lat},${kendra.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> {isMarathi ? 'नकाशावर रस्ता पहा' : 'Navigate'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
