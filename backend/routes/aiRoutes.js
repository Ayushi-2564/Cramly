import express from "express";
import { generateStudyContent } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateStudyContent);

export default router;