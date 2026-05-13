import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminAddRole = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([
    { name: "Student Management", enabled: true },
    { name: "Fee Records", enabled: false },
    { name: "Timetable Management", enabled: false },
    { name: "Library Access", enabled: true },
    { name: "Attendance Tracking", enabled: false },
    { name: "Results & Grading", enabled: false },
  ]);

  const mutation = useMutation({
    mutationFn: (data) => adminApi.addRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminRoles']);
      toast.success('New role created successfully!');
      navigate('/admin/access-control');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to create role');
    }
  });

  const handleToggle = (idx) => {
    const updated = [...permissions];
    updated[idx].enabled = !updated[idx].enabled;
    setPermissions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName) return toast.error('Role name is required');
    mutation.mutate({
      title: roleName,
      icon: "fas fa-user-shield", // Default icon for new roles
      permissions: permissions
    });
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin/access-control')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Define New Role</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-card" style={{ maxWidth: '800px', margin: '0 0' }}>
        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Role Name *</label>
          <input 
            type="text" 
            className="form-control" 
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Accounts Officer, Department Head" 
            style={{ padding: '14px', borderRadius: '10px' }}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Role Description</label>
          <textarea 
            className="form-control" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the purpose of this role..." 
            style={{ padding: '14px', borderRadius: '10px', minHeight: '100px', resize: 'vertical' }}
          ></textarea>
        </div>

        <div className="permissions-section">
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Module Permissions</h3>
          
          <div className="panel" style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '10px 24px' }}>
            {permissions.map((perm, idx) => (
              <div key={idx} className="toggle-group" style={{ 
                padding: '20px 0', 
                borderBottom: idx === permissions.length - 1 ? 'none' : '1px solid #f1f5f9' 
              }}>
                <div className="toggle-info">
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{perm.name}</h4>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Enable or disable access to this module</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={perm.enabled} 
                      onChange={() => handleToggle(idx)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', minWidth: '80px' }}>{perm.enabled ? 'Full Access' : 'No Access'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-footer" style={{ marginTop: '40px', paddingTop: '30px' }}>
          <button type="button" className="btn-outline" onClick={() => navigate('/admin/access-control')} style={{ padding: '12px 24px', borderRadius: '10px' }}>Cancel</button>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ background: '#111827', color: '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none' }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Saving...' : 'Create Role & Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddRole;
