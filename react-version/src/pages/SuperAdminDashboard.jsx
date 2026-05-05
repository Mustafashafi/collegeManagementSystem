import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { NavLink } from 'react-router-dom';

const SuperAdminDashboard = () => (
  <SuperAdminLayout>
    <div className="page-header" style={{ marginBottom: '40px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Network Overview</h1>
    </div>

    <div className="stats-grid" style={{ marginBottom: '40px' }}>
      <div className="stat-card">
        <div className="stat-icon blue" style={{ marginBottom: '10px' }}><i className="fas fa-university"></i></div>
        <div className="stat-val">24</div>
        <div className="stat-label">Total Institutions</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon purple" style={{ marginBottom: '10px' }}><i className="fas fa-users"></i></div>
        <div className="stat-val">42.5k</div>
        <div className="stat-label">Total Students (Global)</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green" style={{ marginBottom: '10px' }}><i className="fas fa-database"></i></div>
        <div className="stat-val">1.2 TB</div>
        <div className="stat-label">Data Usage</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon orange" style={{ marginBottom: '10px' }}><i className="fas fa-clock"></i></div>
        <div className="stat-val">99.9%</div>
        <div className="stat-label">System Uptime</div>
      </div>
    </div>

    <div className="panel" style={{ marginBottom: '40px' }}>
      <div className="panel-header" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Top Performing Institutions</h3>
        <NavLink to="/super-admin/colleges" style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>Manage All</NavLink>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>INSTITUTION NAME</th>
            <th>LOCATION</th>
            <th>ACTIVE USERS</th>
            <th>SUBSCRIPTION</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="inst-name">
                <div className="inst-logo">SC</div>
                <strong style={{ fontSize: '14px' }}>Skyra City College</strong>
              </div>
            </td>
            <td style={{ color: '#4b5563' }}>New York, USA</td>
            <td style={{ fontWeight: 500 }}>4,250</td>
            <td style={{ color: '#4b5563' }}>Enterprise</td>
            <td><span className="status-pill status-active">Active</span></td>
            <td><a href="#" className="btn-view" style={{ fontSize: '13px', fontWeight: 600 }}>Details</a></td>
          </tr>
          <tr>
            <td>
              <div className="inst-name">
                <div className="inst-logo">IV</div>
                <strong style={{ fontSize: '14px' }}>Ivy Technical Institute</strong>
              </div>
            </td>
            <td style={{ color: '#4b5563' }}>London, UK</td>
            <td style={{ fontWeight: 500 }}>2,800</td>
            <td style={{ color: '#4b5563' }}>Standard</td>
            <td><span className="status-pill status-active">Active</span></td>
            <td><a href="#" className="btn-view" style={{ fontSize: '13px', fontWeight: 600 }}>Details</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="panel">
      <div className="panel-header" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent System Activity</h3>
      </div>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', marginTop: '6px' }}></div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>New Institution Added: Global Heights University</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Admin: Ga_Master | 2 hours ago</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px' }}></div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>System Update: v4.2.1 Deployed successfully</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Automated Task | 5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
);

export default SuperAdminDashboard;
