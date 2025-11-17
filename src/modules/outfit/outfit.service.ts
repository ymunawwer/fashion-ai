import Outfit, { OutfitDocument } from "./outfit.model";

export class OutfitService {
  static async createOutfit(data: Partial<OutfitDocument>) {
    const outfit = new Outfit(data);
    return outfit.save();
  }

  static async getOutfitById(id: string) {
    return Outfit.findById(id)
    // .notDeleted()
    .populate("items.item");
  }

  static async getAllOutfits(filter: any = {}) {
    return Outfit.find(filter)
    // .notDeleted()
    .populate("items.item");
  }

  static async updateOutfit(id: string, data: Partial<OutfitDocument>) {
    return Outfit.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteOutfit(id: string) {
    return Outfit.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  static async toggleFavourite(id: string, fav: boolean) {
    return Outfit.findByIdAndUpdate(id, { isFavourite: fav }, { new: true });
  }

  static async findBySeasonAndOccasion(season: string, occasion: string) {
    return Outfit.find({ season, occasion })
    // .notDeleted()
    .populate("items.item");
  }

   /**
   * 1️⃣ Find outfits matching wardrobe item filters + season + occasion
   * Example: Red items under 2000 for Summer Wedding
   */
   static async findOutfitsByWardrobeFilters(filters: {
    color?: string;
    category?: string;
    priceMax?: number;
    season?: string;
    occasion?: string;
  }) {
    return Outfit.find()
    //   .notDeleted()
      .populate({
        path: "items.item",
        match: {
          isDeleted: false,
          ...(filters.color ? { color: filters.color } : {}),
          ...(filters.category ? { category: filters.category } : {}),
          ...(filters.priceMax ? { price: { $lte: filters.priceMax } } : {}),
        },
      })
      .where(filters.season ? { season: filters.season } : {})
      .where(filters.occasion ? { occasion: filters.occasion } : {});
  }

    /**
   * 2️⃣ AI recommended outfits based on styleScore or embedding
   */
    static async findAIRecommendedOutfits(limit: number = 10) {
        return Outfit.find({ "aiFeatures.recommendedByAI": true })
        //   .notDeleted()
          .sort({ "aiFeatures.styleScore": -1 })
          .limit(limit)
          .populate("items.item");
      }

        /**
   * 3️⃣ Most worn / least worn outfits
   */
  static async getFrequentOrRareOutfits(limit: number = 10, frequent: boolean = true) {
    return Outfit.find()
    // .notDeleted()
    .sort({ wearCount: frequent ? -1 : 1 }).limit(limit);
  }
  static async findWeatherOutfits(filters: {
    temperature?: number;
    rain?: boolean;
    wind?: boolean;
  }) {
    const query: any = { isDeleted: false };
    if (filters.temperature !== undefined) {
      query["weatherSuitability.temperatureRange"] = { $exists: true, $ne: null };
    }
    if (filters.rain !== undefined) query["weatherSuitability.rainFriendly"] = filters.rain;
    if (filters.wind !== undefined) query["weatherSuitability.windFriendly"] = filters.wind;

    const outfits = await Outfit.find(query).populate("items.item");

    // Filter by temperature manually if range exists
    if (filters.temperature !== undefined) {
      return outfits.filter(outfit => {
        return outfit.weatherSuitability?.temperatureRange
          ? filters.temperature! >= outfit.weatherSuitability.temperatureRange[0] &&
              filters.temperature! <= outfit.weatherSuitability.temperatureRange[1]
          : true;
      });
    }

    return outfits;
  }
}
