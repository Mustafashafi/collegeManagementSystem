import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';

const SuperAdminSettings = () => (
  <SuperAdminLayout>
    <div className="page-header" style={{ marginBottom: '30px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Global System Settings</h1>
    </div>
    <div className="settings-card">
      <div className="settings-section">
        <h3 className="section-title"><i className="fas fa-globe"></i> Branding & Platform</h3>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Platform Name</label>
          <input type="text" className="form-control" defaultValue="EduSystem Global ERP" />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Primary Support Email</label>
          <input type="email" className="form-control" defaultValue="support@eduglobal.com" />
        </div>
      </div>
      
      <div className="settings-section">
        <h3 className="section-title"><i className="fas fa-lock"></i> Security & Access</h3>
        <div className="toggle-group">
          <div className="toggle-info">
            <h4>Two-Factor Authentication (Mandatory)</h4>
            <p>Require 2FA for all Institution Administrators.</p>
          </div>
          <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
        </div>
        <div className="toggle-group">
          <div className="toggle-info">
            <h4>Global API Access</h4>
            <p>Enable third-party integrations across all clusters.</p>
          </div>
          <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3 className="section-title"><i className="fas fa-database"></i> Maintenance</h3>
        <div className="toggle-group">
          <div className="toggle-info">
            <h4>Maintenance Mode</h4>
            <p>Disable all institution portals for scheduled maintenance.</p>
          </div>
          <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
        </div>
      </div>
      
      <div style={{ textAlign: 'right', marginTop: '40px' }}>
        <button className="btn-primary" style={{ padding: '12px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          Save Global Configuration
        </button>
      </div>
    </div>
  </SuperAdminLayout>
);

export default SuperAdminSettings;
