import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { useNavigate } from 'react-router-dom';

const SuperAdminAddCollege = () => {
  const navigate = useNavigate();

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/super-admin/colleges')} className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none', transition: '0.2s', background: 'transparent', cursor: 'pointer' }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Register New Institution</h1>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <h4 className="section-subtitle">General Information</h4>
          <div className="form-group full">
            <label>Institution Name</label>
            <input type="text" className="form-control" placeholder="e.g. Oxford College of Engineering" />
          </div>
          <div className="form-group">
            <label>Institution Code / Slug</label>
            <input type="text" className="form-control" placeholder="e.g. oxford-eng" />
          </div>
          <div className="form-group">
            <label>Location / City</label>
            <input type="text" className="form-control" placeholder="London, UK" />
          </div>
          
          <h4 className="section-subtitle">Subscription & Licensing</h4>
          <div className="form-group">
            <label>Subscription Plan</label>
            <select className="form-control">
              <option>Basic (Up to 500 Students)</option>
              <option>Standard (Up to 2000 Students)</option>
              <option>Enterprise (Unlimited)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Billing Cycle</label>
            <select className="form-control">
              <option>Monthly</option>
              <option>Yearly (Save 20%)</option>
            </select>
          </div>

          <h4 className="section-subtitle">Primary Administrative Contact</h4>
          <div className="form-group">
            <label>Admin Full Name</label>
            <input type="text" className="form-control" placeholder="Principal Name / IT Manager" />
          </div>
          <div className="form-group">
            <label>Official Email Address</label>
            <input type="email" className="form-control" placeholder="admin@oxford.edu" />
          </div>
          <div className="form-group">
            <label>Contact Phone</label>
            <input type="tel" className="form-control" placeholder="+44 ..." />
          </div>
          <div className="form-group">
            <label>Initial Temporary Password</label>
            <input type="password" className="form-control" placeholder="********" />
          </div>
        </div>
        <div className="form-footer">
          <button className="btn-cancel" onClick={() => navigate('/super-admin/colleges')}>Cancel</button>
          <button className="btn-submit">Register Institution & Create Admin</button>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminAddCollege;
