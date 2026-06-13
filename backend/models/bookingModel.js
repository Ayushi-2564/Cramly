import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: [true, "Session date and time is required"],
    },

    durationMinutes: {
      type: Number,
      default: 60,
      min: [30, "Minimum session duration is 30 minutes"],
    },

    message: {
      type: String,
      default: "",
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    meetingLink: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ student: 1, createdAt: -1 });
bookingSchema.index({ teacher: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;