import React, { useState } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration
    toast.success(`Successfully registered for ${event.title}!`);
    onClose();
    setFormData({ name: '', email: '', phone: '', tickets: 1 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Register for Event</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.date} at {event.time}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
            <p className="text-lg font-bold text-purple-600 mt-2">
              {event.price === 0 ? 'Free' : `$${event.price} per ticket`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Tickets
              </label>
              <input
                type="number"
                id="tickets"
                name="tickets"
                value={formData.tickets}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Total: <span className="font-bold text-purple-600">${event.price * formData.tickets}</span>
              </p>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FaCheck />
                <span>Complete Registration</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;