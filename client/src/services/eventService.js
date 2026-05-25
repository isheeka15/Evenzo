import api from './api';
import { events as fallbackEvents } from '../data/events';

const normalizeEventsResponse = (data) => {
  const eventsArray = Array.isArray(data)
    ? data
    : Array.isArray(data?.events)
    ? data.events
    : Array.isArray(data?.data)
    ? data.data
    : [];

  return eventsArray.length > 0 ? eventsArray : fallbackEvents;
};

export const eventService = {
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return normalizeEventsResponse(response.data);
  },

  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};