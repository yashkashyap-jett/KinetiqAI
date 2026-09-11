const dayjs = require('dayjs') || null;

/**
 * Get start of today in UTC
 */
function getToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Get date N days ago
 */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get current day of the week (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek() {
  return new Date().getDay();
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Calculate percentage, clamped 0-100
 */
function percentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

module.exports = {
  getToday,
  daysAgo,
  getDayOfWeek,
  formatDate,
  percentage,
  clamp,
};
