// Per-user favorite APMC store
const userFavoritesMap: Record<string, string[]> = {};

export class FavoriteRepository {
  async getFavorites(userId: string): Promise<string[]> {
    return userFavoritesMap[userId] || ["apmc_1", "apmc_3"];
  }

  async toggleFavorite(userId: string, apmcId: string): Promise<{ isFavorite: boolean; favorites: string[] }> {
    if (!userFavoritesMap[userId]) {
      userFavoritesMap[userId] = ["apmc_1", "apmc_3"];
    }

    const favorites = userFavoritesMap[userId];
    const index = favorites.indexOf(apmcId);
    let isFavorite = false;

    if (index > -1) {
      favorites.splice(index, 1);
      isFavorite = false;
    } else {
      favorites.push(apmcId);
      isFavorite = true;
    }

    return { isFavorite, favorites };
  }
}

export const favoriteRepository = new FavoriteRepository();
