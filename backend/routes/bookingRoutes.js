import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createBooking).get(protect, getMyBookings);

router.get("/:id", protect, getBookingById);

router.patch("/:id/accept", protect, acceptBooking);
router.patch("/:id/reject", protect, rejectBooking);
router.patch("/:id/complete", protect, completeBooking);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;