import express from "express";

import {
  createReview,
  getTutorReviews,
  getMyGivenReviews,
  getMyReceivedReviews,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);

router.get("/my-given", protect, getMyGivenReviews);
router.get("/my-received", protect, getMyReceivedReviews);

router.get("/tutor/:tutorId", protect, getTutorReviews);

export default router;