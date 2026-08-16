import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocationContext } from '@/context/location-context';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/page-header';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Search, 
  Star, 
  Phone, 
  Clock, 
  CheckCircle, 
  BarChart3,
  X,
  Compass,
  Sprout,
  Store,
  Check,
  GripHorizontal
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export interface APMCItem {
  id: string;
  name: string;
  nameHindi: string;
  address: string;
  district: string;
  taluka: string;
  state: string;
  lat: number;
  lng: number;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalQty: string;
  primaryCommodities: string[];
  status: 'Open' | 'Closed';
  marketTimings: string;
  contactNumber: string;
  lastUpdated: string;
  history7Days: { date: string; modalPrice: number; minPrice: number; maxPrice: number }[];
  history30Days: { date: string; modalPrice: number; minPrice: number; maxPrice: number }[];
}

export interface KrishiShopItem {
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

// All 36 Districts of Maharashtra Center Coordinates
const MAHARASHTRA_DISTRICTS: Record<string, { lat: number; lng: number }> = {
  "Ahilyanagar (Ahmednagar)": { lat: 19.0948, lng: 74.7480 },
  "Akola": { lat: 20.7002, lng: 77.0082 },
  "Amravati": { lat: 20.9374, lng: 77.7796 },
  "Beed": { lat: 18.9892, lng: 75.7601 },
  "Bhandara": { lat: 21.1706, lng: 79.6549 },
  "Buldhana": { lat: 20.5293, lng: 76.1843 },
  "Chandrapur": { lat: 19.9615, lng: 79.2961 },
  "Chhatrapati Sambhajinagar": { lat: 19.8762, lng: 75.3433 },
  "Dharashiv": { lat: 18.1861, lng: 76.0419 },
  "Dhule": { lat: 20.9042, lng: 74.7749 },
  "Gadchiroli": { lat: 20.1849, lng: 79.9948 },
  "Gondia": { lat: 21.4624, lng: 80.1961 },
  "Hingoli": { lat: 19.7189, lng: 77.1475 },
  "Jalgaon": { lat: 21.0077, lng: 75.5626 },
  "Jalna": { lat: 19.8410, lng: 75.8864 },
  "Kolhapur": { lat: 16.7050, lng: 74.2433 },
  "Latur": { lat: 18.4088, lng: 76.5604 },
  "Mumbai City": { lat: 18.9388, lng: 72.8353 },
  "Mumbai Suburban": { lat: 19.1176, lng: 72.8481 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Nanded": { lat: 19.1383, lng: 77.3210 },
  "Nandurbar": { lat: 21.3739, lng: 74.2407 },
  "Nashik": { lat: 19.9975, lng: 73.7898 },
  "Palghar": { lat: 19.6967, lng: 72.7699 },
  "Parbhani": { lat: 19.2608, lng: 76.7749 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Raigad": { lat: 18.5158, lng: 73.1822 },
  "Ratnagiri": { lat: 16.9902, lng: 73.3120 },
  "Sangli": { lat: 16.8524, lng: 74.5815 },
  "Satara": { lat: 17.6805, lng: 74.0183 },
  "Sindhudurg": { lat: 16.1667, lng: 73.7167 },
  "Solapur": { lat: 17.6599, lng: 75.9064 },
  "Thane": { lat: 19.2183, lng: 72.9781 },
  "Wardha": { lat: 20.7453, lng: 78.6022 },
  "Washim": { lat: 20.1106, lng: 77.1333 },
  "Yavatmal": { lat: 20.3888, lng: 78.1204 }
};

const MAP_LAYERS = [
  { id: 'road', name: 'Standard Road', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap', maxNativeZoom: 19 },
  { id: 'satellite', name: 'Satellite View', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri World Imagery', maxNativeZoom: 18 },
  { id: 'hybrid', name: 'Humanitarian Detail', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap', maxNativeZoom: 19 },
  { id: 'dark', name: 'Dark Mode', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CARTO', maxNativeZoom: 19 },
  { id: 'light', name: 'Light Mode', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '&copy; CARTO', maxNativeZoom: 19 },
  { id: 'terrain', name: 'Terrain Topo', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenTopoMap', maxNativeZoom: 17 },
];

export default function APMCMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const {
    selectedDistrict,
    selectedCity,
    setDistrict: setContextDistrict,
    setCity: setContextCity,
  } = useLocationContext();

  const [allApmcs, setAllApmcs] = useState<APMCItem[]>([]);
  const [krishiShops, setKrishiShops] = useState<KrishiShopItem[]>([]);
  
  const [selectedAPMC, setSelectedAPMC] = useState<APMCItem | null>(null);
  const [selectedShop, setSelectedShop] = useState<KrishiShopItem | null>(null);
  const [detailModalAPMC, setDetailModalAPMC] = useState<APMCItem | null>(null);
  const [historyTab, setHistoryTab] = useState<'7day' | '30day'>('7day');
  
  const [activeLayer, setActiveLayer] = useState('road');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showKrishiShops, setShowKrishiShops] = useState(true); // Default enabled
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // User location state
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>({ lat: 20.8167, lng: 77.9667 });
  const [isLocating, setIsLocating] = useState(false);

  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [openOnly, setOpenOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Favourites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apmc_favorites');
      return saved ? JSON.parse(saved) : ['apmc_chandur_railway', 'apmc_amravati_main'];
    } catch {
      return ['apmc_chandur_railway'];
    }
  });

  useEffect(() => {
    localStorage.setItem('apmc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch APMCs & Krishi Shops from backend (with 15s real-time auto polling)
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedCommodity, openOnly, searchQuery]);

  const fetchData = async () => {
    try {
      // Fetch APMC Mandis
      let apmcUrl = '/api/services/apmcs?';
      if (selectedCommodity !== 'All') apmcUrl += `commodity=${encodeURIComponent(selectedCommodity)}&`;
      if (openOnly) apmcUrl += `openOnly=true&`;
      if (searchQuery) apmcUrl += `search=${encodeURIComponent(searchQuery)}&`;

      const apmcRes = await fetch(apmcUrl);
      if (apmcRes.ok) {
        const apmcData = await apmcRes.json();
        setAllApmcs(apmcData);
      }

      // Fetch Krishi Seva Kendras / Shops
      const shopRes = await fetch('/api/services/krishi-seva-kendras');
      if (shopRes.ok) {
        const shopData = await shopRes.json();
        setKrishiShops(shopData);
      }
    } catch (e) {
      console.error('Failed to load map data:', e);
    }
  };

  // Get available cities/mandis for selected district
  const availableCitiesForDistrict = React.useMemo(() => {
    if (selectedDistrict === 'All') return allApmcs;
    const dKey = selectedDistrict.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
    return allApmcs.filter(a => {
      const aDist = a.district.toLowerCase();
      return aDist.includes(dKey) || dKey.includes(aDist.split(' ')[0]);
    });
  }, [allApmcs, selectedDistrict]);

  // Handle District Change
  const handleDistrictChange = (distName: string) => {
    setContextDistrict(distName);
    setContextCity('All');
    setSearchQuery('');
    setSelectedAPMC(null);
    setSelectedShop(null);

    if (mapInstanceRef.current && (window as any).L) {
      const L = (window as any).L;
      if (distName === 'All') {
        mapInstanceRef.current.setView([19.7515, 75.7139], 7);
      } else {
        const dKey = distName.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
        const districtApmcs = allApmcs.filter(a => {
          const aDist = a.district.toLowerCase();
          return aDist.includes(dKey) || dKey.includes(aDist.split(' ')[0]);
        });
        if (districtApmcs.length > 0) {
          const latLngs = districtApmcs.map(a => [a.lat, a.lng]);
          const bounds = L.latLngBounds(latLngs);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } else if (MAHARASHTRA_DISTRICTS[distName]) {
          const coords = MAHARASHTRA_DISTRICTS[distName];
          mapInstanceRef.current.setView([coords.lat, coords.lng], 10);
        }
      }
    }
  };

  // Handle City Change
  const handleCityChange = (cityId: string) => {
    setContextCity(cityId);
    setSearchQuery('');

    if (cityId === 'All') {
      setSelectedAPMC(null);
      setSelectedShop(null);
      if (mapInstanceRef.current && (window as any).L) {
        const L = (window as any).L;
        const targets = availableCitiesForDistrict.length > 0 ? availableCitiesForDistrict : allApmcs;
        if (targets.length > 0) {
          const latLngs = targets.map(a => [a.lat, a.lng]);
          const bounds = L.latLngBounds(latLngs);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } else if (selectedDistrict !== 'All' && MAHARASHTRA_DISTRICTS[selectedDistrict]) {
          const coords = MAHARASHTRA_DISTRICTS[selectedDistrict];
          mapInstanceRef.current.setView([coords.lat, coords.lng], 10);
        }
      }
    } else {
      const foundApmc = allApmcs.find(a => a.id === cityId || a.taluka === cityId || a.name === cityId || a.id.endsWith(cityId));
      if (foundApmc) {
        setSelectedAPMC(foundApmc);
        setSelectedShop(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([foundApmc.lat, foundApmc.lng], 14);
        }
      }
    }
  };

  // Auto-detect Geolocation & Show Nearby Krishi Shops
  const detectLocation = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      setShowKrishiShops(true); // Automatically turn on Krishi Shops layer on live location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserPos(coords);
          setIsLocating(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 12);
          }
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    }
  };

  // Ensure Leaflet is loaded safely
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const checkLeaflet = () => {
      const L = (window as any).L;
      if (L) {
        setIsLeafletReady(true);
        return true;
      }
      return false;
    };

    if (!checkLeaflet()) {
      interval = setInterval(() => {
        if (checkLeaflet() && interval) {
          clearInterval(interval);
        }
      }, 150);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Initialize Map safely
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const initCoords = MAHARASHTRA_DISTRICTS[selectedDistrict] || { lat: 20.8167, lng: 77.9667 };
      const map = L.map(mapContainerRef.current, {
        center: [initCoords.lat, initCoords.lng],
        zoom: 11,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const initialLayerConfig = MAP_LAYERS.find(l => l.id === activeLayer) || MAP_LAYERS[0];
      const tileLayer = L.tileLayer(initialLayerConfig.url, {
        attribution: initialLayerConfig.attribution,
        maxNativeZoom: initialLayerConfig.maxNativeZoom || 18,
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, [isLeafletReady]);

  // Update Tile Layer
  useEffect(() => {
    const L = (window as any).L;
    if (mapInstanceRef.current && tileLayerRef.current && L) {
      const config = MAP_LAYERS.find(l => l.id === activeLayer) || MAP_LAYERS[0];
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxNativeZoom: config.maxNativeZoom || 18,
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  }, [activeLayer]);

  // Render Markers: APMCs + Krishi Seva Kendra Shops
  useEffect(() => {
    const L = (window as any).L;
    if (!mapInstanceRef.current || !markersGroupRef.current || !L) return;

    markersGroupRef.current.clearLayers();

    // Render User Location Ring
    if (userPos) {
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div class="w-6 h-6 bg-emerald-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center animate-pulse"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userPos.lat, userPos.lng], { icon: userIcon })
        .addTo(markersGroupRef.current)
        .bindTooltip('📍 Your Live Geolocation', { permanent: false, direction: 'top' });

      L.circle([userPos.lat, userPos.lng], {
        radius: 4000,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.12,
        weight: 1.5
      }).addTo(markersGroupRef.current);
    }

    // Filter APMC Mandis
    let displayApmcs = allApmcs;
    if (selectedDistrict !== 'All') {
      const dKey = selectedDistrict.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
      displayApmcs = displayApmcs.filter(a => {
        const aDist = a.district.toLowerCase();
        return aDist.includes(dKey) || dKey.includes(aDist.split(' ')[0]);
      });
    }
    if (selectedCity !== 'All') {
      displayApmcs = displayApmcs.filter(a => a.id === selectedCity || a.taluka === selectedCity || a.name === selectedCity);
    }

    // Render APMC Markers (Amber Pins)
    displayApmcs.forEach((apmc) => {
      const isFav = favorites.includes(apmc.id);
      const isSelected = selectedAPMC?.id === apmc.id;
      const labelName = apmc.name.split(' ')[0] || apmc.taluka;

      const markerIcon = L.divIcon({
        className: 'custom-apmc-pin',
        html: `
          <div class="cursor-pointer flex items-center gap-1.5 bg-amber-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md border-2 border-white transform hover:scale-110 transition-all ${isSelected ? 'ring-4 ring-amber-400 bg-amber-700 scale-110' : ''}">
            <span class="w-2 h-2 rounded-full bg-emerald-400 border border-white animate-ping"></span>
            <span class="truncate max-w-[90px]">🏢 ${labelName}</span>
            ${isFav ? '⭐' : ''}
          </div>
        `,
        iconSize: [100, 26],
        iconAnchor: [50, 13]
      });

      const marker = L.marker([apmc.lat, apmc.lng], { icon: markerIcon });
      marker.bindTooltip(`<b>${apmc.name}</b><br/>${apmc.address}<br/>Modal Rate: <b>₹${apmc.modalPrice}/Qtl</b>`, { permanent: false, direction: 'top' });

      marker.on('click', () => {
        setSelectedAPMC(apmc);
        setSelectedShop(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([apmc.lat, apmc.lng]);
        }
      });

      marker.addTo(markersGroupRef.current);
    });

    // Render Krishi Seva Kendras / Shops (Green Leaf Pins)
    if (showKrishiShops) {
      let displayShops = krishiShops;
      if (selectedDistrict !== 'All') {
        const dKey = selectedDistrict.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
        displayShops = displayShops.filter(s => s.district.toLowerCase().includes(dKey));
      }

      displayShops.forEach((shop) => {
        const isSelected = selectedShop?.id === shop.id;

        const shopIcon = L.divIcon({
          className: 'custom-krishi-shop-pin',
          html: `
            <div class="cursor-pointer flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md border-2 border-white transform hover:scale-110 transition-all ${isSelected ? 'ring-4 ring-emerald-400 bg-emerald-700 scale-110' : ''}">
              <span>🌱 ${shop.name.split(' ')[0]}</span>
            </div>
          `,
          iconSize: [90, 24],
          iconAnchor: [45, 12]
        });

        const marker = L.marker([shop.lat, shop.lng], { icon: shopIcon });
        marker.bindTooltip(`<b>🌱 ${shop.name}</b><br/>Dealer: ${shop.dealerName}<br/>Phone: ${shop.contactNumber}`, { permanent: false, direction: 'top' });

        marker.on('click', () => {
          setSelectedShop(shop);
          setSelectedAPMC(null);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([shop.lat, shop.lng]);
          }
        });

        marker.addTo(markersGroupRef.current);
      });
    }

  }, [allApmcs, krishiShops, showKrishiShops, selectedAPMC, selectedShop, favorites, userPos, isLeafletReady, selectedDistrict, selectedCity]);

  const calculateDistance = (lat: number, lng: number) => {
    if (!userPos) return 'N/A';
    const R = 6371;
    const dLat = ((lat - userPos.lat) * Math.PI) / 180;
    const dLon = ((lng - userPos.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userPos.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1) + ' km';
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <AppLayout>
      <div className="space-y-4 font-sans">
        <PageHeader 
          title="Maharashtra APMC Map & Krishi Seva Kendras" 
          description="Live location tracking displays APMC mandis and nearby Krishi Seva Kendra shops."
          accentColor="border-amber-500"
        />

        {/* Toolbar with Krishi Shops Toggle */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search APMC mandi, krishi shop, seed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Cascading Dropdowns & Layer Toggles */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              
              {/* District Selector */}
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="px-3.5 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 outline-none cursor-pointer"
              >
                <option value="All">🌐 All 36 Districts of MH</option>
                {Object.keys(MAHARASHTRA_DISTRICTS).map(dist => (
                  <option key={dist} value={dist}>📍 {dist}</option>
                ))}
              </select>

              {/* City Selector */}
              {selectedDistrict !== 'All' && (
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 outline-none cursor-pointer animate-in fade-in"
                >
                  <option value="All">🏙️ All Cities in {selectedDistrict}</option>
                  {availableCitiesForDistrict.map(apmc => (
                    <option key={apmc.id} value={apmc.id}>
                      🏢 {apmc.name} ({apmc.taluka})
                    </option>
                  ))}
                </select>
              )}

              {/* Toggle Krishi Shops Layer Button */}
              <button
                type="button"
                onClick={() => setShowKrishiShops(!showKrishiShops)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showKrishiShops ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' : 'bg-muted/40 border-input text-muted-foreground'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" /> 🌱 Krishi Shops {showKrishiShops && '✓'}
              </button>

            </div>

          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[420px] sm:h-[500px] md:h-[620px] rounded-2xl overflow-hidden border border-border shadow-md bg-muted/30">
          
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {!isLeafletReady && (
            <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-xs flex items-center justify-center">
              <div className="flex items-center gap-3 font-bold text-sm text-foreground">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                Loading Interactive Map...
              </div>
            </div>
          )}

          {/* Layer Switcher */}
          <div className="absolute top-4 right-4 z-10">
            <div className="relative">
              <button
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className="px-3.5 py-2.5 bg-card/95 backdrop-blur-md border border-border text-foreground rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 hover:bg-muted cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-500" /> Map Layers ▾
              </button>

              {showLayerMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-2 z-20 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">Select Map Style</div>
                  {MAP_LAYERS.map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => {
                        setActiveLayer(layer.id);
                        setShowLayerMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        activeLayer === layer.id ? 'bg-amber-500 text-white font-bold' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {layer.name}
                      {activeLayer === layer.id && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recenter & Live Tracking Button */}
          <div className="absolute bottom-6 left-4 z-10">
            <button
              onClick={detectLocation}
              disabled={isLocating}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl shadow-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Compass className={`w-4 h-4 text-white ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Locating...' : '📍 My Location & Nearby Shops'}
            </button>
          </div>

          {/* Selected APMC Floatable & Draggable Overlay */}
          {selectedAPMC && (
            <motion.div
              drag
              dragConstraints={mapContainerRef}
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute bottom-4 right-4 left-4 md:left-auto md:w-96 z-30 bg-card/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-5 shadow-2xl space-y-3 cursor-grab active:cursor-grabbing select-none"
            >
              {/* Drag Handle Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  <GripHorizontal className="w-3.5 h-3.5" /> Floatable Card (Drag Anywhere)
                </div>
                <button 
                  onClick={() => setSelectedAPMC(null)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  title="Close Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start justify-between pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-foreground">{selectedAPMC.name}</span>
                    <button onClick={() => toggleFavorite(selectedAPMC.id)} className="text-amber-500 cursor-pointer">
                      <Star className={`w-4 h-4 ${favorites.includes(selectedAPMC.id) ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {selectedAPMC.address}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-border text-center">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-bold uppercase text-amber-600">Modal Rate</div>
                  <div className="font-extrabold text-sm font-mono text-amber-700 dark:text-amber-400">₹{selectedAPMC.modalPrice}</div>
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">Min / Max</div>
                  <div className="font-bold text-xs font-mono">₹{selectedAPMC.minPrice} - ₹{selectedAPMC.maxPrice}</div>
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">Arrivals</div>
                  <div className="font-bold text-xs">{selectedAPMC.arrivalQty}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" /> {selectedAPMC.status} ({selectedAPMC.marketTimings})
                </span>
                <span className="font-bold text-foreground">📍 {calculateDistance(selectedAPMC.lat, selectedAPMC.lng)} away</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedAPMC.lat},${selectedAPMC.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </a>
                <button
                  onClick={() => setDetailModalAPMC(selectedAPMC)}
                  className="flex-1 py-2 px-3 bg-card border border-input text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-muted transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" /> View Details
                </button>
              </div>
            </motion.div>
          )}

          {/* Selected Krishi Shop Floatable & Draggable Overlay */}
          {selectedShop && (
            <motion.div
              drag
              dragConstraints={mapContainerRef}
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute bottom-4 right-4 left-4 md:left-auto md:w-96 z-30 bg-card/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-3 cursor-grab active:cursor-grabbing select-none"
            >
              {/* Drag Handle Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <GripHorizontal className="w-3.5 h-3.5" /> Floatable Store Card (Drag Anywhere)
                </div>
                <button 
                  onClick={() => setSelectedShop(null)}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  title="Close Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start justify-between pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-foreground">🌱 {selectedShop.name}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/20">Certified</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {selectedShop.address}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Dealer: <strong className="text-foreground">{selectedShop.dealerName}</strong></span>
                  <span>License: <strong className="text-foreground">{selectedShop.licenseNumber}</strong></span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" /> {selectedShop.workingHours}
                  </span>
                  <span className="font-bold text-emerald-600">⭐ {selectedShop.rating} / 5.0</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase mb-1">Available In Stock</div>
                <div className="flex flex-wrap gap-1">
                  {selectedShop.availableSeeds.map((seed, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] rounded-md">
                      {seed}
                    </span>
                  ))}
                  {selectedShop.availableFertilizers.map((fert, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-[10px] rounded-md">
                      {fert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${selectedShop.contactNumber}`}
                  className="flex-1 py-2 px-3 bg-card border border-input text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Dealer
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate
                </a>
              </div>
            </motion.div>
          )}

        </div>

        {/* Historical Price Modal */}
        {detailModalAPMC && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{detailModalAPMC.name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> {detailModalAPMC.address}
                  </p>
                </div>
                <button 
                  onClick={() => setDetailModalAPMC(null)}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" /> Historical Price Trend (₹ / Quintal)
                </h3>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                  <button
                    onClick={() => setHistoryTab('7day')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      historyTab === '7day' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setHistoryTab('30day')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      historyTab === '30day' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    30 Days
                  </button>
                </div>
              </div>

              <div className="h-64 w-full bg-muted/20 border border-border rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyTab === '7day' ? detailModalAPMC.history7Days : detailModalAPMC.history30Days}>
                    <defs>
                      <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                    <YAxis domain={['auto', 'auto']} stroke="#888888" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none' }}
                      formatter={(val: any) => [`₹${val} / Qtl`, 'Modal Price']}
                    />
                    <Area type="monotone" dataKey="modalPrice" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorModal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Official AGMARKNET Mandi Records • Updated {detailModalAPMC.lastUpdated}
                </div>
                <button
                  onClick={() => setDetailModalAPMC(null)}
                  className="px-5 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
