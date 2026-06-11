import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const normalizeRoles = (roles) => {
  if (!roles) return ["student"];

  if (Array.isArray(roles)) {
    const validRoles = roles.filter((role) =>
      ["student", "teacher"].includes(role)
    );

    return validRoles.length > 0 ? [...new Set(validRoles)] : ["student"];
  }

  if (roles === "teacher") return ["teacher"];
  if (roles === "both") return ["student", "teacher"];

  return ["student"];
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, university, roles } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    university: university || "",
    roles: normalizeRoles(roles),
  });

  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      university: user.university,
      bio: user.bio,
      skills: user.skills,
      subjects: user.subjects,
      roles: user.roles,
      rating: user.rating,
      totalReviews: user.totalReviews,
      isProfileCompleted: user.isProfileCompleted,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      university: user.university,
      bio: user.bio,
      skills: user.skills,
      subjects: user.subjects,
      roles: user.roles,
      rating: user.rating,
      totalReviews: user.totalReviews,
      isProfileCompleted: user.isProfileCompleted,
    },
  });
});

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: req.user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, university, bio, skills, subjects, roles, profileImage } =
    req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.university = university ?? user.university;
  user.bio = bio ?? user.bio;
  user.profileImage = profileImage ?? user.profileImage;

  if (Array.isArray(skills)) {
    user.skills = skills;
  }

  if (Array.isArray(subjects)) {
    user.subjects = subjects;
  }

  if (roles) {
    user.roles = normalizeRoles(roles);
  }

  user.isProfileCompleted = Boolean(
    user.name &&
      user.email &&
      user.university &&
      user.bio &&
      user.subjects.length > 0
  );

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      university: updatedUser.university,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      subjects: updatedUser.subjects,
      roles: updatedUser.roles,
      rating: updatedUser.rating,
      totalReviews: updatedUser.totalReviews,
      isProfileCompleted: updatedUser.isProfileCompleted,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});