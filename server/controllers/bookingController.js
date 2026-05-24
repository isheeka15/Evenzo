const Event = require('../models/Event');
const Booking = require('../models/Booking');

const generateTicketId = () => {
  return `EVT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

const generateTransactionId = () => {
  return `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

const bookEvent = async (req, res) => {
  const { eventId } = req.params;
  const { paymentMethod, quantity = 1, amountPaid = 0, paymentDetails = {} } = req.body;

  const event = await Event.findById(eventId);
  if (!event || !event.published) {
    return res.status(404).json({ message: 'Event not found or unavailable.' });
  }

  const ticketCount = Number(quantity) || 1;
  if (ticketCount < 1) {
    return res.status(400).json({ message: 'Ticket quantity must be at least 1.' });
  }

  const capacity = event.capacity || event.maxAttendees || 200;
  if (event.attendees + ticketCount > capacity) {
    return res.status(400).json({ message: 'Not enough seats available for this event.' });
  }

  const ticketId = generateTicketId();
  const transactionId = paymentMethod === 'free' ? null : generateTransactionId();
  const paymentStatus = event.price === 0 ? 'free' : 'paid';

  const booking = await Booking.create({
    user: req.user._id,
    event: event._id,
    ticketId,
    quantity: ticketCount,
    paymentMethod: paymentMethod || 'upi',
    paymentStatus,
    amountPaid: Number(amountPaid) || 0,
    paymentDetails,
    transactionId,
  });

  event.attendees += ticketCount;
  await event.save();

  res.status(201).json({
    message: 'Booking confirmed successfully.',
    booking,
  });
};

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event')
    .sort({ createdAt: -1 });

  res.json(bookings);
};

module.exports = { bookEvent, getMyBookings };
