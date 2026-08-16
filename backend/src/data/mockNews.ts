export interface AgriNewsRecord {
  id: string;
  title: string;
  summary: string;
  category: 'Monsoon & Weather' | 'Mandi & Prices' | 'Govt Policy' | 'Crop Health' | 'Subsidies';
  district: string;
  source: string;
  publishedAt: string;
  readTime: string;
  imageUrl?: string;
}

export const MAHARASHTRA_AGRI_NEWS: AgriNewsRecord[] = [
  {
    id: "news-1",
    title: "Monsoon Update: Good Rainfall Across Marathwada & Vidarbha Boosts Soybean & Cotton Sowing",
    summary: "Widespread monsoon rainfall over Nashik, Latur, Akola, and Amravati has accelerated Kharif crop sowing. Agriculture Department reports 92% sowing completion across Maharashtra.",
    category: "Monsoon & Weather",
    district: "Statewide (Maharashtra)",
    source: "Agri-Clarity Maharashtra Bureau",
    publishedAt: "2026-07-28T09:30:00Z",
    readTime: "2 min read"
  },
  {
    id: "news-2",
    title: "Lasalgaon Onion Mandi: Rabi Onion Prices Stabilize at ₹1,850/Quintal Amid Steady Supply",
    summary: "Arrivals at Asia's largest onion market in Lasalgaon (Nashik) reached 25,000 quintals today. Traders report robust demand from South Indian markets.",
    category: "Mandi & Prices",
    district: "Nashik",
    source: "Lasalgaon APMC Bulletin",
    publishedAt: "2026-07-28T08:15:00Z",
    readTime: "3 min read"
  },
  {
    id: "news-3",
    title: "Namo Shetkari Yojana: 4th Installment of ₹2,000 Disbursed to 90 Lakh Maharashtra Farmers",
    summary: "Maharashtra Chief Minister confirms the transfer of ₹1,800 crore directly into Aadhaar-linked bank accounts under Namo Shetkari Maha Samman Nidhi.",
    category: "Govt Policy",
    district: "Mumbai",
    source: "Maharashtra Krishi Vibhag",
    publishedAt: "2026-07-27T14:00:00Z",
    readTime: "2 min read"
  },
  {
    id: "news-4",
    title: "Pest Alert: ICAR-KVK Issues Advisory for Fall Armyworm in Maize & Stem Borer in Sugarcane",
    summary: "Farmers in Kolhapur, Pune, and Solapur advised to inspect maize fields weekly. Spray Neem-based bio-pesticides or recommended spray schedule if pest threshold exceeds 10%.",
    category: "Crop Health",
    district: "Kolhapur & Pune",
    source: "Krishi Vigyan Kendra (KVK)",
    publishedAt: "2026-07-27T11:20:00Z",
    readTime: "4 min read"
  },
  {
    id: "news-5",
    title: "Jayakwadi Dam Water Level Reaches 78%: Irrigation Water Released for Jalna & Chhatrapati Sambhajinagar",
    summary: "Heavy catchment rainfall in Ahmednagar and Nashik has raised Jayakwadi reservoir storage, promising adequate canal irrigation for upcoming Rabi crops.",
    category: "Monsoon & Weather",
    district: "Chhatrapati Sambhajinagar",
    source: "Maharashtra Water Resources Dept",
    publishedAt: "2026-07-26T16:45:00Z",
    readTime: "3 min read"
  },
  {
    id: "news-6",
    title: "Drip Irrigation Subsidy Portal Opens: Maharashtra Govt Offers Up to 80% Subsidy for Small Farmers",
    summary: "Applications under PMKSY & Chief Minister Sustainable Agriculture Scheme are now live on Mahadbt portal for installing drip and sprinkler systems.",
    category: "Subsidies",
    district: "Statewide (Maharashtra)",
    source: "MahaDBT Portal Alert",
    publishedAt: "2026-07-26T10:00:00Z",
    readTime: "2 min read"
  }
];
