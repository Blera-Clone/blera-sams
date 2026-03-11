import { Router } from "express";
import { getHistoryTelemetry } from "./controllers/telemetryController.js";
import verifyUser from "../users/controller/userAuthMiddleware.js";


const router = Router();

router.get('/history', verifyUser, getHistoryTelemetry);

export default router;