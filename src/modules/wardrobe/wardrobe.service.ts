import Wardrobe, { WardrobeDocument } from "./wardrobe.model";

export class WardrobeService {
  // Create new wardrobe item
  static async createWardrobe(data: Partial<WardrobeDocument>, userId: string) {
    
    const item = new Wardrobe({ ...data, createdBy: userId });
    return item.save();
  }

  // Get wardrobe by ID
  static async getWardrobeById(id: string, userId: string) {
    return Wardrobe.findOne({ _id: id, createdBy: userId }).notDeleted();
  }

  // Get all items (with filters)
  static async getAllWardrobes(filter: any = {}, userId: string) {
    const { q, ...otherFilters } = filter;
    const query: any = { ...otherFilters, createdBy: userId, isDeleted: false };
    
    // Handle text search with 'q' parameter
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subCategory: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { color: { $regex: q, $options: 'i' } },
        { material: { $regex: q, $options: 'i' } },
        { season: { $in: [{ $regex: q, $options: 'i' }] } },
        { occasions: { $in: [{ $regex: q, $options: 'i' }] } },
        { condition: { $regex: q, $options: 'i' } },
        { tags: { $in: [{ $regex: q, $options: 'i' }] } }
      ];
    }
    
    return Wardrobe.find(query);
    // .notDeleted();
  }

  // Update wardrobe
  static async updateWardrobe(id: string, data: Partial<WardrobeDocument>, userId: string) {
    return Wardrobe.findOneAndUpdate({ _id: id, createdBy: userId }, data, { new: true });
  }

  // Soft delete wardrobe
  static async deleteWardrobe(id: string, userId: string) {
    return Wardrobe.findOneAndUpdate({ _id: id, createdBy: userId }, { isDeleted: true }, { new: true });
  }

  // Mark as favourite
//   static async toggleFavourite(id: string, fav: boolean) {
//     return Wardrobe.findByIdAndUpdate(id, { isFavourite: fav }, { new: true });
//   }

  // Find by AI recommendation or tags
  static async findSimilar(id: string, userId: string) {
    const item = await Wardrobe.findOne({ _id: id, createdBy: userId });
    if (!item || !item.tags?.length) return [];
    return Wardrobe.find({ _id: { $ne: id }, createdBy: userId, tags: { $in: item.tags } }).limit(10);
  }

    // 1. Find least/frequently worn items
    static async getFrequentOrRareItems(limit: number = 10, frequent: boolean = true, userId: string) {
        return Wardrobe.find({ createdBy: userId })
        //   .notDeleted()
          .sort({ wearCount: frequent ? -1 : 1 })
          .limit(limit);
      }

      // 2. Find by color, category, price range
  static async findByFilters(filters: {
    color?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    tags?: string[];
  }, userId: string) {
    const query: any = { isDeleted: false, createdBy: userId };
    if (filters.color) query.color = filters.color;
    if (filters.category) query.category = filters.category;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      query.price = {};
      if (filters.priceMin !== undefined) query.price.$gte = filters.priceMin;
      if (filters.priceMax !== undefined) query.price.$lte = filters.priceMax;
    }
    if (filters.tags?.length) query.tags = { $in: filters.tags };
    return Wardrobe.find(query);
  }

  // 3. AI-based similarity search (tags or embedding)
  static async findSimilarAI(itemId: string, userId: string, limit: number = 10) {
    const item = await Wardrobe.findOne({ _id: itemId, createdBy: userId });
    if (!item) return [];

    // Simple tag-based similarity for now
    const tagQuery = item.tags?.length ? { tags: { $in: item.tags } } : {};
    return Wardrobe.find({ _id: { $ne: itemId }, createdBy: userId, ...tagQuery }).limit(limit);
  }

   // Toggle isFavourite
   static async toggleFavourite(id: string, userId: string) {
    const wardrobeItem = await Wardrobe.findOne({ _id: id, createdBy: userId });
    if (!wardrobeItem) throw new Error("Wardrobe item not found");

    wardrobeItem.isFavourite = !wardrobeItem.isFavourite;
    await wardrobeItem.save();

    return wardrobeItem;
  }

}
