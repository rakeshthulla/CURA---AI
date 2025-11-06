// Simple API configuration file. Change API_BASE_URL to switch backend endpoint.
// For development, point to your Node backend so it can save conversations to MongoDB.
// You can override with REACT_APP_API_URL in production or env.
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API_BASE_URL;
