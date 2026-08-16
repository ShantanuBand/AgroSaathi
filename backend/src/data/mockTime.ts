import { NOTIFICATIONS } from "./mockNotifications.js";
import { MAHARASHTRA_AGRI_NEWS } from "./mockNews.js";
import { MARKETPLACE_LISTINGS } from "./mockMarketplace.js";
import { WEATHER_FORECAST, WEATHER_ALERTS } from "./mockWeather.js";
import { APMC_LOCATIONS } from "./mockServices.js";
import { GOVERNMENT_SCHEMES } from "./mockSchemes.js";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Returns dynamic notifications relative to current timestamp */
export function getLiveNotifications() {
  const now = new Date();
  
  // Offsets in milliseconds relative to current time
  const offsets = [
    12 * 60 * 1000,          // 12 mins ago
    45 * 60 * 1000,          // 45 mins ago
    2 * 60 * 60 * 1000,      // 2 hours ago
    5 * 60 * 60 * 1000,      // 5 hours ago
    14 * 60 * 60 * 1000,     // 14 hours ago
    22 * 60 * 60 * 1000,     // 22 hours ago
    36 * 60 * 60 * 1000,     // 1.5 days ago
    48 * 60 * 60 * 1000,     // 2 days ago
    72 * 60 * 60 * 1000,     // 3 days ago
    96 * 60 * 60 * 1000,     // 4 days ago
  ];

  return NOTIFICATIONS.map((n, idx) => {
    const offsetMs = offsets[idx % offsets.length] || (idx + 1) * 3600000;
    const createdAt = new Date(now.getTime() - offsetMs).toISOString();
    return {
      ...n,
      createdAt,
    };
  });
}

/** Returns dynamic news items relative to current timestamp */
export function getLiveNews() {
  const now = new Date();
  const offsets = [
    30 * 60 * 1000,          // 30 mins ago
    2 * 60 * 60 * 1000,      // 2 hours ago
    4 * 60 * 60 * 1000,      // 4 hours ago
    8 * 60 * 60 * 1000,      // 8 hours ago
    18 * 60 * 60 * 1000,     // 18 hours ago
    26 * 60 * 60 * 1000,     // 26 hours ago
  ];

  return MAHARASHTRA_AGRI_NEWS.map((item, idx) => {
    const offsetMs = offsets[idx % offsets.length] || (idx + 1) * 7200000;
    const publishedAt = new Date(now.getTime() - offsetMs).toISOString();
    return {
      ...item,
      publishedAt,
    };
  });
}

/** Returns dynamic marketplace listings relative to current timestamp */
export function getLiveMarketplaceListings() {
  const now = new Date();
  const offsets = [
    1 * 60 * 60 * 1000,      // 1 hour ago
    3 * 60 * 60 * 1000,      // 3 hours ago
    6 * 60 * 60 * 1000,      // 6 hours ago
    12 * 60 * 60 * 1000,     // 12 hours ago
    24 * 60 * 60 * 1000,     // 1 day ago
    36 * 60 * 60 * 1000,     // 1.5 days ago
    48 * 60 * 60 * 1000,     // 2 days ago
    60 * 60 * 60 * 1000,     // 2.5 days ago
  ];

  return MARKETPLACE_LISTINGS.map((l, idx) => {
    const offsetMs = offsets[idx % offsets.length] || (idx + 1) * 14400000;
    const postedAt = new Date(now.getTime() - offsetMs).toISOString();
    const expiresAt = new Date(now.getTime() + (30 - (idx % 10)) * 24 * 60 * 60 * 1000).toISOString();
    return {
      ...l,
      postedAt,
      expiresAt,
    };
  });
}

/** Returns dynamic 7-day weather forecast starting today */
export function getLiveWeatherForecast() {
  const now = new Date();
  
  return WEATHER_FORECAST.map((day, idx) => {
    const targetDate = new Date(now.getTime() + idx * 24 * 60 * 60 * 1000);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = DAY_NAMES[targetDate.getDay()];

    return {
      ...day,
      date: dateStr,
      dayOfWeek: idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : dayOfWeek,
    };
  });
}

/** Returns dynamic weather alerts active for current date */
export function getLiveWeatherAlerts() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextDay = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  return WEATHER_ALERTS.map((alert, idx) => {
    const validFrom = idx === 0 ? now.toISOString() : tomorrow.toISOString();
    const validUntil = idx === 0 ? tomorrow.toISOString() : nextDay.toISOString();
    return {
      ...alert,
      validFrom,
      validUntil,
    };
  });
}

/** Returns dynamic APMC locations with current lastUpdated and live chart history */
export function getLiveAPMCLocations() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const lastUpdated = `Today, ${timeStr}`;

  // Generate history dates for past 7 days and past 30 days up to today
  const history7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const dateLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { date: dateLabel };
  });

  const history30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    const dateLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { date: dateLabel };
  });

  return APMC_LOCATIONS.map((apmc, idx) => {
    const basePrice = apmc.modalPrice;
    
    const liveHistory7 = history7Days.map((item, hIdx) => {
      const shift = Math.sin((hIdx + idx) * 0.7) * 120;
      const modalPrice = Math.round(basePrice + shift);
      return {
        date: item.date,
        modalPrice,
        minPrice: Math.round(modalPrice * 0.92),
        maxPrice: Math.round(modalPrice * 1.08),
      };
    });

    const liveHistory30 = history30Days.map((item, hIdx) => {
      const shift = Math.sin((hIdx + idx) * 0.4) * 200;
      const modalPrice = Math.round(basePrice + shift);
      return {
        date: item.date,
        modalPrice,
        minPrice: Math.round(modalPrice * 0.91),
        maxPrice: Math.round(modalPrice * 1.09),
      };
    });

    return {
      ...apmc,
      lastUpdated,
      history7Days: liveHistory7,
      history30Days: liveHistory30,
    };
  });
}

/** Returns dynamic government schemes with future application deadlines */
export function getLiveSchemes() {
  const now = new Date();
  
  return GOVERNMENT_SCHEMES.map((scheme, idx) => {
    if (scheme.applicationDeadline) {
      const daysFuture = 15 + (idx * 10);
      const deadlineDate = new Date(now.getTime() + daysFuture * 24 * 60 * 60 * 1000);
      const yyyy = deadlineDate.getFullYear();
      const mm = String(deadlineDate.getMonth() + 1).padStart(2, '0');
      const dd = String(deadlineDate.getDate()).padStart(2, '0');
      return {
        ...scheme,
        applicationDeadline: `${yyyy}-${mm}-${dd}`,
      };
    }
    return scheme;
  });
}
