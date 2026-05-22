const express = require('express');
const { registerForEvent, getMyRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// IMPORTANT: specific routes must come before parameterized routes
router.get('/my-registrations', protect, getMyRegistrations);
router.post('/:eventId', protect, registerForEvent);

module.exports = router;
