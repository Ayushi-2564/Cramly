import api from "./api";

export const createReview = async (payload) => {
  const response = await api.post("/reviews", payload);
  return response.data;
};

export const getTutorReviews = async (tutorId) => {
  const response = await api.get(`/reviews/tutor/${tutorId}`);
  return response.data;
};

export const getMyGivenReviews = async () => {
  const response = await api.get("/reviews/my-given");
  return response.data;
};

export const getMyReceivedReviews = async () => {
  const response = await api.get("/reviews/my-received");
  return response.data;
};