import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Feedback API calls
export const feedbackAPI = {
  // Get all feedbacks
  getAll: () => api.get('/feedbacks'),
  
  // Get single feedback by ID
  getById: (id) => api.get(`/feedbacks/${id}`),
  
  // Create new feedback
  create: (feedbackData) => api.post('/feedbacks', feedbackData),
  
  // Update feedback
  update: (id, feedbackData) => api.put(`/feedbacks/${id}`, feedbackData),
  
  // Delete feedback
  delete: (id) => api.delete(`/feedbacks/${id}`),
  
  // Upvote feedback
  upvote: (id) => api.post(`/feedbacks/${id}/upvote`),
  
  // Downvote feedback
  downvote: (id) => api.post(`/feedbacks/${id}/downvote`),
};

// Logs API calls
export const logsAPI = {
  getLogs: () => api.get('/logs'),
  getAPITracking: () => api.get('/api-tracking'),
};

export default api;
