import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminAddEvent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    tag: 'EVENT',
    audience: 'All',
    location: '',
    date: '',
    time: '',
    description: ''
  });

  const createEventMutation = useMutation({
    mutationFn: (data) => adminApi.addEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
      toast.success('Event published successfully!');
      navigate('/admin/events');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to publish event');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createEventMutation.mutate(formData);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <Link to="/admin/events" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Create New Event</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <form className="form-grid" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Event Title</label>
            <input 
              type="text" 
              required
              className="form-control" 
              placeholder="e.g. Annual Sports Day 2026" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Event Category</label>
            <select 
              className="form-control"
              value={formData.tag}
              onChange={(e) => setFormData({...formData, tag: e.target.value})}
            >
              <option value="EVENT">Event</option>
              <option value="ACADEMIC">Academic</option>
              <option value="HOLIDAY">Holiday</option>
              <option value="NOTICE">Notice</option>
              <option value="LIBRARY">Library Notice</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Audience</label>
            <select 
              className="form-control"
              value={formData.audience}
              onChange={(e) => setFormData({...formData, audience: e.target.value})}
            >
              <option value="All">Everyone (All)</option>
              <option value="Student">Students Only</option>
              <option value="Teacher">Teachers Only</option>
              <option value="Librarian">Librarians Only</option>
              <option value="Parent">Parents Only</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location / Venue</label>
            <input 
              type="text" 
              required
              className="form-control" 
              placeholder="Main Auditorium" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              required
              className="form-control" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input 
              type="text" 
              required
              className="form-control" 
              placeholder="09:00 AM - 05:00 PM" 
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <textarea 
              required
              className="form-control" 
              style={{ minHeight: '100px' }} 
              placeholder="Describe the event details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <div className="form-footer" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <Link to="/admin/events" className="btn-cancel">Cancel</Link>
            <button 
              type="submit" 
              disabled={createEventMutation.isLoading}
              className="btn-submit"
              style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              {createEventMutation.isLoading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddEvent;
