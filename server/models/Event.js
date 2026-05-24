const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    organizerName: { type: String, required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    capacity: { type: Number, default: 200 },
    attendees: { type: Number, default: 0 },
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
