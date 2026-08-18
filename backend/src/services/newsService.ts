import Parser from 'rss-parser';
import NodeCache from 'node-cache';
import { logger } from '../config/logger.js';
import { getLiveNews as getMockNews } from '../data/mockTime.js';

// Cache for 15 minutes
const newsCache = new NodeCache({ stdTTL: 900 });

// Extended parser to handle specific media and content tags if needed
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['description', 'description'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  district: string;
  source: string;
  time: string;
  icon: 'Sprout' | 'CloudRain' | 'TrendingUp' | 'ShieldCheck' | 'Newspaper';
  link: string;
}

export class NewsService {
  private readonly rssFeeds = [
    // Google News RSS query for India agriculture
    'https://news.google.com/rss/search?q=agriculture+india+OR+farmer+mandi&hl=en-IN&gl=IN&ceid=IN:en',
  ];

  private mapMockNews(items: any[]): NewsItem[] {
    return items.map((item, idx) => {
      let itemIcon: NewsItem['icon'] = "Newspaper";
      if (item.category === 'Monsoon & Weather') itemIcon = "CloudRain";
      else if (item.category === 'Mandi & Prices') itemIcon = "TrendingUp";
      else if (item.category === 'Govt Policy') itemIcon = "ShieldCheck";
      else itemIcon = "Sprout";

      return {
        id: item.id || `live_news_${idx}`,
        title: item.title,
        summary: item.summary,
        category: item.category,
        district: item.district,
        source: item.source,
        time: item.readTime || 'Just Now',
        icon: itemIcon,
        link: '#'
      };
    });
  }

  async getNews(query: { category?: string; search?: string; district?: string }) {
    const { category, search, district } = query;
    const districtQuery = district && district !== 'All' ? district : 'Maharashtra';
    const cacheKey = `live_news_rss_${districtQuery}`;

    let newsItems: NewsItem[] = newsCache.get(cacheKey) || [];

    if (newsItems.length === 0) {
      try {
        const feedUrl = `https://news.google.com/rss/search?q=agriculture+${encodeURIComponent(districtQuery)}+OR+farmer+${encodeURIComponent(districtQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const fetchPromises = [
          parser.parseURL(feedUrl).then(feed => feed.items)
        ];

        const results = await Promise.allSettled(fetchPromises);
        let allItems: any[] = [];
        
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            allItems = [...allItems, ...result.value];
          } else {
            logger.error(`Failed to fetch RSS feed: ${result.reason}`);
          }
        });

        if (allItems.length > 0) {
          newsItems = allItems.map((item, index) => {
            // Determine category and icon based on keywords in title
            let itemCat = "General";
            let itemIcon: NewsItem['icon'] = "Newspaper";
            const titleLower = (item.title || '').toLowerCase();

            if (titleLower.includes('weather') || titleLower.includes('rain') || titleLower.includes('monsoon') || titleLower.includes('cyclone')) {
              itemCat = "Weather";
              itemIcon = "CloudRain";
            } else if (titleLower.includes('price') || titleLower.includes('mandi') || titleLower.includes('export') || titleLower.includes('market')) {
              itemCat = "Market";
              itemIcon = "TrendingUp";
            } else if (titleLower.includes('scheme') || titleLower.includes('subsidy') || titleLower.includes('pm kisan') || titleLower.includes('govt')) {
              itemCat = "Policy";
              itemIcon = "ShieldCheck";
            } else if (titleLower.includes('crop') || titleLower.includes('seed') || titleLower.includes('fertilizer') || titleLower.includes('pest')) {
              itemCat = "Farming Info";
              itemIcon = "Sprout";
            }

            return {
              id: `live_news_${index}_${Date.now()}`,
              title: item.title || 'Agricultural News',
              summary: item.contentSnippet?.slice(0, 150) + '...' || item.description?.slice(0, 150) + '...' || 'Read more for details.',
              category: itemCat,
              district: districtQuery,
              source: item.source || item.creator || 'Google News',
              time: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : "Just Now",
              icon: itemIcon,
              link: item.link || '#'
            };
          });

          // Sort by date (assuming newer first from feed)
          // Store in cache
          newsCache.set(cacheKey, newsItems);
        } else {
          // Fallback to mock data
          newsItems = this.mapMockNews(getMockNews());
        }
      } catch (error) {
        logger.error(`Error in NewsService: ${error}`);
        newsItems = this.mapMockNews(getMockNews()); // Fallback
      }
    }

    // Apply filters
    let filtered = [...newsItems];

    if (category && category !== 'All') {
      filtered = filtered.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.summary.toLowerCase().includes(q)
      );
    }

    return filtered;
  }
}

export const newsService = new NewsService();
