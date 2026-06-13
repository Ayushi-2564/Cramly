import asyncHandler from "express-async-handler";
import Booking from "../models/bookingModel.js";
import Tutor from "../models/tutorModel.js";

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { tutorId, subject, scheduledAt, durationMinutes, message } = req.body;

  if (!tutorId || !subject || !scheduledAt) {
    res.status(400);
    throw new Error("Please provide tutor, subject and session time");
  }

  const tutor = await Tutor.findById(tutorId).populate(
    "user",
    "name email university"
  );

  if (!tutor) {
    res.status(404);
    throw new Error("Tutor not found");
  }

  if (String(tutor.user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot book a session with yourself");
  }

  const sessionDate = new Date(scheduledAt);

  if (Number.isNaN(sessionDate.getTime())) {
    res.status(400);
    throw new Error("Invalid session date and time");
  }

  if (sessionDate < new Date()) {
    res.status(400);
    throw new Error("Session time must be in the future");
  }

  const finalDuration = Number(durationMinutes) || 60;

  const price = Math.round((tutor.pricePerHour * finalDuration) / 60);

  const booking = await Booking.create({
    student: req.user._id,
    teacher: tutor.user._id,
    tutor: tutor._id,
    subject,
    scheduledAt: sessionDate,
    durationMinutes: finalDuration,
    message: message || "",
    price,
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("student", "name email profileImage university")
    .populate("teacher", "name email profileImage university")
    .populate("tutor", "headline subjects pricePerHour rating");

  res.status(201).json({
    success: true,
    message: "Booking request created successfully",
    booking: populatedBooking,
  });
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    $or: [{ student: req.user._id }, { teacher: req.user._id }],
  })
    .populate("student", "name email profileImage university")
    .populate("teacher", "name email profileImage university")
    .populate("tutor", "headline subjects pricePerHour rating")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    count: bookings.length,
    bookings,
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("student", "name email profileImage university")
    .populate("teacher", "name email profileImage university")
    .populate("tutor", "headline subjects pricePerHour rating");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isStudent = String(booking.student._id) === String(req.user._id);
  const isTeacher = String(booking.teacher._id) === String(req.user._id);

  if (!isStudent && !isTeacher) {
    res.status(403);
    throw new Error("You are not allowed to view this booking");
  }

  res.status(200).json({
    success: true,
    message: "Booking fetched successfully",
    booking,
  });
});

// @desc    Accept booking request
// @route   PATCH /api/bookings/:id/accept
// @access  Private teacher
export const acceptBooking = asyncHandler(async (req, res) => {
  const { meetingLink } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only assigned teacher can accept this booking");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Only pending bookings can be accepted");
  }

  booking.status = "accepted";
  booking.meetingLink = meetingLink || "Meeting link will be shared soon";

  const updatedBooking = await booking.save();

  const populatedBooking = await Booking.findById(updatedBooking._id)
    .populate("student", "name email profileImage university")
    .populate("teacher", "name email profileImage university")
    .populate("tutor", "headline subjects pricePerHour rating");

  res.status(200).json({
    success: true,
    message: "Booking accepted successfully",
    booking: populatedBooking,
  });
});

// @desc    Reject booking request
// @route   PATCH /api/bookings/:id/reject
// @access  Private teacher
export const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only assigned teacher can reject this booking");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Only pending bookings can be rejected");
  }

  booking.status = "rejected";

  const updatedBooking = await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking rejected successfully",
    booking: updatedBooking,
  });
});

// @desc    Mark booking completed
// @route   PATCH /api/bookings/:id/complete
// @access  Private teacher
export const completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only assigned teacher can complete this booking");
  }

  if (booking.status !== "accepted") {
    res.status(400);
    throw new Error("Only accepted bookings can be completed");
  }

  booking.status = "completed";

  const updatedBooking = await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking marked as completed",
    booking: updatedBooking,
  });
});

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private student
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.student) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only student can cancel this booking");
  }

  if (!["pending", "accepted"].includes(booking.status)) {
    res.status(400);
    throw new Error("This booking cannot be cancelled");
  }

  booking.status = "cancelled";

  const updatedBooking = await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking: updatedBooking,
  });
});