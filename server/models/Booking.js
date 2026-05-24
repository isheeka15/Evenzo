const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketId: { type: String, required: true, unique: true },
    quantity: { type: Number, default: 1 },
    paymentMethod: { type: String, enum: ['free', 'upi', 'credit_card', 'debit_card', 'net_banking'], default: 'free' },
    paymentStatus: { type: String, enum: ['free', 'pending', 'paid'], default: 'paid' },
    amountPaid: { type: Number, default: 0 },
    paymentDetails: { type: Object, default: {} },
    transactionId: { type: String },
    bookedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
