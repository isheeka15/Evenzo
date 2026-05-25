import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import FilterSection from '../components/FilterSection';
import Loader from '../components/Loader';

import { events as fallbackEvents } from '../data/events';

const Events = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      const eventsArray = Array.isArray(data) ? data : fallbackEvents;
      setEvents(eventsArray);
      const uniqueCategories = ['All', ...new Set(eventsArray.map((event) => event.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(fallbackEvents);
      const uniqueCategories = ['All', ...new Set(fallbackEvents.map((event) => event.category))];
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.city && event.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesFree = !showFreeOnly || event.price === 0;
      return matchesSearch && matchesCategory && matchesFree;
    });
  }, [events, searchTerm, selectedCategory, showFreeOnly]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Discover Events</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find and attend amazing events across India. Search by category, city, or keyword.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search events, categories, cities..."
              />
            </div>
            <div className="lg:w-80">
              <FilterSection
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                showFreeOnly={showFreeOnly}
                setShowFreeOnly={setShowFreeOnly}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredEvents.length}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span> events
            </p>
            {(searchTerm || selectedCategory !== 'All' || showFreeOnly) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setShowFreeOnly(false); }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setShowFreeOnly(false); }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
