import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDateIST } from '../utils/indianTime';
import Loader from '../components/Loader';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
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
      fetchRegistrations();
    }
  }, [user, authLoading]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/register/my-registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load your registrations.');
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

  const upcomingCount = registrations.filter(r => r.event && new Date(r.event.eventDate) > new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your event registrations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                <FaTicketAlt className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{registrations.length}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Registrations</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {registrations.length - upcomingCount}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Past Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Registered Events</h2>
            <Link
              to="/events"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
            >
              <FaSearch />
              Browse Events
            </Link>
          </div>

          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map((reg) => {
                if (!reg.event) return null;
                const ev = reg.event;
                const isUpcoming = new Date(ev.eventDate) > new Date();
                const bannerSrc = ev.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';

                return (
                  <div key={reg._id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative h-32">
                      <img src={bannerSrc} alt={ev.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isUpcoming ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {ev.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <FaCalendarAlt className="mr-2 text-purple-500" />
                        {formatDateIST(ev.eventDate)} {ev.startTime ? `at ${ev.startTime}` : ''}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <FaMapMarkerAlt className="mr-2 text-purple-500" />
                        {ev.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${ev.price === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                          {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                        </span>
                        <Link
                          to={`/event/${ev._id}`}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaTicketAlt className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No registrations yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't registered for any events. Start exploring!
              </p>
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
