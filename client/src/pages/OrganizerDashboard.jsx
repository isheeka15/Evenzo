import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaUsers, FaRupeeSign, FaUserCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { eventService } from '../services/eventService';
import { formatDateIST } from '../utils/indianTime';
import Loader from '../components/Loader';

const OrganizerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    upcomingEvents: 0,
    totalRevenue: 0,
    activeUsers: 0,
    recentBookings: [],
    bookingTrend: [],
    revenueTrend: [],
    revenueGrowth: 0,
    bookingsGrowth: 0,
    eventPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const overviewRes = await api.get('/dashboard/overview');
      setStats(overviewRes.data || {});
    } catch (fetchError) {
      console.error('Error fetching organizer dashboard:', fetchError);
      setError('Unable to load dashboard analytics. Please try again later.');
      toast.error('Unable to load your dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      if (user.role !== 'organizer') {
        navigate('/user-dashboard');
        return;
      }
      fetchData();
    }
  }, [user, authLoading, navigate, fetchData]);

  useEffect(() => {
    if (!authLoading && user && user.role === 'organizer') {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [authLoading, user, fetchData]);

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      setDeleteConfirm(null);
      toast.success('Event deleted successfully!');
      const overviewRes = await api.get('/dashboard/overview');
      setStats(overviewRes.data || {});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event.');
    }
  };

  const totalRevenue = stats.totalRevenue || 0;
  const hasBookingTrend = Array.isArray(stats.bookingTrend) && stats.bookingTrend.length > 0;
  const hasRevenueTrend = Array.isArray(stats.revenueTrend) && stats.revenueTrend.length > 0;
  const maxBookings = hasBookingTrend ? Math.max(...stats.bookingTrend.map((item) => item.count, 1)) : 1;
  const maxRevenue = hasRevenueTrend ? Math.max(...stats.revenueTrend.map((item) => item.revenue, 1)) : 1;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 animate-pulse">
            <div className="h-10 w-2/5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-40 rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="h-96 rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" />
              <div className="h-96 rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" />
            </div>
            <div className="grid gap-6 xl:grid-cols-[0.9fr_0.9fr]">
              <div className="h-96 rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" />
              <div className="h-96 rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organizer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your premium event portfolio, booking analytics, and revenue insights.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchData}
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refresh analytics
            </button>
            <Link
              to="/create-event"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
            >
              <FaPlus className="mr-2" /> Create Event
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                <FaCalendarAlt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Total Events</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalEvents}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Live event count from MongoDB.</p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                <FaUsers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalBookings}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bookings recorded from real users.</p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-200 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                <FaUserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Active Users</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.activeUsers}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Unique attendees engaging with your events.</p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-200 text-amber-700 dark:bg-yellow-900/20 dark:text-amber-300">
                <FaRupeeSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue tallied directly from MongoDB.</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr] mb-6">
          <section className="rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bookings trend</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily bookings over the last week.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">Live refresh</span>
            </div>
            <div className="grid grid-cols-7 gap-3 items-end h-48">
              {hasBookingTrend ? (
                stats.bookingTrend.map((point) => {
                  const height = Math.max((point.count / maxBookings) * 100, 12);
                  return (
                    <div key={point.iso} className="flex flex-col items-center gap-2">
                      <div className="w-full rounded-3xl bg-gradient-to-t from-indigo-600 to-sky-400" style={{ height: `${height}%` }} />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{point.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-7 h-full rounded-3xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue trend</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenue generated across the last seven days.</p>
              </div>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">Real data</span>
            </div>
            <div className="relative h-56">
              {hasRevenueTrend ? (
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <path
                    d={stats.revenueTrend
                      .map((point, index) => {
                        const x = (index / Math.max(stats.revenueTrend.length - 1, 1)) * 100;
                        const y = 100 - ((point.revenue || 0) / maxRevenue) * 100;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="2"
                  />
                  <path
                    d={`${stats.revenueTrend
                      .map((point, index) => {
                        const x = (index / Math.max(stats.revenueTrend.length - 1, 1)) * 100;
                        const y = 100 - ((point.revenue || 0) / maxRevenue) * 100;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')} L 100 100 L 0 100 Z`}
                    fill="rgba(124, 58, 237, 0.16)"
                  />
                </svg>
              ) : (
                <div className="h-full w-full rounded-3xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_0.9fr] mb-6">
          <section className="rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance insights</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Top events by attendance and revenue.</p>
              </div>
            </div>
            <div className="space-y-4">
              {stats.eventPerformance?.length ? (
                stats.eventPerformance.map((event) => (
                  <div key={event.id} className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.booked}/{event.capacity} seats booked</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">₹{event.revenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-sky-500" style={{ width: `${event.utilization}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Capacity utilization {event.utilization}%</div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No event performance details are available yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent bookings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest reservations from your events.</p>
            </div>
            <div className="space-y-4">
              {stats.recentBookings?.length ? (
                stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="rounded-3xl bg-slate-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{booking.eventTitle}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{booking.userName} · {booking.paymentMethod}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">₹{booking.amountPaid.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{booking.quantity} ticket(s)</span>
                      <span>{formatDateIST(booking.bookedAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No recent bookings yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-slate-50 dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-700">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Upcoming events</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.upcomingEvents}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-700">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Revenue growth</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.revenueGrowth}%</p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-700">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Booking momentum</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.bookingsGrowth}%</p>
            </div>
          </div>
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm delete</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Deleting this event will remove it from your listings and cancel any pending registrations.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(deleteConfirm)}
                  className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
