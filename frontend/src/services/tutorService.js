import api from "./api";

export const getTutors = async (params = {}) => {
  const response = await api.get("/tutors", { params });
  return response.data;
};

export const getTutorById = async (id) => {
  const response = await api.get(`/tutors/${id}`);
  return response.data;
};

export const getMyTutorProfile = async () => {
  const response = await api.get("/tutors/me");
  return response.data;
};

export const createOrUpdateTutorProfile = async (tutorData) => {
  const response = await api.post("/tutors", tutorData);
  return response.data;
};