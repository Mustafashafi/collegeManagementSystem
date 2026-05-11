import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const TeacherEditAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, subject, dueDate, description } = location.state || {};

  const [formData, setFormData] = useState({
    title: title || '',
    dueDate: dueDate ? new Date(dueDate).toISOString().split('T')[0] : '',
    description: description || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!title || !subject) {
      toast.error('No assignment selected for editing');
      navigate('/teacher/assignments');
    }
  }, [title, subject, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers/assignments/${encodeURIComponent(title)}/${encodeURIComponent(subject)}/${encodeURIComponent(user.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dueDate: formData.dueDate,
          description: formData.description
        })
      });

      if (response.ok) {
        toast.success(`Assignment updated successfully!`);
        navigate('/teacher/assignments');
      } else {
        const error = await response.json();
        toast.error(error.msg || 'Failed to update assignment');
      }
    } catch (err) {
      console.error('Error updating assignment:', err);
      toast.error('Connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <NavLink to="/teacher/assignments" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </NavLink>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Edit Assignment Deadline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{subject} • {title}</p>
        </div>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>New Due Date</label>
            <input 
              type="date" 
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="form-control" 
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Update Instructions (Optional)</label>
            <textarea 
              className="form-control" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Write updated instructions..." 
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            ></textarea>
          </div>

          <div className="form-footer" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <NavLink to="/teacher/assignments" className="btn-outline" style={{ padding: '12px 24px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', textAlign: 'center' }}>Cancel</NavLink>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </TeacherLayout>
  );
};

export default TeacherEditAssignment;
