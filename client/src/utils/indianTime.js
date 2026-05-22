// Utility functions for Indian Standard Time (IST) formatting

export const formatDateIST = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTimeIST = (timeString) => {
  // Assuming timeString is in HH:MM format
  return timeString;
};

export const formatDateTimeIST = (dateString, timeString) => {
  const date = new Date(dateString + 'T' + timeString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getCurrentIST = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata'
  });
};