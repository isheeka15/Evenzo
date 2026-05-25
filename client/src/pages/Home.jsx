import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  { name: 'Festival', emoji: '🎉', color: 'from-yellow-500 to-orange-500' },
  { name: 'Music', emoji: '🎧', color: 'from-pink-500 to-rose-500' },
  { name: 'Business', emoji: '💼', color: 'from-green-500 to-emerald-500' },
  { name: 'Arts', emoji: '🎨', color: 'from-purple-500 to-violet-500' },
  { name: 'Health & Wellness', emoji: '🧘', color: 'from-cyan-500 to-blue-500' },
  { name: 'Food & Drink', emoji: '🍷', color: 'from-red-500 to-pink-500' },
];

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents();
      const eventsArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.events)
        ? response.events
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setFeaturedEvents(eventsArray.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
      setFeaturedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-slate-950/0 via-slate-950/10 to-slate-950/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 border border-white/20 dark:border-white/10 backdrop-blur-xl text-sm font-semibold uppercase tracking-[0.24em] text-white px-4 py-2 rounded-full shadow-lg">
                <FaStar className="text-yellow-300" />
                Curated event experiences for every occasion
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-950 dark:text-white">
                  Premium event discovery with stunning visuals, effortless bookings, and world-class experiences.
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-8">
                  Discover live performances, festival celebrations, business summits and wellness escapes with one beautifully designed platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-purple-500/30"
                >
                  Explore Events
                  <FaArrowRight />
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-3xl border border-white/20 bg-white/90 px-8 py-4 text-base font-semibold text-slate-950 transition-all duration-300 hover:bg-white"
                >
                  Start Organizing
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
                {[
                  { label: '24/7 Support', value: 'Always online' },
                  { label: 'Secured Checkout', value: 'Encrypted bookings' },
                  { label: 'Verified Events', value: 'Handpicked quality' },
                ].map((item) => (
                  <div key={item.label} className="glassmorphism p-4 rounded-3xl border border-white/20 shadow-xl shadow-slate-950/5">
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300 mb-2">{item.label}</p>
                    <p className="text-lg font-semibold text-slate-950 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(59,130,246,0.8)]">
                  <img
                    src="https://images.unsplash.com/photo-1519305878406-6c9d8f97bb7a?auto=format&fit=crop&w=900&q=80"
                    alt="Colorful Holi festival"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent p-6 flex items-end">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-purple-200">Festival Highlight</p>
                      <h3 className="text-lg font-semibold text-white">Holi Bash Experience</h3>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(124,58,237,0.6)]">
                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80"
                    alt="Neon DJ night"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent p-6 flex items-end">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-pink-200">Nightlife</p>
                      <h3 className="text-lg font-semibold text-white">Neon DJ Night</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-4 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 p-6 backdrop-blur-xl border border-white/40 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.22em] font-semibold text-slate-500 dark:text-slate-300">Featured</span>
                    <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">Premium</span>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">Design your next unforgettable event in minutes.</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">From luxury gala dinners to immersive startup experiences, showcase events that stand out.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="glassmorphism p-8 rounded-[2rem] border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white mb-4">Curated categories for every mood</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-7">Search through handpicked categories and find events instantly with beautiful visuals and intelligent filters.</p>
            </div>
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/events?category=${cat.name}`}
                  className={`rounded-[1.75rem] p-6 transition-transform duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${cat.color} text-white shadow-lg shadow-slate-900/10`}
                >
                  <p className="text-3xl mb-3">{cat.emoji}</p>
                  <h3 className="text-xl font-semibold">{cat.name}</h3>
                  <p className="text-sm mt-2 opacity-90">Explore top events in this category.</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-950 dark:text-white mb-4">Featured Events</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-8">
              Browse premium listings with stunning imagery, fast search and event discovery built for modern audiences.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : Array.isArray(featuredEvents) && featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event._id || event.id}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <FaCalendarAlt className="text-5xl mx-auto mb-4 opacity-40" />
              <p>No events are available right now, but new experiences are coming soon.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 text-white px-10 py-4 text-base font-semibold hover:bg-slate-800 transition-colors duration-200 shadow-xl shadow-slate-950/20"
            >
              See All Events
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-[0.3em] text-purple-300">Why Evenzo</span>
              <h2 className="text-4xl font-bold">Built to scale with beautiful branding and seamless event discovery.</h2>
            </div>
            <div className="space-y-6">
              <div className="glassmorphism p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Vibrant visual storytelling</h3>
                <p className="text-slate-200">Every event page features premium imagery and polished layout so audiences feel excited from the first glance.</p>
              </div>
              <div className="glassmorphism p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Responsive on every screen</h3>
                <p className="text-slate-200">From mobile to desktop, the interface adapts with fluid spacing, readable typography, and fast interactions.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="glassmorphism p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Light and dark modes</h3>
                <p className="text-slate-200">Let users switch themes instantly with a polished theme toggle for modern brand experiences.</p>
              </div>
              <div className="glassmorphism p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Deploy-ready data fallback</h3>
                <p className="text-slate-200">Static event data is built into the app so it remains functional even if the backend is unavailable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
