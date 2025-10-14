import express from "express";
import { evaluateSegmentController } from "../controllers/segmentController.js";

const router = express.Router();

// Evaluate user-defined segment
router.post("/segments/evaluate", evaluateSegmentController);

export default router;
