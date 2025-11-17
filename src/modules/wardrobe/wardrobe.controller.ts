import { Request, Response } from "express";
import { WardrobeService } from "./wardrobe.service";

export class WardrobeController {
  static async create(req: Request, res: Response) {
    try {
      const item = await WardrobeService.createWardrobe(req.body);
      res.status(201).json(item);
    } catch (err: any) {
        console.log(JSON.stringify(err))
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID is required" });
      const item = await WardrobeService.getWardrobeById(id);
      if (!item) return res.status(404).json({ message: "Not found" });
      return res.json(item);
    } catch (err: any) {
        console.log(JSON.stringify(err))
      return res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const items = await WardrobeService.getAllWardrobes(req.query);
      res.json(items);
    } catch (err: any) {
        console.log(JSON.stringify(err))
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const item = await WardrobeService.updateWardrobe(id, req.body);
      return res.json(item);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const item = await WardrobeService.deleteWardrobe(id);
      return res.json(item);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async toggleFavourite(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const item = await WardrobeService.toggleFavourite(id);
      return res.json(item);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async findSimilar(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });
      const items = await WardrobeService.findSimilar(id);
      return res.json(items);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // GET /wardrobe/frequent?limit=5
static async frequent(req: Request, res: Response) {
    const limit = parseInt(req.query["limit"] as string) || 10;
    const frequent = req.query["type"] !== "rare"; // default frequent
    const items = await WardrobeService.getFrequentOrRareItems(limit, frequent);
    res.json(items);
  }
  
  // GET /wardrobe/filter?color=Red&category=Topwear&priceMax=2000
  static async filter(req: Request, res: Response) {
    const items = await WardrobeService.findByFilters(req.query);
    res.json(items);
  }
  
  // GET /wardrobe/:id/similarAI
  static async similarAI(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID is required" });
    const items = await WardrobeService.findSimilarAI(id);
    return res.json(items);
  }
}
