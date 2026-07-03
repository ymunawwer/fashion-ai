import mongoose, { Model } from "mongoose";
import { getNextSequence } from "../counter/counter.model";

interface IOutfit {
    code: string;
    name: string;
    description?: string;
    items: { item: mongoose.Types.ObjectId; notes?: string }[];
    category?: "Casual"|"Formal"|"Party"|"Wedding"|"Sports"|"Travel"|"Other";
    occasion?: string;
    season?: "Summer"|"Winter"|"Monsoon"|"Spring"|"Autumn"|"All";
    imageUrl?: string[];
    tags?: string[];
    lastWorn?: Date;
    wearCount?: number;
    rating?: number;
    ratings?: { user: mongoose.Types.ObjectId; rating: number; review?: string; createdAt: Date }[];
    isFavourite?: boolean;
    isDeleted?: boolean;
    weatherSuitability?: { temperatureRange?: [number, number]; rainFriendly?: boolean; windFriendly?: boolean };
    aiFeatures?: { embedding?: number[]; styleScore?: number; recommendedByAI?: boolean };
    createdBy?: mongoose.Types.ObjectId;
  }
  
  export interface OutfitDocument extends IOutfit, Document {}
  interface OutfitModel extends Model<OutfitDocument> {}
  
  const outfitSchema = new mongoose.Schema<OutfitDocument, OutfitModel>(
    {
      code: { type: String, unique: true },
      name: { type: String, required: true, trim: true },
      description: String,
      items: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: "Wardrobe", required: true }, notes: String }],
      category: { type: String, enum: ["Casual","Formal","Party","Wedding","Sports","Travel","Other"] },
      occasion: String,
      season: { type: String, enum: ["Summer","Winter","Monsoon","Spring","Autumn","All"], default: "All" },
      imageUrl: [String],
      tags: [String],
      lastWorn: Date,
      wearCount: { type: Number, default: 0 },
      rating: Number,
      ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: Number, review: String, createdAt: { type: Date, default: Date.now } }],
      isFavourite: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false, index: true },
      weatherSuitability: { temperatureRange: [Number], rainFriendly: Boolean, windFriendly: Boolean },
      aiFeatures: { embedding: [Number], styleScore: Number, recommendedByAI: Boolean },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
  );
  
  /* Hooks */
  outfitSchema.pre("save", async function(next) {
    if (this.isModified("lastWorn")) this.wearCount = (this.wearCount || 0) + 1;
    
    if (this.isNew) { // Only for new documents
      // Get the next sequence number for outfit
      const seq = await getNextSequence('test', 'outfit');
      this.code = String(seq);
    }
    
    next();
  });
  
  /* Query Helpers */
//   outfitSchema.query.notDeleted = function() { return this.where({ isDeleted: false }); };
//   outfitSchema.query.favourites = function() { return this.where({ isFavourite: true }); };
  
  const Outfit = mongoose.model<OutfitDocument, OutfitModel>("Outfit", outfitSchema);
  export default Outfit;
  