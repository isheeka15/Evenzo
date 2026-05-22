import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import OrganizerDashboard from '../pages/OrganizerDashboard';
import UserDashboard from '../pages/UserDashboard';
import CreateEvent from '../pages/CreateEvent';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;