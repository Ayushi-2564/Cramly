import api from "./api";

export const getNotes = async (params = {}) => {
  const response = await api.get("/notes", { params });
  return response.data;
};

export const uploadNote = async (formData) => {
  const response = await api.post("/notes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const downloadNote = async (noteId) => {
  const response = await api.patch(`/notes/${noteId}/download`);
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
};