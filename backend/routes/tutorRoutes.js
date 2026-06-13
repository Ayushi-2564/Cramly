import express from "express";
import {
  createOrUpdateTutorProfile,
  getTutors,
  getMyTutorProfile,
  getTutorById,
} from "../controllers/tutorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTutors).post(protect, createOrUpdateTutorProfile);

router.get("/me", protect, getMyTutorProfile);

router.get("/:id", protect, getTutorById);

export default router;