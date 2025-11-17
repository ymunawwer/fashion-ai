// 


import mongoose, { Document, Model, QueryWithHelpers } from "mongoose";
import { getNextSequence } from "../counter/counter.model";

// --- Interfaces ---
interface IWardrobe {
  code: string;
  name: string;
  description?: string;
  category: string;
  subCategory?: string;
  gender?: "Male" | "Female" | "Unisex";
  color?: string;
  pattern?: string;
  season?: ("Summer" | "Winter" | "Monsoon" | "Spring" | "Autumn" | "Fall" |"All" | "summer" | "winter" | "monsoon" | "spring" | "autumn" | "fall" | "all")[];
  occasions?: string[];
  imageUrl?: string[];
  tags?: string[];
  lastWorn?: Date;
  wearCount?: number;
  isFavourite?: boolean;
  status?: "Available" | "In Laundry" | "Damaged" | "Lent" | "Archived";
  isDeleted?: boolean;
  purchasedDate?: Date;
  purchasePlace?: string;
  price?: number;
  currency?: string;
  brand?: string;
  material?: string;
  size?: string;
  fit?: string;
  condition?: "New" | "Good" | "Worn" | "Old" | "Damaged";
  defect?: string;
  careInstructions?: string;
  storageLocation?: string;
  lentTo?: {
    name: string;
    contact: string;
    returnDate?: Date;
  };
  outfitMatches?: mongoose.Types.ObjectId[];
  aiFeatures?: {
    embedding?: number[];
    dominantColors?: string[];
    styleScore?: number;
  };
  ecoFriendly?: boolean;
  recycleEligible?: boolean;
  sharedOn?: {
    instagram?: boolean;
    pinterest?: boolean;
    tiktok?: boolean;
  };
  ratings?: {
    user: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    createdAt: Date;
  }[];
  createdBy?: mongoose.Types.ObjectId;
}

export interface WardrobeDocument extends IWardrobe, Document {}
interface WardrobeQueryHelpers {
  notDeleted(): QueryWithHelpers<any, WardrobeDocument, WardrobeQueryHelpers>;
  available(): QueryWithHelpers<any, WardrobeDocument, WardrobeQueryHelpers>;
  favourites(): QueryWithHelpers<any, WardrobeDocument, WardrobeQueryHelpers>;
}
interface WardrobeModel extends Model<WardrobeDocument, WardrobeQueryHelpers> {}

const wardrobeSchema = new mongoose.Schema<
  WardrobeDocument,
  WardrobeModel,
  {},
  WardrobeQueryHelpers
>(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    description: String,
    category: { type: String, required: true },
    subCategory: String,
    gender: { type: String, enum: ["Male", "Female", "Unisex"], default: "Unisex" },
    color: String,
    pattern: String,
    season: { type: [String], enum: ["Summer","Winter","winter","Monsoon","Spring","Autumn","Fall","All","summer","monsoon","spring","autumn","all","fall"], default: ["All"] },
    occasions: [String],
    imageUrl: [String],
    tags: [String],
    lastWorn: Date,
    wearCount: { type: Number, default: 0 },
    isFavourite: { type: Boolean, default: false },
    status: { type: String, enum: ["Available","In Laundry","Damaged","Lent","Archieved"], default: "Available" },
    isDeleted: { type: Boolean, default: false, index: true },
    purchasedDate: Date,
    purchasePlace: String,
    price: Number,
    currency: { type: String, default: "INR" },
    brand: String,
    material: String,
    size: String,
    fit: String,
    condition: { type: String, enum: ["New","Good","Worn","Old","Damaged"], default: "Good" },
    defect: String,
    careInstructions: String,
    storageLocation: String,
    lentTo: { name: String, contact: String, returnDate: Date },
    outfitMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wardrobe" }],
    aiFeatures: { embedding: [Number], dominantColors: [String], styleScore: Number },
    ecoFriendly: { type: Boolean, default: false },
    recycleEligible: { type: Boolean, default: false },
    sharedOn: { instagram: Boolean, pinterest: Boolean, tiktok: Boolean },
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: Number, review: String, createdAt: { type: Date, default: Date.now } }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Add query helpers with proper types
wardrobeSchema.query.notDeleted = function (this: QueryWithHelpers<any, WardrobeDocument, WardrobeQueryHelpers>) {
  return this.where({ isDeleted: false });
};

wardrobeSchema.query.available = function (this: QueryWithHelpers<any, WardrobeDocument, WardrobeQueryHelpers>) {
  return this.where({ status: "Available" });
};

wardrobeSchema.query.favourites = function (this: QueryWithHelpers<any, WardrobeDocument, WardrobeQueryHelpers>) {
  return this.where({ isFavourite: true });
};

/* Hooks */
wardrobeSchema.pre("save",async function(next) {
  if (this.isModified("lastWorn")) this.wearCount = (this.wearCount || 0) + 1;
  if (this.isNew) { // Only for new documents
  
      
      // Get the next sequence number for this user --this.createdBy.toString()
      const seq = await getNextSequence('test','wardrobe');
      this.code = String(seq);
    
}
  next();
});





/* Virtuals */
wardrobeSchema.virtual("ageInYears").get(function() {
  if (!this.purchasedDate) return null;
  return Math.floor((Date.now() - this.purchasedDate.getTime()) / (1000*60*60*24*365));
});
wardrobeSchema.virtual("costPerWear").get(function() {
  if (!this.price || !this.wearCount) return null;
  return this.price / this.wearCount;
});

const Wardrobe = mongoose.model<WardrobeDocument, WardrobeModel>("Wardrobe", wardrobeSchema);
export default Wardrobe;
