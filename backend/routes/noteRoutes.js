import express from "express";

import {
  uploadNote,
  getNotes,
  getNoteById,
  downloadNote,
  deleteNote,
} from "../controllers/noteController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getNotes)
  .post(protect, upload.single("file"), uploadNote);

router.get("/:id", protect, getNoteById);
router.patch("/:id/download", protect, downloadNote);
router.delete("/:id", protect, deleteNote);

export default router;