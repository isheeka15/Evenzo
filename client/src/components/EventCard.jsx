import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { formatDateIST } from '../utils/indianTime';
import { getDynamicEventImage } from '../utils/eventImages';

const EventCard = ({ event }) => {
  const eventId = event._id || event.id;
  const imageUrl = event.image || event.bannerUrl || getDynamicEventImage(event);
  const displayDate = event.eventDate ? formatDateIST(event.eventDate) : event.date;
  const displayTime = event.startTime || event.time;
  const displayAttendees = event.attendees ?? 0;
  const displayCapacity = event.capacity || event.maxAttendees || 200;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[1.75rem] shadow-2xl overflow-hidden transform transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden h-64">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = getDynamicEventImage(event);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span className="inline-flex items-center rounded-full bg-white/85 text-sm font-semibold text-slate-900 px-3 py-1 backdrop-blur-sm">
            {event.category}
          </span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${event.price === 0 ? 'bg-emerald-600 text-white' : 'bg-violet-600 text-white'}`}>
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <FaCalendarAlt className="text-purple-600" />
            <span>{displayDate}{displayTime ? ` • ${displayTime}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <FaMapMarkerAlt className="text-purple-600" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <FaUsers className="text-purple-600" />
            <span>{displayAttendees}/{displayCapacity} going</span>
          </div>
          <Link
            to={`/event/${eventId}`}
            className="text-purple-600 dark:text-purple-300 font-semibold hover:text-purple-700 dark:hover:text-purple-200 transition"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
