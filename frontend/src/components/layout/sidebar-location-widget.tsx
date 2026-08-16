import React from 'react';
import { MapPin, Building2, RotateCcw } from 'lucide-react';
import { useLocationContext } from '@/context/location-context';
import { useLanguage } from '@/context/language-context';
import { MARATHI_DICTIONARY } from '@/lib/translations';

export function SidebarLocationWidget() {
  const { language, t } = useLanguage();
  const isMarathi = language === 'mr';

  const {
    selectedDistrict,
    selectedCity,
    districtsList,
    citiesList,
    setDistrict,
    setCity,
    resetLocation,
  } = useLocationContext();

  const isFiltered = selectedDistrict !== 'All' || selectedCity !== 'All';

  const formatLocationName = (name: string): string => {
    if (!isMarathi) return name;
    return MARATHI_DICTIONARY[name] || name;
  };

  return (
    <div className="mx-3 mb-2 p-2.5 bg-card border border-sidebar-border rounded-xl space-y-1.5 shadow-xs shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] font-bold text-foreground uppercase tracking-wider">
          <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>{t('app.select_district', 'Location / स्थान')}</span>
        </div>
        {isFiltered && (
          <button
            onClick={resetLocation}
            title="Reset location filter"
            className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{t('app.reset_location', 'Reset')}</span>
          </button>
        )}
      </div>

      {/* District Dropdown */}
      <div className="relative">
        <select
          value={selectedDistrict}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full bg-muted/60 hover:bg-muted font-medium text-foreground border border-input rounded-md px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors"
        >
          <option value="All">{t('app.all_districts', 'All Districts (Maharashtra)')}</option>
          {districtsList.map((d) => (
            <option key={d} value={d}>
              {formatLocationName(d)}
            </option>
          ))}
        </select>
      </div>

      {/* City / Taluka Dropdown */}
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => setCity(e.target.value)}
          className={`w-full font-medium border rounded-md px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors ${
            selectedCity !== 'All'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-muted/60 border-input text-foreground hover:bg-muted'
          }`}
        >
          <option value="All">
            {selectedDistrict === 'All'
              ? (isMarathi ? 'सर्व शहरे / तालुके' : 'All Cities / Talukas')
              : (isMarathi ? `येथील सर्व शहरे: ${formatLocationName(selectedDistrict)}` : `All Cities in ${selectedDistrict}`)}
          </option>
          {citiesList.map((c) => (
            <option key={c} value={c}>
              {formatLocationName(c)}
            </option>
          ))}
        </select>
      </div>

      {isFiltered && (
        <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
          Filtered: <span className="font-bold">{formatLocationName(selectedCity !== 'All' ? selectedCity : selectedDistrict)}</span>
        </div>
      )}
    </div>
  );
}

