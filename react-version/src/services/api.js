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
  addTeacher: (data) => api.post('/api/admin/teachers', data),
  deleteTeacher: (id) => api.delete(`/api/admin/teachers/${id}`),
  getFees: (params) => api.get('/api/admin/fees', { params }),
  generateInvoice: (data) => api.post('/api/admin/fees', data),
  recordPayment: (id, data) => api.put(`/api/admin/fees/${id}/record`, data),
  reviewFeeReceipt: (id, data) => api.put(`/api/admin/fees/${id}/review-receipt`, data),
  deleteFee: (id) => api.delete(`/api/admin/fees/${id}`),
  getTeacherAttendance: (date) => api.get('/api/admin/teacher-attendance', { params: { date } }),
  getTeacherAttendanceReport: (month, year, email) => api.get('/api/admin/teacher-attendance/report', { params: { month, year, email } }),
  markTeacherAttendance: (data) => api.post('/api/admin/teacher-attendance', data),
  getClasses: () => api.get('/api/admin/classes'),
  getLibrarians: (params) => api.get('/api/admin/librarians', { params }),
  addLibrarian: (data) => api.post('/api/admin/librarians', data),
  deleteLibrarian: (id) => api.delete(`/api/admin/librarians/${id}`),
  getEvents: () => api.get('/api/events'),
  addEvent: (data) => api.post('/api/events', data),
  getPrograms: () => api.get('/api/admin/programs'),
  addProgram: (data) => api.post('/api/admin/programs', data),
  deleteProgram: (id) => api.delete(`/api/admin/programs/${id}`),
  getEventById: (id) => api.get(`/api/events/${id}`),
  getFilters: () => api.get('/api/admin/filters'),
  getRoles: () => api.get('/api/admin/roles'),
  updateRole: (id, data) => api.put(`/api/admin/roles/${id}`, data),
  addRole: (data) => api.post('/api/admin/roles', data),
  deleteRole: (id) => api.delete(`/api/admin/roles/${id}`),
  getReports: (type) => api.get('/api/admin/reports', { params: { type } }),
};

// Parent API
export const parentApi = {
  getChildren: (email) => api.get(`/api/parents/dashboard/${email}`),
  getStudent360: (studentId) => api.get(`/api/parents/student-360/${studentId}`),
  uploadFeeReceipt: (id, formData) => api.post(`/api/parents/fees/${id}/upload-receipt`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Student/Common API
export const studentApi = {
  getTimetable: (program, year) => api.get(`/api/students/timetable/${program}`, { params: { year } }),
  getProfile: (email) => api.get(`/api/students/profile/${email}`),
};

// Auth API
export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  getPermissions: (role) => api.get('/api/auth/permissions', { params: { role } }),
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
  getReports: () => api.get('/api/leads/reports'),
};

// Library API
export const libraryApi = {
  getStats: () => api.get('/api/library/stats'),
  getBooks: (params) => api.get('/api/library/books', { params }),
  addBook: (data) => api.post('/api/library/books', data),
  getRequests: () => api.get('/api/library/requests'),
  updateRequest: (id, data) => api.put(`/api/library/requests/${id}`, data),
  getRecords: () => api.get('/api/library/records'),
  requestBook: (data) => api.post('/api/library/request', data),
  getMyRequests: (userId) => api.get(`/api/library/my-requests/${userId}`),
};

// Super Admin API
export const superAdminApi = {
  getDashboard: () => api.get('/api/superadmin/dashboard'),
  getColleges: () => api.get('/api/superadmin/colleges'),
  addCollege: (data) => api.post('/api/superadmin/colleges', data),
  deleteCollege: (id) => api.delete(`/api/superadmin/colleges/${id}`),
  getStudents: () => api.get('/api/superadmin/students'),
  getActivity: () => api.get('/api/superadmin/activity'),
  getRoles: () => api.get('/api/superadmin/roles'),
  updateRole: (id, data) => api.put(`/api/superadmin/roles/${id}`, data),
  getSettings: () => api.get('/api/superadmin/settings'),
  updateSettings: (data) => api.put('/api/superadmin/settings', data),
  sendEmail: (data) => api.post('/api/email/send', data),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (params) => api.get('/api/notifications', { params }),
  markRead: (id, email) => api.put(`/api/notifications/${id}/read`, { email }),
  markAllRead: (data) => api.put('/api/notifications/read-all', data),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};

export default api;
