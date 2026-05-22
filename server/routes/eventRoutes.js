const express = require('express');
const path = require('path');
const multer = require('multer');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', optionalProtect, getEvents);
router.get('/:id', optionalProtect, getEventById);
router.post('/', protect, allowRoles('organizer'), upload.single('banner'), createEvent);
router.put('/:id', protect, allowRoles('organizer'), upload.single('banner'), updateEvent);
router.delete('/:id', protect, allowRoles('organizer'), deleteEvent);

module.exports = router;
