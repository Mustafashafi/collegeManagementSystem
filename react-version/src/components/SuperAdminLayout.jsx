import React from 'react';
import { NavLink } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    {/* Sidebar */}
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-shield-alt"></i>
        <h2>EduGlobal</h2>
      </div>
      <div className="nav-menu">
        <div className="nav-section">
          <div className="nav-section-title">Main Control</div>
          <NavLink to="/super-admin/dashboard" className="nav-item"><i className="fas fa-chart-line"></i> Global Dashboard</NavLink>
          <NavLink to="/super-admin/colleges" className="nav-item"><i className="fas fa-university"></i> Institutions</NavLink>
          <NavLink to="/super-admin/students" className="nav-item"><i className="fas fa-user-graduate"></i> Students Overview</NavLink>
        </div>
        <div className="nav-section">
          <div className="nav-section-title">System Control</div>
          <NavLink to="/super-admin/activity" className="nav-item"><i className="fas fa-fingerprint"></i> System Activity</NavLink>
          <NavLink to="/super-admin/access" className="nav-item"><i className="fas fa-user-lock"></i> Access Levels</NavLink>
        </div>
        <div className="nav-section">
          <div className="nav-section-title">Configuration</div>
          <NavLink to="/super-admin/settings" className="nav-item"><i className="fas fa-cog"></i> Global Settings</NavLink>
          <NavLink to="/login" className="nav-item"><i className="fas fa-sign-out-alt"></i> Logout</NavLink>
        </div>
      </div>
    </aside>

    {/* Main Content */}
    <main className="main-content">
      <header className="topbar">
        <div className="topbar-left">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>System Infrastructure: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Healthy</span></p>
        </div>
        <div className="topbar-right">
          <div className="user-profile">
            <div className="user-info" style={{ textAlign: 'right' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, lineHeight: '1.2' }}>Global Administrator</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Master Access</p>
            </div>
            <div className="avatar" style={{ background: '#1a1a1a', borderRadius: '8px', marginLeft: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user && user.profileImage) {
                  return <img src={user.profileImage} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
                }
                return 'GA';
              })()}
            </div>
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        {children}
      </div>
    </main>
  </div>
);

export default SuperAdminLayout;
