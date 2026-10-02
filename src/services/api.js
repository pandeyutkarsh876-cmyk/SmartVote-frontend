import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create a centralized Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific HTTP errors globally if needed
      if (status === 401) {
        // Unauthorized, maybe clear token or redirect to login
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Optional: Redirect if unauthorized
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (data && data.message) {
        // toast.error(data.message); // Will let individual components handle 400s or specific messages if needed to avoid double toasts
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default API;
