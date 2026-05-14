import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const roleTemplates = {
  Teacher: {
    icon: "fas fa-chalkboard-teacher",
    permissions: [
      { name: "Mark Attendance", enabled: true },
      { name: "Upload Results", enabled: true },
      { name: "Manage Assignments", enabled: true },
      { name: "View Timetable", enabled: true },
    ]
  },
  Student: {
    icon: "fas fa-user-graduate",
    permissions: [
      { name: "View Timetable", enabled: true },
      { name: "Submit Assignments", enabled: true },
      { name: "View Results", enabled: true },
      { name: "Access Library", enabled: true },
    ]
  },
  Librarian: {
    icon: "fas fa-book-reader",
    permissions: [
      { name: "Manage Books", enabled: true },
      { name: "Issue Books", enabled: true },
      { name: "View Student Profile", enabled: true },
      { name: "Delete Records", enabled: false },
    ]
  },
  "Admissions Officer": {
    icon: "fas fa-user-check",
    permissions: [
      { name: "Manage Leads", enabled: true },
      { name: "Approve Applications", enabled: true },
      { name: "Marketing Campaigns", enabled: true },
      { name: "Edit Fee Structure", enabled: false },
    ]
  },
  Parent: {
    icon: "fas fa-user-friends",
    permissions: [
      { name: "View Student Progress", enabled: true },
      { name: "View Attendance", enabled: true },
      { name: "Pay Fees Online", enabled: true },
      { name: "Communicate with Teachers", enabled: true },
    ]
  }
};

const AdminAddRole = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [icon, setIcon] = useState("fas fa-user-shield");

  const handleTemplateSelect = (templateKey) => {
    const template = roleTemplates[templateKey];
    setSelectedTemplate(templateKey);
    setRoleName(templateKey);
    setPermissions(template.permissions);
    setIcon(template.icon);
    setDescription(`Standard permissions for the ${templateKey} role.`);
  };

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
    if (permissions.length === 0) return toast.error('Please select a role template or define permissions');
    
    mutation.mutate({
      title: roleName,
      icon: icon,
      permissions: permissions
    });
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin/access-control')} style={{ background: '#fff', border: '1px solid #e5e7eb', width: '40px', height: '40px', borderRadius: '10px', cursor: 'pointer' }}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>Define New Role</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Configure system-wide access levels and permissions</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        <form onSubmit={handleSubmit} className="settings-card" style={{ background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #f1f5f9' }}>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>SELECT ROLE TEMPLATE</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {Object.keys(roleTemplates).map((key) => (
                <div 
                  key={key} 
                  onClick={() => handleTemplateSelect(key)}
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    border: selectedTemplate === key ? '2px solid #111827' : '1px solid #e5e7eb',
                    background: selectedTemplate === key ? '#f9fafb' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className={roleTemplates[key].icon} style={{ fontSize: '20px', marginBottom: '8px', display: 'block', color: selectedTemplate === key ? '#111827' : '#9ca3af' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: selectedTemplate === key ? '#111827' : '#4b5563' }}>{key}</span>
                </div>
              ))}
            </div>
          </div>

          {permissions.length > 0 && (
            <>
              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Role Display Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Senior Faculty" 
                  style={{ padding: '14px', borderRadius: '10px', width: '100%', border: '1px solid #e5e7eb' }}
                  required
                />
              </div>

              <div className="permissions-section">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>CONFIGURE ACCESS MODULES</label>
                <div className="panel" style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                  {permissions.map((perm, idx) => (
                    <div key={idx} className="toggle-group" style={{ 
                      padding: '16px 20px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: idx % 2 === 0 ? '#fff' : '#fcfdfe',
                      borderBottom: idx === permissions.length - 1 ? 'none' : '1px solid #f1f5f9' 
                    }}>
                      <div className="toggle-info">
                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px', color: '#374151' }}>{perm.name}</h4>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>Grant access to this feature</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: perm.enabled ? '#10b981' : '#9ca3af' }}>
                          {perm.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={perm.enabled} 
                            onChange={() => handleToggle(idx)}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-footer" style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ background: '#111827', color: '#fff', padding: '14px 30px', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer', flex: 1 }}
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'Processing...' : 'Activate Role & Save Changes'}
                </button>
                <button type="button" className="btn-outline" onClick={() => navigate('/admin/access-control')} style={{ padding: '14px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </>
          )}
        </form>

        <div className="help-side" style={{ background: '#111827', borderRadius: '16px', padding: '30px', color: '#fff' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '20px' }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Role Management</h3>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '24px' }}>
            Define granular access levels for your staff. Each role template comes with a recommended security profile that you can customize.
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '12px', textTransform: 'uppercase' }}>Selected Role Preview</h4>
            {selectedTemplate ? (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <i className={icon} style={{ color: '#60a5fa' }}></i>
                  <span style={{ fontWeight: 600 }}>{roleName}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{description}</p>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No template selected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddRole;
