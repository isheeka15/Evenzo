import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { formatDateIST } from '../utils/indianTime';
import Loader from '../components/Loader';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      if (user.role === 'organizer') {
        navigate('/organizer-dashboard');
        return;
      }
      fetchBookings();
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load your tickets.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  const upcomingCount = bookings.filter((booking) => booking.event && new Date(booking.event.eventDate) > new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your booked events and ticket details are stored securely in your account.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                <FaTicketAlt className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tickets</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                <FaCalendarAlt className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingCount}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Upcoming Events</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                <FaMapMarkerAlt className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length - upcomingCount}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Past Events</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Bookings</h2>
            <Link
              to="/events"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
            >
              <FaSearch />
              Browse Events
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => {
                const event = booking.event;
                if (!event) return null;
                const upcoming = new Date(event.eventDate) > new Date();
                const imageUrl = event.image || event.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';

                return (
                  <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="relative h-44">
                      <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent" />
                      <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${upcoming ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'}`}>
                        {upcoming ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{event.description}</p>
                      <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Ticket ID</span>
                          <span className="text-purple-600 dark:text-purple-300">{booking.ticketId}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Quantity</span>
                          <span>{booking.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Amount</span>
                          <span>₹{booking.amountPaid}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Payment</span>
                          <span className="capitalize">{booking.paymentStatus}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Event Date</span>
                          <span>{formatDateIST(event.eventDate)}</span>
                        </div>
                      </div>
                      <Link
                        to={`/event/${event._id}`}
                        className="inline-flex items-center justify-center w-full rounded-3xl bg-purple-600 text-white py-3 text-sm font-semibold hover:bg-purple-700 transition"
                      >
                        View Event Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <FaTicketAlt className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No booked tickets yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Find your next live experience and secure tickets instantly.</p>
              <Link
                to="/events"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
