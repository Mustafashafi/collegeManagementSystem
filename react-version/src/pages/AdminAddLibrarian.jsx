import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminAddLibrarian = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const addLibrarianMutation = useMutation({
    mutationFn: (data) => adminApi.addLibrarian(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['librarians']);
      toast.success('Librarian added successfully!');
      navigate('/admin/librarians');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to add librarian');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addLibrarianMutation.mutate(formData);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/admin/librarians" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Add New Librarian</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
            <input 
              type="text" 
              required
              className="form-control" 
              placeholder="Jane Cooper" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              required
              className="form-control" 
              placeholder="jane.c@college.edu" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Initial Password</label>
            <input 
              type="password" 
              required
              className="form-control" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
            />
          </div>
          <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to="/admin/librarians" className="btn-cancel" style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>Cancel</Link>
            <button 
              type="submit" 
              disabled={addLibrarianMutation.isLoading}
              className="btn-submit" 
              style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: addLibrarianMutation.isLoading ? 0.7 : 1 }}
            >
              {addLibrarianMutation.isLoading ? 'Adding...' : 'Add Librarian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddLibrarian;
