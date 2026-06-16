import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../services/chatService";
import useAuthStore from "../store/authStore";
import useSocket from "../hooks/useSocket";

const Chat = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { socket, onlineUsers } = useSocket(user?._id);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await getConversations();

      setConversations(data.conversations || []);

      const targetId = location.state?.conversationId;

      if (targetId) {
        const targetConversation = data.conversations?.find(
          (conversation) => conversation._id === targetId
        );

        if (targetConversation) {
          setSelectedConversation(targetConversation);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch chats");
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await getMessages(conversationId);
      setMessages(data.messages || []);
      await markMessagesAsRead(conversationId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation?._id || !socket) return;

    socket.emit("joinConversation", selectedConversation._id);
    fetchMessages(selectedConversation._id);

    return () => {
      socket.emit("leaveConversation", selectedConversation._id);
    };
  }, [selectedConversation?._id, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.conversation === selectedConversation?._id) {
        setMessages((prev) => {
          const exists = prev.some((message) => message._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });
      }

      fetchConversations();
    });

    socket.on("conversationUpdated", () => {
      fetchConversations();
    });

    return () => {
      socket.off("newMessage");
      socket.off("conversationUpdated");
    };
  }, [socket, selectedConversation?._id]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (text) => {
    if (!selectedConversation?._id) return;

    try {
      const data = await sendMessage(selectedConversation._id, text);

      setMessages((prev) => {
        const exists = prev.some(
          (message) => message._id === data.chatMessage._id
        );

        return exists ? prev : [...prev, data.chatMessage];
      });

      fetchConversations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Realtime
        </p>

        <h1 className="mt-3 font-heading text-4xl font-bold">Chat</h1>

        <p className="mt-3 text-slate-400">
          Chat instantly with tutors and students.
        </p>
      </div>

      {loadingConversations ? (
        <div className="glass h-[72vh] animate-pulse rounded-3xl" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelect={handleSelectConversation}
            currentUserId={user?._id}
            onlineUsers={onlineUsers}
          />

          <ChatWindow
            selectedConversation={selectedConversation}
            messages={messages}
            currentUserId={user?._id}
            onSend={handleSendMessage}
            onlineUsers={onlineUsers}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;