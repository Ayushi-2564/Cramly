import asyncHandler from "express-async-handler";
import Tutor from "../models/tutorModel.js";
import User from "../models/userModel.js";

// @desc    Create or update tutor profile
// @route   POST /api/tutors
// @access  Private
export const createOrUpdateTutorProfile = asyncHandler(async (req, res) => {
  const {
    headline,
    bio,
    subjects,
    skills,
    pricePerHour,
    experienceYears,
    availability,
    isAvailable,
  } = req.body;

  if (!headline || !bio || !subjects || subjects.length === 0) {
    res.status(400);
    throw new Error("Please provide headline, bio and subjects");
  }

  if (pricePerHour === undefined || pricePerHour === null) {
    res.status(400);
    throw new Error("Please provide price per hour");
  }

  const tutorData = {
    user: req.user._id,
    headline,
    bio,
    subjects,
    skills: skills || [],
    pricePerHour,
    experienceYears: experienceYears || 0,
    university: req.user.university || "",
    availability: availability || "Available on request",
    isAvailable: isAvailable ?? true,
  };

  let tutor = await Tutor.findOne({ user: req.user._id });

  if (tutor) {
    tutor = await Tutor.findOneAndUpdate(
      { user: req.user._id },
      tutorData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email profileImage university roles");
  } else {
    tutor = await Tutor.create(tutorData);
    tutor = await Tutor.findById(tutor._id).populate(
      "user",
      "name email profileImage university roles"
    );
  }

  const user = await User.findById(req.user._id);

  if (!user.roles.includes("teacher")) {
    user.roles.push("teacher");
  }

  user.bio = bio || user.bio;
  user.subjects = subjects || user.subjects;
  user.skills = skills || user.skills;
  user.isProfileCompleted = true;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Tutor profile saved successfully",
    tutor,
  });
});

// @desc    Get all tutors with search and filters
// @route   GET /api/tutors
// @access  Private
export const getTutors = asyncHandler(async (req, res) => {
  const { search, subject, minPrice, maxPrice, minRating } = req.query;

  const query = {
    isAvailable: true,
  };

  if (subject && subject !== "All") {
    query.subjects = { $in: [subject] };
  }

  if (minPrice || maxPrice) {
    query.pricePerHour = {};

    if (minPrice) {
      query.pricePerHour.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.pricePerHour.$lte = Number(maxPrice);
    }
  }

  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  let tutors = await Tutor.find(query)
    .populate("user", "name email profileImage university roles")
    .sort({ rating: -1, createdAt: -1 });

  if (search) {
    const lowerSearch = search.toLowerCase();

    tutors = tutors.filter((tutor) => {
      const name = tutor.user?.name?.toLowerCase() || "";
      const headline = tutor.headline?.toLowerCase() || "";
      const bio = tutor.bio?.toLowerCase() || "";
      const subjectsText = tutor.subjects.join(" ").toLowerCase();

      return (
        name.includes(lowerSearch) ||
        headline.includes(lowerSearch) ||
        bio.includes(lowerSearch) ||
        subjectsText.includes(lowerSearch)
      );
    });
  }

  res.status(200).json({
    success: true,
    message: "Tutors fetched successfully",
    count: tutors.length,
    tutors,
  });
});

// @desc    Get logged-in user's tutor profile
// @route   GET /api/tutors/me
// @access  Private
export const getMyTutorProfile = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findOne({ user: req.user._id }).populate(
    "user",
    "name email profileImage university roles"
  );

  if (!tutor) {
    res.status(404);
    throw new Error("Tutor profile not found");
  }

  res.status(200).json({
    success: true,
    message: "Tutor profile fetched successfully",
    tutor,
  });
});

// @desc    Get single tutor by id
// @route   GET /api/tutors/:id
// @access  Private
export const getTutorById = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findById(req.params.id).populate(
    "user",
    "name email profileImage university roles"
  );

  if (!tutor) {
    res.status(404);
    throw new Error("Tutor not found");
  }

  res.status(200).json({
    success: true,
    message: "Tutor fetched successfully",
    tutor,
  });
});