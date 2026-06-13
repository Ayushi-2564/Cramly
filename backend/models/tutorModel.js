import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      required: [true, "Headline is required"],
      trim: true,
      maxlength: [120, "Headline cannot exceed 120 characters"],
    },

    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: [600, "Bio cannot exceed 600 characters"],
    },

    subjects: {
      type: [String],
      required: [true, "At least one subject is required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one subject is required",
      },
    },

    skills: {
      type: [String],
      default: [],
    },

    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
      min: [0, "Price cannot be negative"],
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"],
    },

    university: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      default: "Available on request",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSessions: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;