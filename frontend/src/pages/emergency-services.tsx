import React, { useEffect, useState } from 'react';
import { useLocationContext } from '@/context/location-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { 
  PhoneCall, 
  Search, 
  MapPin, 
  Clock, 
  Navigation, 
  Wrench, 
  Stethoscope, 
  Ambulance, 
  ShieldAlert, 
  Flame,
  Siren
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateName } from '@/lib/translations';

export interface EmergencyItem {
  id: string;
  name: string;
  category: "Tractor Repair" | "Tyre Repair" | "Veterinary Hospital" | "Hospital" | "Ambulance" | "Police" | "Fire Station";
  address: string;
  district: string;
  taluka: string;
  lat: number;
  lng: number;
  contactNumber: string;
  is24x7: boolean;
  workingHours: string;
}

export default function EmergencyServicesPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const { selectedDistrict, selectedCity } = useLocationContext();
  const [services, setServices] = useState<EmergencyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchServices();
  }, [selectedDistrict, selectedCity, selectedCategory, searchQuery]);

  const fetchServices = async () => {
    try {
      let url = '/api/services/emergency?';
      if (selectedDistrict !== 'All') url += `district=${encodeURIComponent(selectedDistrict)}&`;
      if (selectedCity !== 'All') url += `taluka=${encodeURIComponent(selectedCity)}&`;
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (e) {
      console.error('Failed to fetch Emergency Services:', e);
    }
  };

  // Client-side filtering fallback for instant accuracy
  const filteredServices = React.useMemo(() => {
    return services.filter(s => {
      if (selectedDistrict !== 'All') {
        const dKey = selectedDistrict.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
        if (!s.district.toLowerCase().includes(dKey)) return false;
      }
      if (selectedCity !== 'All') {
        const cKey = selectedCity.toLowerCase().trim();
        const matchTaluka = s.taluka.toLowerCase().includes(cKey) || cKey.includes(s.taluka.toLowerCase());
        const matchAddr = s.address.toLowerCase().includes(cKey);
        if (!matchTaluka && !matchAddr) return false;
      }
      if (selectedCategory !== 'All' && s.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [services, selectedDistrict, selectedCity, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tractor Repair':
      case 'Tyre Repair': return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'Veterinary Hospital': return <Stethoscope className="w-4 h-4 text-emerald-500" />;
      case 'Ambulance': return <Ambulance className="w-4 h-4 text-rose-500" />;
      case 'Police': return <ShieldAlert className="w-4 h-4 text-blue-500" />;
      case 'Fire Station': return <Flame className="w-4 h-4 text-orange-500" />;
      default: return <Siren className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-sans">
        <PageHeader 
          title={isMarathi ? 'ग्रामीण आपत्कालीन सेवा व ब्रेकडाउन मदत' : 'Rural Emergency Services & Breakdown Assistance'} 
          description={isMarathi ? 'ट्रॅक्टर मेकॅनिक, पशुवैद्यकीय डॉक्टर, रुग्णवाहिका व पोलीस स्टेशनसाठी २४ तास मदत नंबर.' : '24x7 Helpline numbers for Tractor Mechanics, Veterinary Doctors, Ambulance & Police Stations.'}
          accentColor="border-rose-500"
        />

        {/* Urgent Hotline Emergency Call Bar */}
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md shadow-rose-600/30 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base text-rose-700 dark:text-rose-400">{isMarathi ? 'जलद शोध' : 'Quick Filters'}</div>
              <div className="text-xs text-muted-foreground">{isMarathi ? 'तुमच्या जवळील २४ तास सेवा पाहण्यासाठी श्रेणी निवडा' : 'Select a category to view 24x7 local services'}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory('Tractor Repair')}
              className={`px-4 py-2 ${selectedCategory === 'Tractor Repair' ? 'bg-amber-600 text-white' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'} font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors`}
            >
              <Wrench className="w-3.5 h-3.5" /> {isMarathi ? 'ट्रॅक्टर दुरुस्ती' : 'Tractor Repair'}
            </button>
            <button 
              onClick={() => setSelectedCategory('Veterinary Hospital')}
              className={`px-4 py-2 ${selectedCategory === 'Veterinary Hospital' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'} font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> {isMarathi ? 'पशुवैद्यकीय दवाखाना' : 'Veterinary Hospital'}
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={isMarathi ? 'ट्रॅक्टर मेकॅनिक, पशुवैद्यकीय रुग्णालय, रुग्णवाहिका शोधा...' : 'Search tractor repair, vet hospital, ambulance station...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-xs font-bold text-foreground outline-none cursor-pointer w-full md:w-auto"
          >
            <option value="All">{isMarathi ? 'सर्व वर्ग' : 'All Categories'}</option>
            <option value="Tractor Repair">{isMarathi ? 'ट्रॅक्टर दुरुस्ती' : 'Tractor Repair'}</option>
            <option value="Veterinary Hospital">{isMarathi ? 'पशुवैद्यकीय दवाखाना' : 'Veterinary Hospital'}</option>
          </select>
        </div>

        {/* Services List Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <Wrench className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isMarathi ? 'कोणतीही आपत्कालीन मदत सेवा आढळली नाही' : 'No Emergency Assistance Found'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {isMarathi ? 'तुमच्या शोधाशी जुळणारे मेकॅनिक किंवा आपत्कालीन सेवा आढळल्या नाहीत.' : 'No breakdown mechanics or emergency services found matching your query.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
            <div key={service.id} className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(service.category)}
                      <span className="font-extrabold text-base text-foreground">{translateName(service.name, language)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {translateName(service.address, language)}
                    </div>
                  </div>
                  {service.is24x7 && (
                    <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase border border-emerald-500/20">
                      {isMarathi ? '२४ तास चालू' : '24x7 Active'}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> {translateName(service.workingHours, language)}
                  </span>
                  <span className="font-mono font-bold text-foreground">{service.contactNumber}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <a
                  href={`tel:${service.contactNumber}`}
                  className="flex-1 py-2.5 px-3 bg-rose-600 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> {isMarathi ? 'आत्ताच फोन करा' : 'Call Now'}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-card border border-input text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> {isMarathi ? 'नकाशावर रस्ता पहा' : 'Direct Route'}
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
