import express from "express";
import {
  startConversation,
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getConversations);
router.post("/start", protect, startConversation);

router.get("/:conversationId/messages", protect, getMessages);
router.post("/:conversationId/messages", protect, sendMessage);
router.patch("/:conversationId/read", protect, markMessagesAsRead);

export default router;