import { getLiveMarketplaceListings } from "../data/mockTime.js";

let customListings: any[] = [];
let idCounter = 100;

export class ListingRepository {
  async getAll(): Promise<any[]> {
    return [...customListings, ...getLiveMarketplaceListings()];
  }

  async findById(id: string): Promise<any | null> {
    const all = await this.getAll();
    return all.find(l => l.id === id) || null;
  }

  async create(listing: any): Promise<any> {
    const id = `ml${++idCounter}`;
    const newListing = {
      id,
      ...listing,
      totalPrice: Number(listing.quantity) * Number(listing.pricePerUnit),
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      viewCount: 0,
    };
    customListings.unshift(newListing);
    return newListing;
  }

  async update(id: string, updates: any): Promise<any | null> {
    const existingIdx = customListings.findIndex(l => l.id === id);
    if (existingIdx !== -1) {
      customListings[existingIdx] = { ...customListings[existingIdx], ...updates };
      return customListings[existingIdx];
    }
    
    // Check baseline listings
    const baseline = getLiveMarketplaceListings().find(l => l.id === id);
    if (baseline) {
      const updated = { ...baseline, ...updates };
      customListings.unshift(updated);
      return updated;
    }

    return null;
  }

  async delete(id: string): Promise<boolean> {
    const existingIdx = customListings.findIndex(l => l.id === id);
    if (existingIdx !== -1) {
      customListings.splice(existingIdx, 1);
      return true;
    }
    return false;
  }
}

export const listingRepository = new ListingRepository();
