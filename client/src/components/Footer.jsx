import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📅</span>
              <span className="font-bold text-xl">Evenzo</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover and attend amazing events in your city. From tech conferences to music festivals,
              find your next adventure with Evenzo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="/events" className="text-gray-400 hover:text-white transition-colors duration-200">Events</a></li>
              <li><a href="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Login</a></li>
              <li><a href="/signup" className="text-gray-400 hover:text-white transition-colors duration-200">Signup</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Technology</span></li>
              <li><span className="text-gray-400">Music</span></li>
              <li><span className="text-gray-400">Business</span></li>
              <li><span className="text-gray-400">Arts</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Evenzo. All rights reserved. | Made with ❤️ for event enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;