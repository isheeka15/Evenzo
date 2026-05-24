import React, { useMemo, useState } from 'react';
import { FaCcVisa, FaCreditCard, FaMoneyBillWave, FaRupeeSign, FaTimes, FaUniversity } from 'react-icons/fa';
import { formatPrice } from '../utils/appConfig';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: <FaMoneyBillWave /> },
  { id: 'credit_card', label: 'Credit Card', icon: <FaCreditCard /> },
  { id: 'debit_card', label: 'Debit Card', icon: <FaCcVisa /> },
  { id: 'net_banking', label: 'Net Banking', icon: <FaUniversity /> },
];

const BookingModal = ({ event, open, onClose, onConfirm, loading, message }) => {
  const [paymentMethod, setPaymentMethod] = useState(event.price === 0 ? 'free' : 'upi');
  const [quantity, setQuantity] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    bank: '',
  });

  const availableSeats = Math.max((event.capacity || event.maxAttendees || 1) - (event.attendees || 0), 1);
  const maxQuantity = Math.min(availableSeats, 6);

  const totalAmount = useMemo(() => {
    return (event.price || 0) * quantity;
  }, [event.price, quantity]);

  const handleInput = (key, value) => {
    setPaymentDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const bookingData = {
      paymentMethod: event.price === 0 ? 'free' : paymentMethod,
      quantity,
      amountPaid: totalAmount,
      paymentDetails: event.price === 0 ? null : paymentDetails,
    };
    onConfirm(bookingData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white dark:bg-slate-950 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Secure Booking</p>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{event.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Ticket amount</p>
              <p className="text-3xl font-bold text-slate-950 dark:text-white mt-3">{formatPrice(event.price)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Seats available: {availableSeats}</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-5 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] opacity-80">Total</p>
              <p className="text-4xl font-bold mt-3">{formatPrice(totalAmount)}</p>
              <p className="text-sm opacity-90 mt-2">{quantity} ticket{quantity > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-3"
              >
                {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((qty) => (
                  <option key={qty} value={qty}>{qty}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment method</label>
              {event.price === 0 ? (
                <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-4 py-4 text-slate-900 dark:text-slate-100">
                  Register Free
                </div>
              ) : (
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 cursor-pointer hover:border-purple-500 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-purple-600"
                      />
                      <span className="text-xl text-purple-600">{method.icon}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{method.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {event.price > 0 && (
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-5">
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-4">Payment details</h3>
              {paymentMethod === 'upi' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    value={paymentDetails.upiId}
                    onChange={(e) => handleInput('upiId', e.target.value)}
                    placeholder="UPI ID"
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100"
                  />
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 text-slate-500 dark:text-slate-400">
                    Pay using your UPI app after confirmation.
                  </div>
                </div>
              )}
              {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                <div className="grid gap-4">
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handleInput('cardNumber', e.target.value)}
                    placeholder="Card number"
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      value={paymentDetails.expiry}
                      onChange={(e) => handleInput('expiry', e.target.value)}
                      placeholder="MM/YY"
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      value={paymentDetails.cvv}
                      onChange={(e) => handleInput('cvv', e.target.value)}
                      placeholder="CVV"
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === 'net_banking' && (
                <input
                  type="text"
                  value={paymentDetails.bank}
                  onChange={(e) => handleInput('bank', e.target.value)}
                  placeholder="Bank name"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100"
                />
              )}
            </div>
          )}

          {message && (
            <div className="rounded-3xl bg-green-50 dark:bg-green-900/20 p-4 text-green-800 dark:text-green-200">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white font-semibold shadow-xl shadow-purple-500/20 transition hover:from-purple-700 hover:to-blue-700 disabled:opacity-60"
            >
              {loading ? 'Processing...' : event.price === 0 ? 'Confirm Free Registration' : 'Confirm Payment'}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 text-slate-700 dark:text-slate-200 font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
