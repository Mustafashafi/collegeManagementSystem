import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddRole = () => {
  const navigate = useNavigate();

  const permissions = [
    { title: "Student Management", subtitle: "View, Add, Edit student records", access: "Full Access", checked: true },
    { title: "Fee Records", subtitle: "Collect fees, Generate invoices", access: "Full Access", checked: false },
    { title: "Timetable Management", subtitle: "Modify schedules", access: "Full Access", checked: false },
    { title: "Library Access", subtitle: "Manage book requests", access: "View Only", checked: true },
  ];

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/admin/access-control')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Define New Role</h1>
        </div>
      </div>

      <div className="settings-card" style={{ maxWidth: '800px', margin: '0 0' }}>
        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Role Name</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Accounts Officer, Department Head" 
            style={{ padding: '14px', borderRadius: '10px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Role Description</label>
          <textarea 
            className="form-control" 
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
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{perm.title}</h4>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{perm.subtitle}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="switch">
                    <input type="checkbox" defaultChecked={perm.checked} />
                    <span className="slider"></span>
                  </label>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', minWidth: '80px' }}>{perm.access}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-footer" style={{ marginTop: '40px', paddingTop: '30px' }}>
          <button className="btn-outline" onClick={() => navigate('/admin/access-control')} style={{ padding: '12px 24px', borderRadius: '10px' }}>Cancel</button>
          <button className="btn-primary" style={{ background: '#111827', color: '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none' }}>Create Role & Save</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddRole;
