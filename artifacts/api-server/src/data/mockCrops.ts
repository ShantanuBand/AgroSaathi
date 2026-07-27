// Mock crop price data — realistic Indian mandi prices (July 2026)

export interface CropPriceRecord {
  id: string;
  cropName: string;
  cropNameHindi: string;
  category: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  change: number;
  changePercent: number;
  market: string;
  state: string;
  updatedAt: string;
}

export const CROP_PRICES: CropPriceRecord[] = [
  { id: "1", cropName: "Wheat", cropNameHindi: "गेहूं", category: "Cereals", currentPrice: 2350, minPrice: 2280, maxPrice: 2420, unit: "quintal", change: 45, changePercent: 1.95, market: "Azadpur Mandi", state: "Delhi", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "2", cropName: "Rice (Common)", cropNameHindi: "चावल (सामान्य)", category: "Cereals", currentPrice: 2180, minPrice: 2100, maxPrice: 2250, unit: "quintal", change: -20, changePercent: -0.91, market: "Patna Mandi", state: "Bihar", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "3", cropName: "Maize", cropNameHindi: "मक्का", category: "Cereals", currentPrice: 1980, minPrice: 1920, maxPrice: 2050, unit: "quintal", change: 30, changePercent: 1.54, market: "Gulbarga Mandi", state: "Karnataka", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "4", cropName: "Soybean", cropNameHindi: "सोयाबीन", category: "Oilseeds", currentPrice: 4620, minPrice: 4500, maxPrice: 4750, unit: "quintal", change: 120, changePercent: 2.67, market: "Indore Mandi", state: "Madhya Pradesh", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "5", cropName: "Mustard", cropNameHindi: "सरसों", category: "Oilseeds", currentPrice: 5180, minPrice: 5050, maxPrice: 5320, unit: "quintal", change: -80, changePercent: -1.52, market: "Alwar Mandi", state: "Rajasthan", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "6", cropName: "Groundnut", cropNameHindi: "मूंगफली", category: "Oilseeds", currentPrice: 5650, minPrice: 5500, maxPrice: 5800, unit: "quintal", change: 100, changePercent: 1.80, market: "Junagadh Mandi", state: "Gujarat", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "7", cropName: "Cotton", cropNameHindi: "कपास", category: "Fibre Crops", currentPrice: 6200, minPrice: 6050, maxPrice: 6380, unit: "quintal", change: -150, changePercent: -2.36, market: "Akola Mandi", state: "Maharashtra", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "8", cropName: "Sugarcane", cropNameHindi: "गन्ना", category: "Sugar Crops", currentPrice: 340, minPrice: 335, maxPrice: 345, unit: "quintal", change: 5, changePercent: 1.49, market: "Muzaffarnagar Mandi", state: "Uttar Pradesh", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "9", cropName: "Tomato", cropNameHindi: "टमाटर", category: "Vegetables", currentPrice: 2800, minPrice: 2400, maxPrice: 3200, unit: "quintal", change: 400, changePercent: 16.67, market: "Kolar Mandi", state: "Karnataka", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "10", cropName: "Onion", cropNameHindi: "प्याज", category: "Vegetables", currentPrice: 1850, minPrice: 1700, maxPrice: 2000, unit: "quintal", change: -120, changePercent: -6.09, market: "Lasalgaon Mandi", state: "Maharashtra", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "11", cropName: "Potato", cropNameHindi: "आलू", category: "Vegetables", currentPrice: 1200, minPrice: 1100, maxPrice: 1350, unit: "quintal", change: 50, changePercent: 4.35, market: "Agra Mandi", state: "Uttar Pradesh", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "12", cropName: "Chickpea", cropNameHindi: "चना", category: "Pulses", currentPrice: 5850, minPrice: 5700, maxPrice: 6000, unit: "quintal", change: 75, changePercent: 1.30, market: "Akola Mandi", state: "Maharashtra", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "13", cropName: "Pigeon Pea (Tur)", cropNameHindi: "अरहर दाल", category: "Pulses", currentPrice: 7200, minPrice: 7000, maxPrice: 7450, unit: "quintal", change: 200, changePercent: 2.86, market: "Gulbarga Mandi", state: "Karnataka", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "14", cropName: "Green Gram (Moong)", cropNameHindi: "मूंग", category: "Pulses", currentPrice: 7850, minPrice: 7650, maxPrice: 8100, unit: "quintal", change: -100, changePercent: -1.26, market: "Jaipur Mandi", state: "Rajasthan", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "15", cropName: "Banana", cropNameHindi: "केला", category: "Fruits", currentPrice: 1400, minPrice: 1200, maxPrice: 1600, unit: "quintal", change: 80, changePercent: 6.06, market: "Jalgaon Mandi", state: "Maharashtra", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "16", cropName: "Mango", cropNameHindi: "आम", category: "Fruits", currentPrice: 4500, minPrice: 3800, maxPrice: 5200, unit: "quintal", change: -300, changePercent: -6.25, market: "Bangalore Mandi", state: "Karnataka", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "17", cropName: "Sunflower", cropNameHindi: "सूरजमुखी", category: "Oilseeds", currentPrice: 5200, minPrice: 5050, maxPrice: 5380, unit: "quintal", change: 90, changePercent: 1.76, market: "Bijapur Mandi", state: "Karnataka", updatedAt: "2026-07-27T08:30:00Z" },
  { id: "18", cropName: "Jowar (Sorghum)", cropNameHindi: "ज्वार", category: "Cereals", currentPrice: 2900, minPrice: 2800, maxPrice: 3000, unit: "quintal", change: 60, changePercent: 2.11, market: "Pune Mandi", state: "Maharashtra", updatedAt: "2026-07-27T08:30:00Z" },
];

export const PRICE_HISTORY: Record<string, { date: string; price: number; minPrice: number; maxPrice: number }[]> = {
  "1": generateHistory(2350, 60),
  "2": generateHistory(2180, 50),
  "3": generateHistory(1980, 45),
  "4": generateHistory(4620, 120),
  "5": generateHistory(5180, 110),
  "6": generateHistory(5650, 130),
  "7": generateHistory(6200, 140),
  "8": generateHistory(340, 8),
  "9": generateHistory(2800, 400),
  "10": generateHistory(1850, 200),
};

function generateHistory(basePrice: number, variance: number) {
  const history = [];
  const today = new Date("2026-07-27");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const rand = (Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.3) * 0.5);
    const price = Math.round(basePrice + rand * variance);
    history.push({
      date: d.toISOString().split("T")[0],
      price,
      minPrice: Math.round(price * 0.97),
      maxPrice: Math.round(price * 1.03),
    });
  }
  return history;
}
