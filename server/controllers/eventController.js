const path = require('path');
const Event = require('../models/Event');
const { getDefaultImageByCategory } = require('../utils/imageDefaults');

const getEvents = async (req, res) => {
  const { search, category, city, date, free, mine } = req.query;
  const filter = { published: true };

  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') },
    ];
  }

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (city && city !== 'All') {
    filter.city = city;
  }

  if (free === 'true') {
    filter.price = 0;
  }

  if (date) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.eventDate = { $gte: selectedDate, $lt: nextDay };
  }

  if (mine === 'true') {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required for organizer event management.' });
    }
    filter.organizerId = req.user._id;
    delete filter.published;
  }

  const events = await Event.find(filter).sort({ eventDate: 1, createdAt: -1 });
  res.json(events);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || (!event.published && String(event.organizerId) !== String(req.user?._id))) {
    return res.status(404).json({ message: 'Event not found.' });
  }
  res.json(event);
};

const createEvent = async (req, res) => {
  const {
    title,
    description,
    category,
    city,
    location,
    eventDate,
    startTime,
    price,
    capacity,
    tags,
    published,
    imageUrl,
  } = req.body;

  let parsedTags = [];
  if (tags) {
    try {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch {
      parsedTags = tags.split(',').map((tag) => tag.trim());
    }
  }

  const imageSource = req.file
    ? `/uploads/${req.file.filename}`
    : imageUrl || getDefaultImageByCategory(category, title);

  const event = await Event.create({
    title,
    description,
    category,
    city,
    location,
    eventDate,
    startTime,
    price: Number(price) || 0,
    capacity: Number(capacity) || 200,
    tags: parsedTags,
    image: imageSource,
    bannerUrl: imageSource,
    organizerName: req.user.name,
    organizerId: req.user._id,
    published: published !== 'false',
  });

  res.status(201).json(event);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }
  if (String(event.organizerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden: cannot edit this event.' });
  }

  const updatedFields = {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : event.price,
    capacity: req.body.capacity ? Number(req.body.capacity) : event.capacity,
    tags: req.body.tags ? req.body.tags.split(',').map((tag) => tag.trim()) : event.tags,
    published: req.body.published !== undefined ? req.body.published !== 'false' : event.published,
  };

  if (req.file) {
    const uploadedImage = `/uploads/${req.file.filename}`;
    updatedFields.image = uploadedImage;
    updatedFields.bannerUrl = uploadedImage;
  } else if (req.body.imageUrl) {
    updatedFields.image = req.body.imageUrl;
    updatedFields.bannerUrl = req.body.imageUrl;
  } else if (!event.image) {
    const newCategory = req.body.category || event.category;
    updatedFields.image = getDefaultImageByCategory(newCategory, req.body.title || event.title);
    updatedFields.bannerUrl = updatedFields.image;
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
  });

  res.json(updatedEvent);
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }
  if (String(event.organizerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden: cannot delete this event.' });
  }
  await event.deleteOne();
  res.json({ message: 'Event removed successfully.' });
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
