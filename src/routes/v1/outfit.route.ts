import { Router } from "express";
import { OutfitController } from "../../modules/outfit/outfit.controller";

const router = Router();



// Outfit routes
router.post("/", OutfitController.create);
router.get("/:id", OutfitController.getById);
router.get("/", OutfitController.getAll);
router.put("/:id", OutfitController.update);
router.delete("/:id", OutfitController.delete);
router.put("/:id/favourite", OutfitController.toggleFavourite);
router.get("/search", OutfitController.findBySeasonAndOccasion);
router.get("/searchFilters", OutfitController.searchFilters);
router.get("/AIRecommended", OutfitController.AIRecommended);
router.get("/frequent", OutfitController.frequent);
router.get("/weather", OutfitController.weather);

export default router;
