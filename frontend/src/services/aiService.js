import api from "./api";

export const generateStudyContent = async (payload) => {
  const response = await api.post("/ai/generate", payload);
  return response.data;
};