import Outfit, { OutfitDocument } from "./outfit.model";

export class OutfitService {
  static async createOutfit(data: Partial<OutfitDocument>, userId: string) {
    const outfit = new Outfit({ ...data, createdBy: userId });
    return outfit.save();
  }

  static async getOutfitById(id: string, userId: string) {
    return Outfit.findOne({ _id: id, createdBy: userId })
    // .notDeleted()
    .populate("items.item");
  }

  static async getAllOutfits(filter: any = {}, userId: string) {
    return Outfit.find({ ...filter, createdBy: userId })
    // .notDeleted()
    .populate("items.item");
  }

  static async updateOutfit(id: string, data: Partial<OutfitDocument>, userId: string) {
    return Outfit.findOneAndUpdate({ _id: id, createdBy: userId }, data, { new: true });
  }

  static async deleteOutfit(id: string, userId: string) {
    return Outfit.findOneAndUpdate({ _id: id, createdBy: userId }, { isDeleted: true }, { new: true });
  }

  static async toggleFavourite(id: string, fav: boolean, userId: string) {
    return Outfit.findOneAndUpdate({ _id: id, createdBy: userId }, { isFavourite: fav }, { new: true });
  }

  static async findBySeasonAndOccasion(season: string, occasion: string, userId: string) {
    return Outfit.find({ season, occasion, createdBy: userId })
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
  }, userId: string) {
    return Outfit.find({ createdBy: userId })
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
    static async findAIRecommendedOutfits(limit: number = 10, userId: string) {
        return Outfit.find({ "aiFeatures.recommendedByAI": true, createdBy: userId })
        //   .notDeleted()
          .sort({ "aiFeatures.styleScore": -1 })
          .limit(limit)
          .populate("items.item");
      }

        /**
   * 3️⃣ Most worn / least worn outfits
   */
  static async getFrequentOrRareOutfits(limit: number = 10, frequent: boolean = true, userId: string) {
    return Outfit.find({ createdBy: userId })
    // .notDeleted()
    .sort({ wearCount: frequent ? -1 : 1 }).limit(limit);
  }
  static async findWeatherOutfits(filters: {
    temperature?: number;
    rain?: boolean;
    wind?: boolean;
  }, userId: string) {
    const query: any = { isDeleted: false, createdBy: userId };
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
