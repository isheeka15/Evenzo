import api from './api';

export const bookingService = {
  bookEvent: async (eventId, bookingData) => {
    const response = await api.post(`/bookings/${eventId}`, bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
};
