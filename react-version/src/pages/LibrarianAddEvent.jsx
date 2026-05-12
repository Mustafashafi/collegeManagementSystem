import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const LibrarianAddEvent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Maintenance',
    date: '',
    description: '',
    location: 'Central Library'
  });

  const addEventMutation = useMutation({
    mutationFn: (data) => adminApi.addEvent({ ...data, category: `Library - ${data.category}` }),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast.success('Notice published successfully!');
      navigate('/librarian/events');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to publish notice');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addEventMutation.mutate(formData);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/librarian/events" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Post New Library Notice</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Notice Title</label>
            <input 
              type="text" 
              required
              className="form-control" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Library Closure for Audit" 
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Category</label>
            <select 
              className="form-control" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            >
              <option>Maintenance</option>
              <option>New Arrival</option>
              <option>Holiday</option>
              <option>General Event</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Notice Date</label>
            <input 
              type="date" 
              required
              className="form-control" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Content / Description</label>
            <textarea 
              required
              className="form-control" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', minHeight: '120px', outline: 'none', boxSizing: 'border-box' }} 
              placeholder="Write the details of the notice..."
            ></textarea>
          </div>
          <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to="/librarian/events" className="btn-cancel" style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)', textDecoration: 'none' }}>Cancel</Link>
            <button 
              type="submit" 
              disabled={addEventMutation.isLoading}
              className="btn-submit" 
              style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff', opacity: addEventMutation.isLoading ? 0.7 : 1 }}
            >
              {addEventMutation.isLoading ? 'Publishing...' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibrarianAddEvent;
