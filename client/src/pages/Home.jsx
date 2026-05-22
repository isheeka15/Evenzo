import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaUsers, FaStar, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  { name: 'Technology', emoji: '💻', color: 'from-blue-500 to-cyan-500' },
  { name: 'Music', emoji: '🎵', color: 'from-pink-500 to-rose-500' },
  { name: 'Business', emoji: '💼', color: 'from-green-500 to-emerald-500' },
  { name: 'Festival', emoji: '🎉', color: 'from-yellow-500 to-orange-500' },
  { name: 'Arts', emoji: '🎨', color: 'from-purple-500 to-violet-500' },
  { name: 'Education', emoji: '📚', color: 'from-indigo-500 to-blue-500' },
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
      const data = await eventService.getEvents();
      setFeaturedEvents(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
      setFeaturedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-24 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaTicketAlt />
              <span>India's Premier Event Discovery Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in leading-tight">
              Discover <span className="text-yellow-300">Amazing</span><br />Events Near You
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto leading-relaxed">
              From tech conferences to music festivals — find, register, and experience the best events across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg text-lg"
              >
                <span>Browse Events</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/signup"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-700 transition-all duration-200 text-lg"
              >
                Become an Organizer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <FaCalendarAlt className="text-4xl text-purple-600 mx-auto mb-3" />, value: '500+', label: 'Events This Month' },
              { icon: <FaUsers className="text-4xl text-purple-600 mx-auto mb-3" />, value: '10K+', label: 'Happy Attendees' },
              { icon: <FaStar className="text-4xl text-purple-600 mx-auto mb-3" />, value: '4.8★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in p-6">
                {stat.icon}
                <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-400">Find events that match your interests</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className={`bg-gradient-to-br ${cat.color} p-5 rounded-xl text-white text-center hover:scale-105 transition-transform duration-200 shadow-md`}
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="font-semibold text-sm">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Don't miss out on these amazing upcoming events. Book your spot now!
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="text-5xl mx-auto mb-4 opacity-30" />
              <p>No events available right now. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg"
            >
              <span>View All Events</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Own Event?</h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of organizers who trust Evenzo to manage their events across India.
          </p>
          <Link
            to="/signup"
            className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-200 inline-block shadow-lg text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
