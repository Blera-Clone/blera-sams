import { Router } from "express";
import {
  addAsset,
  deleteAsset,
  getAssetById,
  getAssets,
  updateAsset,
} from "./controllers/assetController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";
import { getDashboardSummary } from "./controllers/analyticsController.js";

const router = Router();

router
  .post("/add", verifyUser, addAsset)
  .get("/", verifyUser, getAssets)
  .get("/analysis", verifyUser, getDashboardSummary) // Moved before /:id
  .get("/:id", verifyUser, getAssetById)
  .delete("/delete", verifyUser, deleteAsset)
  .put("/", verifyUser, updateAsset);

export default router;
