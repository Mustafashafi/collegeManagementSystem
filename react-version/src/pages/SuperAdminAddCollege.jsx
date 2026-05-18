import React, { useState } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { useNavigate } from 'react-router-dom';
import { superAdminApi } from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminAddCollege = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    subscription: 'Basic (Up to 500 Students)',
    billingCycle: 'Monthly',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    const { name, code, location, subscription, billingCycle, adminName, adminEmail, adminPhone, adminPassword } = formData;
    if (!name || !code || !location || !subscription || !billingCycle || !adminName || !adminEmail || !adminPhone || !adminPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Registering college & administrator account...', { id: 'addCollege' });
      
      const { data } = await superAdminApi.addCollege(formData);
      
      if (data.success) {
        toast.success('Institution registered and Administrator account provisioned!', { id: 'addCollege' });
        navigate('/super-admin/colleges');
      } else {
        toast.error(data.message || 'Registration failed.', { id: 'addCollege' });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error registering institution.', { id: 'addCollege' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/super-admin/colleges')} className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none', transition: '0.2s', background: 'transparent', cursor: 'pointer' }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Register New Institution</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>Spin up a new dedicated, fully-isolated institution workspace in seconds.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f3f4f6', paddingBottom: '8px', color: '#1a1a1a', margin: '10px 0 5px 0' }}>General Information</h4>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Institution Name</label>
            <input 
              type="text" 
              name="name"
              className="form-control" 
              placeholder="e.g. Oxford College of Engineering" 
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Institution Code / Slug</label>
            <input 
              type="text" 
              name="code"
              className="form-control" 
              placeholder="e.g. oxford-eng" 
              value={formData.code}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Location / City</label>
            <input 
              type="text" 
              name="location"
              className="form-control" 
              placeholder="London, UK" 
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f3f4f6', paddingBottom: '8px', color: '#1a1a1a', margin: '20px 0 5px 0' }}>Subscription & Licensing</h4>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Subscription Plan</label>
            <select 
              name="subscription"
              className="form-control"
              value={formData.subscription}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', background: '#fff' }}
            >
              <option>Basic (Up to 500 Students)</option>
              <option>Standard (Up to 2000 Students)</option>
              <option>Enterprise (Unlimited)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Billing Cycle</label>
            <select 
              name="billingCycle"
              className="form-control"
              value={formData.billingCycle}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', background: '#fff' }}
            >
              <option>Monthly</option>
              <option>Yearly (Save 20%)</option>
            </select>
          </div>

          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f3f4f6', paddingBottom: '8px', color: '#1a1a1a', margin: '20px 0 5px 0' }}>Primary Administrative Contact</h4>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Admin Full Name</label>
            <input 
              type="text" 
              name="adminName"
              className="form-control" 
              placeholder="Principal Name / IT Manager" 
              value={formData.adminName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Official Email Address</label>
            <input 
              type="email" 
              name="adminEmail"
              className="form-control" 
              placeholder="admin@oxford.edu" 
              value={formData.adminEmail}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Contact Phone</label>
            <input 
              type="tel" 
              name="adminPhone"
              className="form-control" 
              placeholder="+44 ..." 
              value={formData.adminPhone}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Initial Temporary Password</label>
            <input 
              type="password" 
              name="adminPassword"
              className="form-control" 
              placeholder="********" 
              value={formData.adminPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
            />
          </div>
        </div>

        <div className="form-footer" style={{ borderTop: '1px solid #f3f4f6', marginTop: '30px', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            type="button"
            className="btn-cancel" 
            onClick={() => navigate('/super-admin/colleges')}
            style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer', color: '#4b5563' }}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn-submit"
            disabled={loading}
            style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, border: 'none', background: '#1a1a1a', color: '#fff', cursor: 'pointer' }}
          >
            {loading ? 'Registering...' : 'Register Institution & Create Admin'}
          </button>
        </div>
      </form>
    </SuperAdminLayout>
  );
};

export default SuperAdminAddCollege;
