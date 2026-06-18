import asyncHandler from "express-async-handler";

import Review from "../models/reviewModel.js";
import Booking from "../models/bookingModel.js";
import Tutor from "../models/tutorModel.js";
import User from "../models/userModel.js";

const updateTutorRating = async (tutorId, teacherId) => {
  const reviews = await Review.find({ tutor: tutorId });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const roundedRating = Number(averageRating.toFixed(1));

  await Tutor.findByIdAndUpdate(tutorId, {
    rating: roundedRating,
    totalReviews,
  });

  await User.findByIdAndUpdate(teacherId, {
    rating: roundedRating,
    totalReviews,
  });
};

// @desc    Create review for completed booking
// @route   POST /api/reviews
// @access  Private student
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error("Booking id is required");
  }

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.student) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only the student can review this booking");
  }

  if (booking.status !== "completed") {
    res.status(400);
    throw new Error("You can review only after session is completed");
  }

  const alreadyReviewed = await Review.findOne({ booking: bookingId });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You already reviewed this booking");
  }

  const review = await Review.create({
    booking: booking._id,
    tutor: booking.tutor,
    teacher: booking.teacher,
    student: req.user._id,
    rating,
    comment,
  });

  await updateTutorRating(booking.tutor, booking.teacher);

  const createdReview = await Review.findById(review._id)
    .populate("student", "name email profileImage")
    .populate("teacher", "name email profileImage")
    .populate("tutor", "headline subjects rating totalReviews");

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    review: createdReview,
  });
});

// @desc    Get reviews for one tutor
// @route   GET /api/reviews/tutor/:tutorId
// @access  Private
export const getTutorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tutor: req.params.tutorId })
    .populate("student", "name email profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// @desc    Get reviews given by logged-in student
// @route   GET /api/reviews/my-given
// @access  Private
export const getMyGivenReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ student: req.user._id })
    .populate("teacher", "name email profileImage")
    .populate("tutor", "headline subjects rating totalReviews")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// @desc    Get reviews received by logged-in teacher
// @route   GET /api/reviews/my-received
// @access  Private
export const getMyReceivedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ teacher: req.user._id })
    .populate("student", "name email profileImage")
    .populate("tutor", "headline subjects rating totalReviews")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});