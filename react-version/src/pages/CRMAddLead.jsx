import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CRMAddLead = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    program: '',
    source: 'Phone',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Lead added successfully!');
        navigate('/crm/leads');
      } else {
        toast.error('Failed to add lead.');
      }
    } catch (err) {
      console.error('Error adding lead:', err);
      toast.error('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/crm/leads')} className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', background: '#fff', cursor: 'pointer' }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Add New Lead</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Basic Details</h4>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>First Name</label>
              <input 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text" 
                className="form-control" 
                placeholder="e.g. John" 
                required
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Last Name</label>
              <input 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text" 
                className="form-control" 
                placeholder="e.g. Doe" 
                required
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Phone Number</label>
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel" 
                className="form-control" 
                placeholder="+1 234 567 890" 
                required
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Email Address</label>
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email" 
                className="form-control" 
                placeholder="johndoe@example.com" 
                required
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>

            <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Inquiry Details</h4>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Interested Program</label>
              <select 
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="form-control" 
                required
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="">Select Program...</option>
                <option>B.Sc Computer Science</option>
                <option>Business Administration</option>
                <option>Engineering</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Lead Source</label>
              <select 
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="form-control" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="Phone">Phone / Call</option>
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
            <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Notes / Comments</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-control" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', minHeight: '100px', outline: 'none', boxSizing: 'border-box' }} 
                placeholder="Add initial notes or questions asked by the lead..."
              ></textarea>
            </div>
          </div>
          <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <button type="button" className="btn-cancel" onClick={() => navigate('/crm/leads')} style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-submit" style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRMAddLead;
