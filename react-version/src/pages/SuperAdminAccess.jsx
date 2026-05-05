import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';

const SuperAdminAccess = () => (
  <SuperAdminLayout>
    <div className="page-header">
      <h1>Global Access Levels</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Define what each administrative role can do across the entire institution network.</p>
    </div>
    
    <div className="access-grid">
      <div className="access-card">
        <h3><i className="fas fa-user-shield"></i> Institution Admin</h3>
        <p>Highest level of control within a single college. Can manage all students, staff, and finances for their unit.</p>
        <div className="perm-list">
          <div className="perm-item">
            <span className="perm-name">Manage Unit Staff</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="perm-item">
            <span className="perm-name">Delete Unit Data</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="perm-item">
            <span className="perm-name">Financial Reporting</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="perm-item">
            <span className="perm-name">Modify Unit Settings</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
        </div>
        <button className="btn-save">Update Permissions</button>
      </div>
      
      <div className="access-card">
        <h3><i className="fas fa-user-tie"></i> Support Staff</h3>
        <p>Operational access for technical support and data entry across multiple institutions.</p>
        <div className="perm-list">
          <div className="perm-item">
            <span className="perm-name">View Global Activity</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="perm-item">
            <span className="perm-name">Reset Passwords</span>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
          </div>
          <div className="perm-item">
            <span className="perm-name">Export Data</span>
            <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
          </div>
          <div className="perm-item">
            <span className="perm-name">Modify Server Config</span>
            <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
          </div>
        </div>
        <button className="btn-save">Update Permissions</button>
      </div>
    </div>
  </SuperAdminLayout>
);

export default SuperAdminAccess;
