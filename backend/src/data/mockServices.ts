export interface APMCLocation {
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
  status: "Open" | "Closed";
  marketTimings: string;
  contactNumber: string;
  lastUpdated: string;
  history7Days: { date: string; modalPrice: number; minPrice: number; maxPrice: number }[];
  history30Days: { date: string; modalPrice: number; minPrice: number; maxPrice: number }[];
}

export interface KrishiShopLocation {
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

export interface GovOffice {
  id: string;
  name: string;
  category: string;
  address: string;
  district: string;
  taluka: string;
  lat: number;
  lng: number;
  contactPerson: string;
  contactNumber: string;
  email: string;
  workingHours: string;
  servicesProvided: string[];
}

export interface EmergencyService {
  id: string;
  name: string;
  category: string;
  address: string;
  district: string;
  taluka: string;
  lat: number;
  lng: number;
  contactNumber: string;
  is24x7: boolean;
  workingHours: string;
}

export interface DistrictCenter {
  name: string;
  lat: number;
  lng: number;
}

// Map of all 36 Districts of Maharashtra with Center Lat/Lng
export const MAHARASHTRA_DISTRICT_CENTERS: Record<string, DistrictCenter> = {
  "Ahilyanagar (Ahmednagar)": { name: "Ahilyanagar (Ahmednagar)", lat: 19.0948, lng: 74.7480 },
  "Akola": { name: "Akola", lat: 20.7002, lng: 77.0082 },
  "Amravati": { name: "Amravati", lat: 20.9374, lng: 77.7796 },
  "Beed": { name: "Beed", lat: 18.9892, lng: 75.7601 },
  "Bhandara": { name: "Bhandara", lat: 21.1706, lng: 79.6549 },
  "Buldhana": { name: "Buldhana", lat: 20.5293, lng: 76.1843 },
  "Chandrapur": { name: "Chandrapur", lat: 19.9615, lng: 79.2961 },
  "Chhatrapati Sambhajinagar": { name: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433 },
  "Dharashiv": { name: "Dharashiv", lat: 18.1861, lng: 76.0419 },
  "Dhule": { name: "Dhule", lat: 20.9042, lng: 74.7749 },
  "Gadchiroli": { name: "Gadchiroli", lat: 20.1849, lng: 79.9948 },
  "Gondia": { name: "Gondia", lat: 21.4624, lng: 80.1961 },
  "Hingoli": { name: "Hingoli", lat: 19.7189, lng: 77.1475 },
  "Jalgaon": { name: "Jalgaon", lat: 21.0077, lng: 75.5626 },
  "Jalna": { name: "Jalna", lat: 19.8410, lng: 75.8864 },
  "Kolhapur": { name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
  "Latur": { name: "Latur", lat: 18.4088, lng: 76.5604 },
  "Mumbai City": { name: "Mumbai City", lat: 18.9388, lng: 72.8353 },
  "Mumbai Suburban": { name: "Mumbai Suburban", lat: 19.1176, lng: 72.8481 },
  "Nagpur": { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  "Nanded": { name: "Nanded", lat: 19.1383, lng: 77.3210 },
  "Nandurbar": { name: "Nandurbar", lat: 21.3739, lng: 74.2407 },
  "Nashik": { name: "Nashik", lat: 19.9975, lng: 73.7898 },
  "Palghar": { name: "Palghar", lat: 19.6967, lng: 72.7699 },
  "Parbhani": { name: "Parbhani", lat: 19.2608, lng: 76.7749 },
  "Pune": { name: "Pune", lat: 18.5204, lng: 73.8567 },
  "Raigad": { name: "Raigad", lat: 18.5158, lng: 73.1822 },
  "Ratnagiri": { name: "Ratnagiri", lat: 16.9902, lng: 73.3120 },
  "Sangli": { name: "Sangli", lat: 16.8524, lng: 74.5815 },
  "Satara": { name: "Satara", lat: 17.6805, lng: 74.0183 },
  "Sindhudurg": { name: "Sindhudurg", lat: 16.1667, lng: 73.7167 },
  "Solapur": { name: "Solapur", lat: 17.6599, lng: 75.9064 },
  "Thane": { name: "Thane", lat: 19.2183, lng: 72.9781 },
  "Wardha": { name: "Wardha", lat: 20.7453, lng: 78.6022 },
  "Washim": { name: "Washim", lat: 20.1106, lng: 77.1352 },
  "Yavatmal": { name: "Yavatmal", lat: 20.3888, lng: 78.1204 }
};

const DISTRICT_COMMODITIES: Record<string, string[]> = {
  "Amravati": ["Soybean", "Cotton", "Tur", "Wheat", "Orange"],
  "Nashik": ["Onion", "Tomato", "Grapes", "Pomegranate", "Wheat"],
  "Pune": ["Tomato", "Potato", "Onion", "Vegetables", "Sugarcane"],
  "Nagpur": ["Orange", "Cotton", "Soybean", "Wheat", "Chana"],
  "Akola": ["Cotton", "Soybean", "Tur", "Urad", "Wheat"],
  "Solapur": ["Pomegranate", "Onion", "Jowar", "Sugarcane", "Tur"],
  "Latur": ["Tur", "Soybean", "Chana", "Urad", "Moong"],
  "Chhatrapati Sambhajinagar": ["Cotton", "Maize", "Bajra", "Sweet Lime", "Ginger"],
  "Ahilyanagar (Ahmednagar)": ["Onion", "Milk", "Sugarcane", "Pomegranate", "Wheat"],
  "Kolhapur": ["Sugarcane", "Jaggery", "Rice", "Turmeric", "Groundnut"],
  "Jalgaon": ["Banana", "Cotton", "Maize", "Tur", "Wheat"],
  "Satara": ["Ginger", "Strawberry", "Turmeric", "Sugarcane", "Potato"],
  "Sangli": ["Turmeric", "Grapes", "Raisins", "Sugarcane", "Jowar"],
  "Nanded": ["Cotton", "Soybean", "Tur", "Banana", "Sugarcane"],
  "Beed": ["Cotton", "Soybean", "Bajra", "Tur", "Sugarcane"],
  "Dharashiv": ["Soybean", "Tur", "Chana", "Sugarcane", "Sunflower"],
  "Parbhani": ["Cotton", "Soybean", "Tur", "Jowar", "Wheat"],
  "Hingoli": ["Turmeric", "Soybean", "Cotton", "Tur", "Wheat"],
  "Jalna": ["Sweet Lime", "Cotton", "Soybean", "Maize", "Tur"],
  "Dhule": ["Cotton", "Groundnut", "Maize", "Onion", "Wheat"],
  "Nandurbar": ["Chili", "Papaya", "Maize", "Cotton", "Rice"],
  "Buldhana": ["Soybean", "Cotton", "Tur", "Maize", "Onion"],
  "Washim": ["Soybean", "Tur", "Chana", "Wheat", "Cotton"],
  "Yavatmal": ["Cotton", "Soybean", "Tur", "Chana", "Wheat"],
  "Wardha": ["Cotton", "Soybean", "Tur", "Wheat", "Chana"],
  "Bhandara": ["Rice", "Wheat", "Lakhori", "Chana"],
  "Gondia": ["Rice", "Wheat", "Linseed", "Chana"],
  "Chandrapur": ["Rice", "Cotton", "Soybean", "Wheat", "Chana"],
  "Gadchiroli": ["Rice", "Mahua", "Tendu", "Maize"],
  "Raigad": ["Rice", "Mango", "Cashew", "Coconut", "Vegetables"],
  "Ratnagiri": ["Mango", "Cashew", "Coconut", "Rice", "Arecanut"],
  "Sindhudurg": ["Mango", "Cashew", "Coconut", "Spices", "Rice"],
  "Palghar": ["Rice", "Sapota", "Flowers", "Vegetables"],
  "Thane": ["Rice", "Vegetables", "Flowers", "Poultry"],
  "Mumbai City": ["Fruits", "Vegetables", "Spices", "Grains"],
  "Mumbai Suburban": ["Fruits", "Vegetables", "Spices", "Flowers"]
};

import { MAHARASHTRA_CITIES } from "./mockDistricts.js";

// Generate comprehensive APMCs for ALL Cities and Talukas across Maharashtra
export const APMC_LOCATIONS: APMCLocation[] = MAHARASHTRA_CITIES.map((city, idx) => {
  const commodities = DISTRICT_COMMODITIES[city.districtName] || ["Soybean", "Wheat", "Cotton", "Tur"];
  const basePrice = 3800 + (idx * 67) % 3200;

  return {
    id: `apmc_${city.id}`,
    name: city.name.includes("APMC") || city.name.includes("Mandi") || city.name.includes("Market") ? city.name : `${city.name} APMC Mandi`,
    nameHindi: city.nameHindi ? (city.nameHindi.includes("एपीएमसी") || city.nameHindi.includes("मंडी") ? city.nameHindi : `${city.nameHindi} एपीएमसी`) : `${city.name} एपीएमसी`,
    address: `APMC Market Yard, ${city.name}, Dist. ${city.districtName}, Maharashtra`,
    district: city.districtName,
    taluka: city.name,
    state: "Maharashtra",
    lat: city.lat,
    lng: city.lon,
    modalPrice: basePrice,
    minPrice: Math.round(basePrice * 0.94),
    maxPrice: Math.round(basePrice * 1.07),
    arrivalQty: `${2500 + (idx * 210) % 18000} Qtl`,
    primaryCommodities: commodities,
    status: "Open",
    marketTimings: "07:30 AM - 05:30 PM",
    contactNumber: `+91 ${7000000000 + (idx * 13579) % 2999999999}`,
    lastUpdated: "Today, 08:30 AM",
    history7Days: [
      { date: "23/07", modalPrice: Math.round(basePrice * 0.97), minPrice: Math.round(basePrice * 0.92), maxPrice: Math.round(basePrice * 1.05) },
      { date: "29/07", modalPrice: basePrice, minPrice: Math.round(basePrice * 0.94), maxPrice: Math.round(basePrice * 1.07) },
    ],
    history30Days: [
      { date: "01/07", modalPrice: Math.round(basePrice * 0.95), minPrice: Math.round(basePrice * 0.90), maxPrice: Math.round(basePrice * 1.04) },
      { date: "29/07", modalPrice: basePrice, minPrice: Math.round(basePrice * 0.94), maxPrice: Math.round(basePrice * 1.07) },
    ]
  };
});

// KRISHI SEVA KENDRAS for ALL 36 Districts of Maharashtra
export const KRISHI_SEVA_KENDRAS: KrishiShopLocation[] = Object.entries(MAHARASHTRA_DISTRICT_CENTERS).flatMap(([distKey, center], idx) => {
  const cleanName = distKey.split(" ")[0].replace("(", "").replace(")", "");
  const commodities = DISTRICT_COMMODITIES[distKey] || ["Soybean", "Wheat"];

  return [
    {
      id: `ksk_${idx}_1`,
      name: `${cleanName} Kisan Krishi Seva Kendra`,
      dealerName: `Shri ${cleanName}rao Patil`,
      licenseNumber: `K-${cleanName.slice(0, 3).toUpperCase()}/2024/${1000 + idx}`,
      address: `Main Market Road, ${cleanName}, Maharashtra`,
      district: distKey,
      taluka: `${cleanName} City`,
      lat: center.lat + 0.012,
      lng: center.lng + 0.015,
      contactNumber: `+91 98${10000000 + idx * 23456}`,
      workingHours: "08:00 AM - 08:00 PM",
      availableSeeds: [`Certified ${commodities[0]} Seed`, `Hybrid ${commodities[1] || "Cotton"} Seed`, "Lokwan Wheat"],
      availableFertilizers: ["IFFCO 10:26:26", "Neem Coated Urea", "DAP 18:46:00", "SSP"],
      availablePesticides: ["Chlorantraniliprole 18.5%", "Imidacloprid 17.8%", "Mancozeb 75% WP"],
      availableEquipment: ["Tarpaulin Covers", "Drip Irrigation Pipes", "Battery Sprayer Pump"],
      inStock: true,
      rating: 4.8
    },
    {
      id: `ksk_${idx}_2`,
      name: `${cleanName} Agro Agvet & Fertilizer Center`,
      dealerName: `Shri Suresh ${cleanName}kar`,
      licenseNumber: `K-${cleanName.slice(0, 3).toUpperCase()}/2025/${2000 + idx}`,
      address: `APMC Gate No. 2, ${cleanName}, Maharashtra`,
      district: distKey,
      taluka: `${cleanName} Rural`,
      lat: center.lat - 0.015,
      lng: center.lng - 0.018,
      contactNumber: `+91 94${20000000 + idx * 34567}`,
      workingHours: "08:30 AM - 08:30 PM",
      availableSeeds: [`High-Yield ${commodities[0]} Seed`, "Sorghum Hybrid", "Gram Seed"],
      availableFertilizers: ["MOP 60%", "Zinc Sulphate 21%", "Bio-Fertilizer Rhizobium"],
      availablePesticides: ["Fipronil 5% SC", "Copper Oxychloride", "Azoxystrobin"],
      availableEquipment: ["Solar Bug Traps", "Micro-Sprinklers", "PVC Pipes"],
      inStock: true,
      rating: 4.6
    }
  ];
});

// GOVERNMENT OFFICES for ALL 36 Districts of Maharashtra
export const GOV_OFFICES: GovOffice[] = Object.entries(MAHARASHTRA_DISTRICT_CENTERS).map(([distKey, center], idx) => {
  const cleanName = distKey.split(" ")[0].replace("(", "").replace(")", "");
  return {
    id: `gov_${idx}`,
    name: `District Superintendent Agriculture Office (${cleanName})`,
    category: "District Agriculture Office (SAO)",
    address: `Administrative Building, Collectorate Campus, ${cleanName}, Maharashtra`,
    district: distKey,
    taluka: `${cleanName} City`,
    lat: center.lat + 0.005,
    lng: center.lng + 0.005,
    contactPerson: `Shri R. K. Deshmukh (District Agriculture Officer)`,
    contactNumber: `+91 ${2000000000 + idx * 12345}`,
    email: `sao.${cleanName.toLowerCase()}@maharashtra.gov.in`,
    workingHours: "09:45 AM - 06:15 PM (Mon to Sat)",
    servicesProvided: [
      "PM-KISAN Registration & eKYC Helpdesk",
      "PM Fasal Bima Yojana Claims & Crop Damage Intimation",
      "Soil Health Card & Soil Testing Token Issue",
      "Tractor & Drip Irrigation Subsidy Application Processing"
    ]
  };
});

// EMERGENCY SERVICES for ALL 36 Districts of Maharashtra
export const EMERGENCY_SERVICES: EmergencyService[] = Object.entries(MAHARASHTRA_DISTRICT_CENTERS).flatMap(([distKey, center], idx) => {
  const cleanName = distKey.split(" ")[0].replace("(", "").replace(")", "");
  return [
    {
      id: `emg_${idx}_1`,
      name: `${cleanName} 24x7 Heavy Tractor & Agro Mechanics`,
      category: "Tractor Repair",
      address: `State Highway Bypass, ${cleanName}, Maharashtra`,
      district: distKey,
      taluka: `${cleanName} City`,
      lat: center.lat - 0.010,
      lng: center.lng + 0.020,
      contactNumber: `+91 98${90000000 + idx * 11223}`,
      is24x7: true,
      workingHours: "24 Hours On-Call Mobile Repair Van Available"
    },
    {
      id: `emg_${idx}_2`,
      name: `${cleanName} Central Veterinary Hospital & Livestock Ambulance`,
      category: "Veterinary Hospital",
      address: `Civil Hospital Road, ${cleanName}, Maharashtra`,
      district: distKey,
      taluka: `${cleanName} City`,
      lat: center.lat + 0.018,
      lng: center.lng - 0.012,
      contactNumber: `+91 72${10000000 + idx * 33445}`,
      is24x7: true,
      workingHours: "24 Hours Emergency Cattle & Livestock Hospital"
    }
  ];
});

export const userFavoritesStore: string[] = ["apmc_0_1", "apmc_1_1"];
