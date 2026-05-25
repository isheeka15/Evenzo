const Event = require('../models/Event');
const Booking = require('../models/Booking');

const getDashboardOverview = async (req, res) => {
  const organizerId = req.user._id;
  const events = await Event.find({ organizerId });
  const eventIds = events.map((event) => event._id);

  const bookings = await Booking.find({ event: { $in: eventIds } })
    .populate('event', 'title eventDate startTime price category city location')
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });

  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);
  const uniqueUsers = new Map();
  bookings.forEach((booking) => {
    if (booking.user) {
      uniqueUsers.set(String(booking.user._id), booking.user);
    }
  });

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthRevenue = bookings
    .filter((booking) => booking.createdAt >= currentMonthStart)
    .reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);

  const previousMonthRevenue = bookings
    .filter((booking) => booking.createdAt >= previousMonthStart && booking.createdAt < currentMonthStart)
    .reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);

  const thisMonthBookings = bookings.filter((booking) => booking.createdAt >= currentMonthStart).length;
  const previousMonthBookings = bookings.filter(
    (booking) => booking.createdAt >= previousMonthStart && booking.createdAt < currentMonthStart,
  ).length;

  const revenueGrowth = previousMonthRevenue > 0
    ? ((thisMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : thisMonthRevenue > 0
    ? 100
    : 0;

  const bookingsGrowth = previousMonthBookings > 0
    ? ((thisMonthBookings - previousMonthBookings) / previousMonthBookings) * 100
    : thisMonthBookings > 0
    ? 100
    : 0;

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return {
      label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      iso: date.toISOString().slice(0, 10),
      count: 0,
      revenue: 0,
    };
  });

  const bookingTrendMap = lastSevenDays.reduce((map, point) => {
    map[point.iso] = point;
    return map;
  }, {});

  bookings.forEach((booking) => {
    const bookingDate = booking.createdAt.toISOString().slice(0, 10);
    if (bookingTrendMap[bookingDate]) {
      bookingTrendMap[bookingDate].count += 1;
      bookingTrendMap[bookingDate].revenue += booking.amountPaid || 0;
    }
  });

  const bookingTrend = Object.values(bookingTrendMap);

  const eventPerformance = events
    .map((event) => {
      const eventBookings = bookings.filter((booking) => String(booking.event._id) === String(event._id));
      const eventRevenue = eventBookings.reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);
      const capacityUtilization = event.capacity > 0 ? Math.round((event.attendees / event.capacity) * 100) : 0;
      return {
        id: event._id,
        title: event.title,
        booked: event.attendees,
        capacity: event.capacity,
        utilization: capacityUtilization,
        revenue: eventRevenue,
        date: event.eventDate,
      };
    })
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 3);

  const recentBookings = bookings.slice(0, 8).map((booking) => ({
    id: booking._id,
    ticketId: booking.ticketId,
    quantity: booking.quantity,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    amountPaid: booking.amountPaid,
    bookedAt: booking.createdAt,
    eventTitle: booking.event?.title || 'Untitled event',
    userName: booking.user?.name || 'Guest',
    userEmail: booking.user?.email || '',
  }));

  res.json({
    totalEvents: events.length,
    totalBookings: bookings.length,
    upcomingEvents: events.filter((event) => event.eventDate >= now).length,
    activeUsers: uniqueUsers.size,
    totalRevenue,
    bookingTrend,
    revenueTrend: bookingTrend.map((point) => ({ label: point.label, revenue: point.revenue })),
    revenueGrowth: Math.round(revenueGrowth),
    bookingsGrowth: Math.round(bookingsGrowth),
    eventPerformance,
    recentBookings,
    eventSummary: events.map((event) => ({
      id: event._id,
      title: event.title,
      category: event.category,
      attendees: event.attendees,
      capacity: event.capacity,
      published: event.published,
      eventDate: event.eventDate,
    })),
  });
};

module.exports = { getDashboardOverview };