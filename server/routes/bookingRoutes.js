const express = require('express');
const { bookEvent, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyBookings);
router.post('/:eventId', protect, bookEvent);

module.exports = router;
