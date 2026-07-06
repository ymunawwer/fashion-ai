import { Router } from "express";
import { LoyaltyController } from "../../modules/loyalty/loyalty.controller";

const router = Router();

// Loyalty routes
router.get("/balance", LoyaltyController.getBalance);

export default router;
