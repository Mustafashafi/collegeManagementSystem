import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Admin API
export const adminApi = {
  getStats: () => api.get('/api/admin/stats'),
  getStudents: (params) => api.get('/api/admin/students', { params }),
  getTeachers: (params) => api.get('/api/admin/teachers', { params }),
  addStudent: (data) => api.post('/api/admin/students', data),
  updateStudent: (id, data) => api.put(`/api/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/api/admin/students/${id}`),
  getFees: () => api.get('/api/admin/fees'),
  recordPayment: (id, data) => api.put(`/api/admin/fees/${id}/record`, data),
  getTeacherAttendance: (date) => api.get('/api/admin/teacher-attendance', { params: { date } }),
  getTeacherAttendanceReport: (month, year) => api.get('/api/admin/teacher-attendance/report', { params: { month, year } }),
  markTeacherAttendance: (data) => api.post('/api/admin/teacher-attendance', data),
  getClasses: () => api.get('/api/admin/classes'),
  getEvents: () => api.get('/api/events'),
  getEventById: (id) => api.get(`/api/events/${id}`),
  getFilters: () => api.get('/api/admin/filters'),
};

// Auth API
export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
};

// Application API
export const applicationApi = {
  getAll: () => api.get('/api/applications'),
  updateStatus: (id, data) => api.put(`/api/applications/${id}/status`, data),
  enroll: (id) => api.post(`/api/applications/${id}/enroll`),
};

// Leads API
export const leadsApi = {
  getAll: () => api.get('/api/leads'),
};

export default api;
