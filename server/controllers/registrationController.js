const Event = require('../models/Event');
const Registration = require('../models/Registration');

const registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);

  if (!event || !event.published) {
    return res.status(404).json({ message: 'Event not found or unavailable.' });
  }

  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    event: event._id,
  });

  if (existingRegistration) {
    return res.status(400).json({ message: 'You already registered for this event.' });
  }

  if (event.attendees >= event.capacity) {
    return res.status(400).json({ message: 'This event is full.' });
  }

  const registration = await Registration.create({
    user: req.user._id,
    event: event._id,
  });

  event.attendees += 1;
  await event.save();

  res.status(201).json({
    message: 'Registration complete. See you at the event!',
    registration,
  });
};

const getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate('event')
    .sort({ registeredAt: -1 });

  res.json(registrations);
};

module.exports = { registerForEvent, getMyRegistrations };
