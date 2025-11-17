import { Request, Response } from "express";
import { OutfitService } from "./outfit.service";

export class OutfitController {
  static async create(req: Request, res: Response) {
    try {
      const outfit = await OutfitService.createOutfit(req.body);
      res.status(201).json(outfit);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const outfit = await OutfitService.getOutfitById(id);
      if (!outfit) return res.status(404).json({ message: "Not found" });
      return res.json(outfit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const outfits = await OutfitService.getAllOutfits(req.query);
      res.json(outfits);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const outfit = await OutfitService.updateOutfit(id, req.body);
      return res.json(outfit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const outfit = await OutfitService.deleteOutfit(id);
      return res.json(outfit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async toggleFavourite(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const outfit = await OutfitService.toggleFavourite(id, req.body.fav);
      return res.json(outfit);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async findBySeasonAndOccasion(req: Request, res: Response) {
    try {
      const { season, occasion } = req.query;
      const outfits = await OutfitService.findBySeasonAndOccasion(
        season as string,
        occasion as string
      );
      res.json(outfits);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // GET /outfit/searchFilters?color=Red&priceMax=2000&season=Summer&occasion=Wedding
static async searchFilters(req: Request, res: Response) {
    const outfits = await OutfitService.findOutfitsByWardrobeFilters(req.query);
    res.json(outfits);
  }
  
  // GET /outfit/AIRecommended?limit=5
  static async AIRecommended(req: Request, res: Response) {
    const limit = parseInt(req.query["limit"] as string) || 10;
    const outfits = await OutfitService.findAIRecommendedOutfits(limit);
    res.json(outfits);
  }
  
  // GET /outfit/frequent?type=rare&limit=5
  static async frequent(req: Request, res: Response) {
    const limit = parseInt(req.query["limit"] as string) || 10;
    const frequent = req.query["type"] !== "rare";
    const outfits = await OutfitService.getFrequentOrRareOutfits(limit, frequent);
    res.json(outfits);
  }
  
  // GET /outfit/weather?temperature=35&rain=true
  static async weather(req: Request, res: Response) {
    const filters = {
      temperature: req.query["temperature"] ? parseInt(req.query["temperature"]  as string) : 0,
      rain: req.query["rain"] === "true",
      wind: req.query["wind"] === "true",
    };
    const outfits = await OutfitService.findWeatherOutfits(filters);
    res.json(outfits);
  }
  
}
