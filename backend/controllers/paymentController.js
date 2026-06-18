import crypto from "crypto";
import asyncHandler from "express-async-handler";

import Booking from "../models/bookingModel.js";
import razorpay from "../config/razorpay.js";

// @desc    Create Razorpay order for a booking
// @route   POST /api/payments/create-order
// @access  Private student
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error("Booking id is required");
  }

  const booking = await Booking.findById(bookingId)
    .populate("student", "name email")
    .populate("teacher", "name email");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.student._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only the student can pay for this booking");
  }

  if (["rejected", "cancelled"].includes(booking.status)) {
    res.status(400);
    throw new Error("Cannot pay for rejected or cancelled booking");
  }

  if (booking.paymentStatus === "paid") {
    res.status(400);
    throw new Error("Payment is already completed");
  }

  if (!booking.price || booking.price <= 0) {
    res.status(400);
    throw new Error("Booking price must be greater than 0");
  }

  const orderOptions = {
    amount: booking.price * 100,
    currency: "INR",
    receipt: `booking_${booking._id}`,
    notes: {
      bookingId: String(booking._id),
      studentId: String(booking.student._id),
      teacherId: String(booking.teacher._id),
    },
  };

  const order = await razorpay.orders.create(orderOptions);

  booking.razorpayOrderId = order.id;
  booking.paymentStatus = "created";

  await booking.save();

  res.status(200).json({
    success: true,
    message: "Payment order created successfully",
    order,
    booking: {
      _id: booking._id,
      price: booking.price,
      subject: booking.subject,
    },
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private student
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !bookingId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    res.status(400);
    throw new Error("Payment verification details are missing");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(booking.student) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only the student can verify this payment");
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    booking.paymentStatus = "failed";
    await booking.save();

    res.status(400);
    throw new Error("Payment verification failed");
  }

  booking.paymentStatus = "paid";
  booking.razorpayOrderId = razorpay_order_id;
  booking.razorpayPaymentId = razorpay_payment_id;
  booking.paidAt = new Date();

  if (booking.status === "pending") {
    booking.status = "accepted";
  }

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate("student", "name email profileImage university")
    .populate("teacher", "name email profileImage university")
    .populate("tutor", "headline subjects pricePerHour rating");

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    booking: updatedBooking,
  });
});