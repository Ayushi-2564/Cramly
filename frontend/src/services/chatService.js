import api from "./api";

export const startConversation = async (participantId) => {
  const response = await api.post("/chat/start", { participantId });
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get("/chat");
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/chat/${conversationId}/messages`);
  return response.data;
};

export const sendMessage = async (conversationId, text) => {
  const response = await api.post(`/chat/${conversationId}/messages`, {
    text,
  });
  return response.data;
};

export const markMessagesAsRead = async (conversationId) => {
  const response = await api.patch(`/chat/${conversationId}/read`);
  return response.data;
};