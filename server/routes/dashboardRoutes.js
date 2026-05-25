const express = require('express');
const { getDashboardOverview } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/overview', protect, allowRoles('organizer'), getDashboardOverview);

module.exports = router;
