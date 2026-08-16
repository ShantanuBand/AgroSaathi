import React, { useEffect, useState } from 'react';
import { useLocationContext } from '@/context/location-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { 
  Landmark, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  UserCheck, 
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateName } from '@/lib/translations';

export interface GovOfficeItem {
  id: string;
  name: string;
  category: "Agriculture Department" | "Soil Testing Lab" | "Crop Insurance Office" | "PM-Kisan Centre" | "Subsidy Centre";
  address: string;
  district: string;
  taluka: string;
  lat: number;
  lng: number;
  contactNumber: string;
  officerInCharge: string;
  workingHours: string;
  servicesProvided: string[];
}

export default function GovOfficesPage() {
  const { language } = useLanguage();
  const isMarathi = language === 'mr';

  const { selectedDistrict, selectedCity } = useLocationContext();
  const [offices, setOffices] = useState<GovOfficeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchOffices();
  }, [selectedDistrict, selectedCity, selectedCategory, searchQuery]);

  const fetchOffices = async () => {
    try {
      let url = '/api/services/gov-offices?';
      if (selectedDistrict !== 'All') url += `district=${encodeURIComponent(selectedDistrict)}&`;
      if (selectedCity !== 'All') url += `taluka=${encodeURIComponent(selectedCity)}&`;
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOffices(data);
      }
    } catch (e) {
      console.error('Failed to fetch Gov Offices:', e);
    }
  };

  // Client-side filtering fallback for instant accuracy
  const filteredOffices = React.useMemo(() => {
    return offices.filter(g => {
      if (selectedDistrict !== 'All') {
        const dKey = selectedDistrict.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
        if (!g.district.toLowerCase().includes(dKey)) return false;
      }
      if (selectedCity !== 'All') {
        const cKey = selectedCity.toLowerCase().trim();
        const matchTaluka = g.taluka.toLowerCase().includes(cKey) || cKey.includes(g.taluka.toLowerCase());
        const matchAddr = g.address.toLowerCase().includes(cKey);
        if (!matchTaluka && !matchAddr) return false;
      }
      if (selectedCategory !== 'All' && g.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [offices, selectedDistrict, selectedCity, selectedCategory]);

  return (
    <AppLayout>
      <div className="space-y-6 font-sans">
        <PageHeader 
          title={isMarathi ? 'शासकीय कृषी कार्यालये व सेवा केंद्र' : 'Government Agricultural Offices & Service Centres'} 
          description={isMarathi ? 'तालुका कृषी कार्यालय, माती परीक्षण प्रयोगशाळा, पीएम-किसान व अनुदान सहाय्य केंद्र माहिती.' : 'Access Taluka Krishi Karyalaya, Soil Health Testing Labs, PM-Kisan & Subsidy Assistance Centres.'}
          accentColor="border-violet-500"
        />

        {/* Search & Filter Toolbar */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={isMarathi ? 'शासकीय कार्यालय, योजना सेवा किंवा अधिकाऱ्याचे नाव शोधा...' : 'Search government office, scheme service, or officer...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-xs font-bold text-foreground outline-none cursor-pointer w-full md:w-auto"
          >
            <option value="All">{isMarathi ? 'सर्व कार्यालये' : 'All Office Types'}</option>
            <option value="Agriculture Department">{isMarathi ? 'कृषी विभाग' : 'Agriculture Dept'}</option>
            <option value="Soil Testing Lab">{isMarathi ? 'माती परीक्षण प्रयोगशाळा' : 'Soil Testing Lab'}</option>
            <option value="Crop Insurance Office">{isMarathi ? 'पीक विमा कार्यालय' : 'Crop Insurance Office'}</option>
            <option value="PM-Kisan Centre">{isMarathi ? 'पीएम-किसान केंद्र' : 'PM-Kisan Centre'}</option>
          </select>
        </div>

        {/* Office Cards List */}
        {filteredOffices.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto text-violet-600">
              <Landmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isMarathi ? 'कोणतेही शासकीय कार्यालय आढळले नाही' : 'No Government Offices Found'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {isMarathi ? 'तुमच्या शोधाशी जुळणारे शासकीय कार्यालय आढळले नाही.' : 'No agricultural offices found matching your query.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOffices.map((office) => (
            <div key={office.id} className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-violet-500/10 text-violet-700 dark:text-violet-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {translateName(office.category, language)}
                    </span>
                    <h3 className="font-extrabold text-base text-foreground mt-2">{translateName(office.name, language)}</h3>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-violet-600" /> {translateName(office.officerInCharge, language)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-violet-600" /> {translateName(office.address, language)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-violet-600" /> {translateName(office.workingHours, language)}
                  </div>
                </div>

                {/* Key Farmer Services Provided */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{isMarathi ? '🏛️ पुरवल्या जाणाऱ्या सेवा व योजना' : '🏛️ Direct Services & Schemes Handled'}</div>
                  <div className="space-y-1">
                    {office.servicesProvided.map((service, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        <span>{translateName(service, language)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <a
                  href={`tel:${office.contactNumber}`}
                  className="flex-1 py-2.5 px-3 bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-violet-600" /> {isMarathi ? 'कार्यालयाशी संपर्क साधा' : 'Call Office'}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-violet-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-colors"
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
