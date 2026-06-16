import asyncHandler from "express-async-handler";
import { Readable } from "stream";

import Note from "../models/noteModel.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder, resourceType = "raw") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};

const toArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

// @desc    Upload note / PYQ / PDF
// @route   POST /api/notes
// @access  Private
export const uploadNote = asyncHandler(async (req, res) => {
  const { title, description, subject, semester, type, tags, price } = req.body;

  if (!title || !subject) {
    res.status(400);
    throw new Error("Please provide title and subject");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  const isPdf = req.file.mimetype === "application/pdf";

  const cloudinaryResult = await uploadToCloudinary(
    req.file.buffer,
    "cramly/notes",
    isPdf ? "raw" : "image"
  );

  const notePrice = Number(price || 0);

  const note = await Note.create({
    uploader: req.user._id,
    title,
    description: description || "",
    subject,
    semester: semester || "",
    type: type || "notes",
    tags: toArray(tags),
    fileUrl: cloudinaryResult.secure_url,
    filePublicId: cloudinaryResult.public_id,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    price: notePrice,
    isFree: notePrice === 0,
  });

  const populatedNote = await Note.findById(note._id).populate(
    "uploader",
    "name email university profileImage"
  );

  res.status(201).json({
    success: true,
    message: "Note uploaded successfully",
    note: populatedNote,
  });
});

// @desc    Get all notes with search/filter
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const { search, subject, type, isFree } = req.query;

  const query = {};

  if (subject && subject !== "All") {
    query.subject = subject;
  }

  if (type && type !== "All") {
    query.type = type;
  }

  if (isFree === "true") {
    query.isFree = true;
  }

  let notes = await Note.find(query)
    .populate("uploader", "name email university profileImage")
    .sort({ createdAt: -1 });

  if (search) {
    const lowerSearch = search.toLowerCase();

    notes = notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const description = note.description?.toLowerCase() || "";
      const subjectText = note.subject?.toLowerCase() || "";
      const tagsText = note.tags.join(" ").toLowerCase();

      return (
        title.includes(lowerSearch) ||
        description.includes(lowerSearch) ||
        subjectText.includes(lowerSearch) ||
        tagsText.includes(lowerSearch)
      );
    });
  }

  res.status(200).json({
    success: true,
    message: "Notes fetched successfully",
    count: notes.length,
    notes,
  });
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate(
    "uploader",
    "name email university profileImage"
  );

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.status(200).json({
    success: true,
    message: "Note fetched successfully",
    note,
  });
});

// @desc    Download note / increase download count
// @route   PATCH /api/notes/:id/download
// @access  Private
export const downloadNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  note.downloads += 1;
  await note.save();

  res.status(200).json({
    success: true,
    message: "Download link generated successfully",
    fileUrl: note.fileUrl,
    downloads: note.downloads,
  });
});

// @desc    Delete uploaded note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  if (String(note.uploader) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can delete only your own notes");
  }

  const resourceType = note.fileType === "application/pdf" ? "raw" : "image";

  await cloudinary.uploader.destroy(note.filePublicId, {
    resource_type: resourceType,
  });

  await note.deleteOne();

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
});