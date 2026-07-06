import { Request, Response } from "express";
import LoyaltyService from "./loyalty.service";

export class LoyaltyController {
  static async getBalance(req: Request, res: Response) {
    try {
      const userId = req.headers['x-id'] as string;
      if (!userId) return res.status(401).json({ error: "User ID required in x-id header" });
      
      const balance = await LoyaltyService.getBalance(userId);
      return res.json(balance);
    } catch (err: any) {
      console.log("Loyalty balance error:", JSON.stringify(err));
      return res.status(400).json({ error: err.message });
    }
  }
}
