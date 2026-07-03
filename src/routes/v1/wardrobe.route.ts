import { Router } from "express";
import { WardrobeController } from "../../modules/wardrobe/wardrobe.controller";


const router = Router();

// Wardrobe routes
router.post("/", WardrobeController.create);
router.get("/frequent", WardrobeController.frequent);
router.get("/filter", WardrobeController.filter);
router.get("/", WardrobeController.getAll);
router.get("/:id/similar", WardrobeController.findSimilar);
router.get("/:id/similarAI", WardrobeController.similarAI);
router.get("/:id", WardrobeController.getById);
router.put("/:id", WardrobeController.update);
router.delete("/:id", WardrobeController.delete);
router.put("/:id/favourite", WardrobeController.toggleFavourite);



export default router;
