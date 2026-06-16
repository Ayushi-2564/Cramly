import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    semester: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: ["notes", "pyq", "important-topics", "assignment", "other"],
      default: "notes",
    },

    tags: {
      type: [String],
      default: [],
    },

    fileUrl: {
      type: String,
      required: true,
    },

    filePublicId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      default: "application/pdf",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    downloads: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },

    isFree: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ title: "text", subject: "text", description: "text" });
noteSchema.index({ subject: 1, type: 1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;