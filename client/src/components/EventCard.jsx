import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTag } from 'react-icons/fa';
import { formatDateIST } from '../utils/indianTime';

const EventCard = ({ event }) => {
  // Support both API fields (_id, bannerUrl, eventDate, startTime) and dummy data fields (id, image, date, time)
  const eventId = event._id || event.id;
  const bannerSrc = event.bannerUrl || event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';
  const displayDate = event.eventDate ? formatDateIST(event.eventDate) : event.date;
  const displayTime = event.startTime || event.time;
  const displayAttendees = event.attendees ?? 0;
  const displayCapacity = event.capacity || event.maxAttendees || 200;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
      <div className="relative">
        <img
          src={bannerSrc}
          alt={event.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            event.price === 0 ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'
          }`}>
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaCalendarAlt className="mr-2 text-purple-500 flex-shrink-0" />
            <span>{displayDate} {displayTime ? `at ${displayTime}` : ''}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaMapMarkerAlt className="mr-2 text-purple-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaUsers className="mr-2 text-purple-500 flex-shrink-0" />
            <span>{displayAttendees}/{displayCapacity} attendees</span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/event/${eventId}`}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center block text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
