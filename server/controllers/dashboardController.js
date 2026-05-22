const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getDashboardStats = async (req, res) => {
  const organizerId = req.user._id;

  const events = await Event.find({ organizerId });
  const totalEvents = events.length;
  const registrations = await Registration.find({ event: { $in: events.map((item) => item._id) } });
  const totalRegistrations = registrations.length;
  const eventSummary = events.map((event) => ({
    id: event._id,
    title: event.title,
    attendees: event.attendees,
    capacity: event.capacity,
    published: event.published,
  }));

  res.json({
    totalEvents,
    totalRegistrations,
    upcomingEvents: events.filter((event) => event.eventDate >= new Date()).length,
    eventSummary,
  });
};

module.exports = { getDashboardStats };
