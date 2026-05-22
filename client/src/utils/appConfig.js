// Production-ready Evenzo configuration utility

// Indian Standard Time (IST) - Asia/Kolkata
export const TIMEZONE = 'Asia/Kolkata';

// Currency configuration - Indian Rupees (INR)
export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';

// Format price with INR
export const formatPrice = (price) => {
  if (price === 0) return 'Free';
  return `${CURRENCY}${price.toLocaleString('en-IN')}`;
};

// Format date in IST
export const formatEventDate = (date) => {
  if (!date) return '';
  const eventDate = new Date(date);
  return eventDate.toLocaleDateString('en-IN', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time
export const formatEventTime = (time) => {
  if (!time) return '';
  return time; // Time is stored as HH:MM format
};

// Format date and time together
export const formatEventDateTime = (date, time) => {
  const formattedDate = formatEventDate(date);
  return `${formattedDate} at ${time}`;
};

// Get current time in IST
export const getIST = () => {
  return new Date().toLocaleString('en-IN', { timeZone: TIMEZONE });
};

// City list - Major Indian cities
export const MAJOR_CITIES = [
  'All',
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Indore',
  'Chandigarh',
  'Lucknow',
  'Gurgaon',
  'Noida'
];

// Event categories
export const EVENT_CATEGORIES = [
  'Technology',
  'Music',
  'Business',
  'Festival',
  'Sports',
  'Arts',
  'Education',
  'Health',
  'Food',
  'Other'
];

// Validation helpers
export const validateEventForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = 'Event title is required';
  }
  if (!formData.description?.trim()) {
    errors.description = 'Event description is required';
  }
  if (!formData.category) {
    errors.category = 'Category is required';
  }
  if (!formData.city) {
    errors.city = 'City is required';
  }
  if (!formData.location?.trim()) {
    errors.location = 'Venue location is required';
  }
  if (!formData.eventDate) {
    errors.eventDate = 'Event date is required';
  }
  if (!formData.startTime) {
    errors.startTime = 'Start time is required';
  }
  if (formData.price === '' || formData.price === null) {
    errors.price = 'Price is required';
  }
  if (!formData.capacity || formData.capacity < 1) {
    errors.capacity = 'Capacity must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};