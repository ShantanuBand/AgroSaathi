import { listingRepository } from "../repositories/listingRepository.js";
import { NotFoundError, ForbiddenError } from "../errors/AppError.js";

export class MarketplaceService {
  async getListings(filters: { category?: string; type?: string; state?: string; search?: string }) {
    let results = (await listingRepository.getAll()).filter(l => l.isActive);

    if (filters.category) {
      results = results.filter(l => l.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.type) {
      results = results.filter(l => l.type === filters.type);
    }
    if (filters.state) {
      results = results.filter(l => l.state.toLowerCase() === filters.state!.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(l => 
        l.cropName.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q)
      );
    }

    return results;
  }

  async getListingById(id: string) {
    const listing = await listingRepository.findById(id);
    if (!listing) {
      throw new NotFoundError("Marketplace listing not found");
    }
    const updated = await listingRepository.update(id, { viewCount: (listing.viewCount || 0) + 1 });
    return updated || listing;
  }

  async createListing(user: any, body: any) {
    const newListing = await listingRepository.create({
      ...body,
      sellerId: user.id,
      sellerName: user.name,
      sellerPhone: user.phone,
      location: `${user.city}, ${user.district}`,
      state: user.state || "Maharashtra",
    });
    return newListing;
  }

  async updateListing(user: any, id: string, updates: any) {
    const existing = await listingRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Listing not found");
    }

    if (user.role !== "admin" && existing.sellerId && existing.sellerId !== user.id) {
      throw new ForbiddenError("You can only edit your own marketplace listings");
    }

    const updated = await listingRepository.update(id, updates);
    return updated;
  }

  async deleteListing(user: any, id: string) {
    const existing = await listingRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Listing not found");
    }

    if (user.role !== "admin" && existing.sellerId && existing.sellerId !== user.id) {
      throw new ForbiddenError("You can only delete your own marketplace listings");
    }

    await listingRepository.delete(id);
    return { success: true, message: "Listing removed successfully" };
  }
}

export const marketplaceService = new MarketplaceService();
