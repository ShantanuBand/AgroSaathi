import React from 'react';
import { MapPin, Building2, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { MARATHI_DICTIONARY } from '@/lib/translations';

export interface District {
  id: string;
  name: string;
  state: string;
  division: string;
  cityCount: number;
}

export interface City {
  id: string;
  districtId: string;
  districtName: string;
  name: string;
  nameHindi?: string;
  isMandiCenter: boolean;
}

interface LocationSelectorProps {
  selectedDistrict: string;
  selectedCity: string;
  onDistrictChange: (district: string) => void;
  onCityChange: (city: string) => void;
}

export function DistrictCitySelector({
  selectedDistrict,
  selectedCity,
  onDistrictChange,
  onCityChange,
}: LocationSelectorProps) {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const [districts, setDistricts] = React.useState<District[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  const [loadingDistricts, setLoadingDistricts] = React.useState(true);
  const [loadingCities, setLoadingCities] = React.useState(false);

  // Fetch all districts on mount
  React.useEffect(() => {
    fetch('/api/locations/districts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDistricts(data);
        }
      })
      .catch((err) => console.error('Failed to load districts:', err))
      .finally(() => setLoadingDistricts(false));
  }, []);

  // Fetch cities when selectedDistrict changes
  React.useEffect(() => {
    if (!selectedDistrict) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    fetch(`/api/locations/districts/${selectedDistrict}/cities`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);
        } else {
          setCities([]);
        }
      })
      .catch((err) => console.error('Failed to load cities:', err))
      .finally(() => setLoadingCities(false));
  }, [selectedDistrict]);

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onDistrictChange(val);
    onCityChange(''); // Reset city when district changes
  };

  const getDistrictDisplay = (name: string): string => {
    if (!isMarathi) return name;
    return MARATHI_DICTIONARY[name] || name;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-card border border-border p-3 rounded-2xl shadow-xs w-full">
      {/* District Dropdown */}
      <div className="relative flex-1 w-full">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          <MapPin className="w-3.5 h-3.5 text-primary" /> {isMarathi ? 'जिल्हा निवडा' : 'District / जिल्हा'}
        </div>
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={handleDistrictSelect}
            className="w-full bg-muted/50 hover:bg-muted font-bold text-foreground border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer pr-8 transition-colors"
            disabled={loadingDistricts}
          >
            <option value="">{isMarathi ? 'जिल्हा निवडा (सर्व महाराष्ट्र)' : 'Select District (All Maharashtra)'}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {getDistrictDisplay(d.name)} ({d.cityCount} {isMarathi ? 'मंड्या/शहरे' : 'Mandis/Cities'})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* City / Taluka / Mandi Dropdown */}
      <div className="relative flex-1 w-full">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          <Building2 className="w-3.5 h-3.5 text-primary" /> {isMarathi ? 'शहर / तालुका / मंडी' : 'City / Taluka / मंडी'}
        </div>
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full bg-muted/50 hover:bg-muted font-bold text-foreground border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer pr-8 transition-colors disabled:opacity-60"
            disabled={!selectedDistrict || loadingCities}
          >
            <option value="">
              {!selectedDistrict 
                ? (isMarathi ? 'आधी जिल्हा निवडा' : 'Select a District first') 
                : cities.length === 0 
                ? (isMarathi ? `येथील सर्व शहरे: ${getDistrictDisplay(selectedDistrict)}` : `All Cities / Mandis in ${selectedDistrict}`) 
                : (isMarathi ? `येथील सर्व शहरे: ${getDistrictDisplay(selectedDistrict)}` : `All Cities in ${selectedDistrict}`)}
            </option>
            {cities.map((c) => {
              const displayName = isMarathi ? (c.nameHindi || MARATHI_DICTIONARY[c.name] || c.name) : c.name;
              return (
                <option key={c.id} value={c.name}>
                  {displayName} {c.isMandiCenter ? (isMarathi ? '🌾 मंडी' : '🌾 Mandi') : ''}
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

