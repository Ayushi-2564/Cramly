import asyncHandler from "express-async-handler";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

const populateConversation = async (conversationId) => {
  return await Conversation.findById(conversationId)
    .populate("participants", "name email profileImage university roles")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name email profileImage",
      },
    });
};

// @desc    Start or get existing conversation
// @route   POST /api/chat/start
// @access  Private
export const startConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (!participantId) {
    res.status(400);
    throw new Error("Participant id is required");
  }

  if (String(participantId) === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot start chat with yourself");
  }

  const participant = await User.findById(participantId);

  if (!participant) {
    res.status(404);
    throw new Error("User not found");
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [req.user._id, participantId],
      $size: 2,
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, participantId],
    });
  }

  const populatedConversation = await populateConversation(conversation._id);

  res.status(200).json({
    success: true,
    message: "Conversation ready",
    conversation: populatedConversation,
  });
});

// @desc    Get logged-in user's conversations
// @route   GET /api/chat
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", "name email profileImage university roles")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name email profileImage",
      },
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    message: "Conversations fetched successfully",
    conversations,
  });
});

// @desc    Get messages of a conversation
// @route   GET /api/chat/:conversationId/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "name email profileImage")
    .sort({ createdAt: 1 });

  await Message.updateMany(
    {
      conversation: conversationId,
      readBy: { $ne: req.user._id },
    },
    {
      $addToSet: {
        readBy: req.user._id,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    messages,
  });
});

// @desc    Send message
// @route   POST /api/chat/:conversationId/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Message cannot be empty");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    text: text.trim(),
    readBy: [req.user._id],
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageText = text.trim();
  await conversation.save();

  const populatedMessage = await Message.findById(message._id).populate(
    "sender",
    "name email profileImage"
  );

  const populatedConversation = await populateConversation(conversation._id);

  const io = req.app.get("io");

  if (io) {
    io.to(`conversation:${conversationId}`).emit("newMessage", populatedMessage);

    populatedConversation.participants.forEach((participant) => {
      io.to(`user:${participant._id}`).emit(
        "conversationUpdated",
        populatedConversation
      );
    });
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    chatMessage: populatedMessage,
  });
});

// @desc    Mark conversation messages as read
// @route   PATCH /api/chat/:conversationId/read
// @access  Private
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      readBy: { $ne: req.user._id },
    },
    {
      $addToSet: {
        readBy: req.user._id,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });
});