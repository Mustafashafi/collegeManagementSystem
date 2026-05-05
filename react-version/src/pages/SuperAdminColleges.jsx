import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { NavLink } from 'react-router-dom';

const SuperAdminColleges = () => (
  <SuperAdminLayout>
    <div className="page-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Institution Management</h1>
      <NavLink to="/super-admin/add-college" className="btn-primary" style={{ textDecoration: 'none', background: '#1a1a1a', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fas fa-plus"></i> Add Institution
      </NavLink>
    </div>

    <div className="search-bar" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '30px' }}>
      <input type="text" className="search-input" placeholder="Search by name, country, or admin..." style={{ width: '100%', background: '#f1f5f9', border: 'none', padding: '12px 20px', borderRadius: '8px', outline: 'none', fontSize: '14px', color: '#111827' }} />
    </div>

    <div className="college-grid">
      <div className="college-card">
        <div className="college-header">
          <div className="college-logo">SC</div>
          <div className="college-info">
            <h3>Skyra City College</h3>
            <p>New York, USA • Since 2021</p>
          </div>
        </div>
        <div className="college-stats">
          <div className="c-stat">
            <h4>TOTAL USERS</h4>
            <p>4,250</p>
          </div>
          <div className="c-stat">
            <h4>STORAGE USED</h4>
            <p>420 GB</p>
          </div>
        </div>
        <div className="college-footer">
          <div className="status-active">
            <div className="dot"></div> Active
          </div>
          <div className="actions">
            <button className="btn-icon"><i className="fas fa-external-link-alt"></i></button>
            <button className="btn-icon"><i className="fas fa-cog"></i></button>
            <button className="btn-icon" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>

      <div className="college-card">
        <div className="college-header">
          <div className="college-logo">IV</div>
          <div className="college-info">
            <h3>Ivy Technical Institute</h3>
            <p>London, UK • Since 2022</p>
          </div>
        </div>
        <div className="college-stats">
          <div className="c-stat">
            <h4>TOTAL USERS</h4>
            <p>2,800</p>
          </div>
          <div className="c-stat">
            <h4>STORAGE USED</h4>
            <p>180 GB</p>
          </div>
        </div>
        <div className="college-footer">
          <div className="status-active">
            <div className="dot"></div> Active
          </div>
          <div className="actions">
            <button className="btn-icon"><i className="fas fa-external-link-alt"></i></button>
            <button className="btn-icon"><i className="fas fa-cog"></i></button>
            <button className="btn-icon" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>

      <div className="college-card">
        <div className="college-header">
          <div className="college-logo">IV</div>
          <div className="college-info">
            <h3>Ivy Technical Institute</h3>
            <p>London, UK • Since 2022</p>
          </div>
        </div>
        <div className="college-stats">
          <div className="c-stat">
            <h4>TOTAL USERS</h4>
            <p>2,800</p>
          </div>
          <div className="c-stat">
            <h4>STORAGE USED</h4>
            <p>180 GB</p>
          </div>
        </div>
        <div className="college-footer">
          <div className="status-active">
            <div className="dot"></div> Active
          </div>
          <div className="actions">
            <button className="btn-icon"><i className="fas fa-external-link-alt"></i></button>
            <button className="btn-icon"><i className="fas fa-cog"></i></button>
            <button className="btn-icon" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
);

export default SuperAdminColleges;
