import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaShare, FaTicketAlt, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { eventService } from '../services/eventService';
import { formatDateIST } from '../utils/indianTime';
import { formatPrice } from '../utils/appConfig';
import Loader from '../components/Loader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

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

  const handleRegister = async () => {
    if (!user) {
      toast.info('Please login to register for this event.');
      navigate('/login');
      return;
    }
    setRegistering(true);
    try {
      await api.post(`/register/${id}`);
      toast.success('Successfully registered! See you at the event 🎉');
      setAlreadyRegistered(true);
      // Refresh event to update attendee count
      fetchEvent();
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      if (msg.includes('already registered')) {
        setAlreadyRegistered(true);
      }
      toast.error(msg);
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link to="/events" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  // Normalize fields — support both API and dummy data shapes
  const bannerSrc = event.bannerUrl || event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';
  const displayDate = event.eventDate ? formatDateIST(event.eventDate) : event.date;
  const displayTime = event.startTime || event.time;
  const displayOrganizer = event.organizerName || event.organizer;
  const displayAttendees = event.attendees ?? 0;
  const displayCapacity = event.capacity || event.maxAttendees || 200;
  const isFull = displayAttendees >= displayCapacity;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/events" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors duration-200 font-medium">
          <FaArrowLeft className="mr-2" />
          Back to Events
        </Link>

        {/* Banner */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-xl">
          <img
            src={bannerSrc}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="inline-block px-3 py-1 bg-purple-600 text-white text-sm rounded-full mb-2">
                {event.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {event.title}
              </h1>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${
              event.price === 0 ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-900'
            }`}>
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow"
            aria-label="Share event"
          >
            <FaShare />
          </button>
        </div>

        {/* Event Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start text-gray-700 dark:text-gray-300">
              <FaCalendarAlt className="text-purple-600 mr-3 text-xl mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Date & Time</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{displayDate}</p>
                {displayTime && <p className="text-sm text-gray-500 dark:text-gray-400">{displayTime}</p>}
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300">
              <FaMapMarkerAlt className="text-purple-600 mr-3 text-xl mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{event.location}</p>
                {event.city && <p className="text-sm text-gray-500 dark:text-gray-400">{event.city}</p>}
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300">
              <FaUsers className="text-purple-600 mr-3 text-xl mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Attendees</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{displayAttendees} / {displayCapacity} registered</p>
                <div className="mt-1 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((displayAttendees / displayCapacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300">
              <FaUserTie className="text-purple-600 mr-3 text-xl mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Organizer</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{displayOrganizer}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isFull ? (
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-4 px-6 rounded-lg font-semibold text-center">
                Event is Full
              </div>
            ) : alreadyRegistered ? (
              <div className="flex-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-4 px-6 rounded-lg font-semibold text-center flex items-center justify-center gap-2">
                <FaTicketAlt />
                You're Registered!
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {registering ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <FaTicketAlt />
                    {user ? 'Register Now' : 'Login to Register'}
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleShare}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
