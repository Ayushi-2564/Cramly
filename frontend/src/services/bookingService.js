import api from "./api";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const acceptBooking = async (bookingId, meetingLink) => {
  const response = await api.patch(`/bookings/${bookingId}/accept`, {
    meetingLink,
  });
  return response.data;
};

export const rejectBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/reject`);
  return response.data;
};

export const completeBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/complete`);
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
};