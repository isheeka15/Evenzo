import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaShare, FaTicketAlt, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';
import { formatDateIST } from '../utils/indianTime';
import { formatPrice } from '../utils/appConfig';
import { getDynamicEventImage } from '../utils/eventImages';
import Loader from '../components/Loader';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvent(id);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found.');
    } finally {
      setLoading(false);
    }
  };

  const openBooking = () => {
    if (!user) {
      toast.info('Please login to book tickets.');
      navigate('/login');
      return;
    }
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    if (!event) return;
    setBookingLoading(true);
    try {
      const response = await bookingService.bookEvent(event._id || event.id, bookingData);
      setBookingConfirmation(response.booking);
      setBookingMessage(response.message);
      setBookingModalOpen(false);
      toast.success('Booking confirmed! Check My Tickets in your dashboard.');
      fetchEvent();
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    if (!event) return;
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-slate-950 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors duration-200">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const bannerSrc = event.image || event.bannerUrl || getDynamicEventImage(event);
  const displayDate = event.eventDate ? formatDateIST(event.eventDate) : event.date;
  const displayTime = event.startTime || event.time;
  const displayOrganizer = event.organizerName || event.organizer;
  const displayAttendees = event.attendees ?? 0;
  const displayCapacity = event.capacity || event.maxAttendees || 200;
  const isFull = displayAttendees >= displayCapacity;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <BookingModal
        event={event}
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
        loading={bookingLoading}
        message={bookingMessage}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/events" className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200 transition-colors duration-200 font-medium">
            <FaArrowLeft className="mr-2" />
            Back to Events
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl mb-8">
          <img
            src={bannerSrc}
            alt={event.title}
            className="w-full h-80 sm:h-[36rem] object-cover"
            onError={(e) => { e.target.src = getDynamicEventImage(event); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20">
                {event.category}
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
                {event.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl leading-8">
                {event.description}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-sm sm:text-base text-white backdrop-blur-xl">
                  <FaTicketAlt className="text-purple-300" />
                  {event.price === 0 ? 'Free Registration' : `${formatPrice(event.price)} per ticket`}
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-sm sm:text-base text-white backdrop-blur-xl">
                  <FaUsers className="text-purple-300" />
                  {displayAttendees}/{displayCapacity} attendees
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="absolute top-5 right-5 rounded-full bg-white/90 p-3 text-slate-950 hover:bg-white transition shadow-lg"
            aria-label="Share event"
          >
            <FaShare />
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <div className="glassmorphism rounded-[2rem] border border-white/20 p-8 shadow-2xl">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Date & Time</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{displayDate}</p>
                  {displayTime && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{displayTime}</p>}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Venue</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{event.location}</p>
                  {event.city && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{event.city}</p>}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Organizer</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{displayOrganizer}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Tickets</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{event.price === 0 ? 'Free' : `${formatPrice(event.price)}`}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{displayCapacity - displayAttendees} seats left</p>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-[2rem] border border-white/20 p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white mb-4">Event Highlights</h2>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <p>{event.details || 'Enjoy a premium event experience with a curated lineup, modern venue, and seamless ticketing.'}</p>
                <p>Access your booking anytime from the My Tickets section in your dashboard.</p>
                <p>This event is optimized for mobile viewers, group bookings, and fast checkout.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="glassmorphism rounded-[2rem] border border-white/20 p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white mb-4">Book Tickets</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Secure your seat with a modern checkout UI and instant booking confirmation.</p>
              <button
                onClick={openBooking}
                disabled={isFull}
                className="w-full rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white font-semibold shadow-xl shadow-purple-500/20 transition hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
              >
                {isFull ? 'Sold Out' : event.price === 0 ? 'Register Free' : 'Buy Ticket'}
              </button>
              <div className="mt-6 rounded-3xl bg-slate-50 dark:bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 mb-3">Need help?</p>
                <p className="text-slate-700 dark:text-slate-300">Reach out to support if you need assistance with your booking or payment.</p>
              </div>
            </div>

            {bookingConfirmation && (
              <div className="glassmorphism rounded-[2rem] border border-white/20 p-6 shadow-2xl bg-white/80 dark:bg-slate-900/80">
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-3">Booking Confirmed</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Ticket ID: <span className="font-semibold text-slate-900 dark:text-white">{bookingConfirmation.ticketId}</span></p>
                <p className="text-slate-600 dark:text-slate-300 mb-2">Quantity: {bookingConfirmation.quantity}</p>
                <p className="text-slate-600 dark:text-slate-300">Payment: {bookingConfirmation.paymentStatus === 'free' ? 'Free' : bookingConfirmation.paymentMethod}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
