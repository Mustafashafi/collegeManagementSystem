import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const CRMAddApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: 'Male',
    email: '', phone: '', address: '', previousInstitution: '',
    passingYear: '', marks: '', program: '', fatherName: '', parentEmail: ''
  });
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/programs`);
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      }
    };
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Normalize phone number: replace +92 with 0
    const finalPhone = formData.phone.startsWith('+92') ? formData.phone.replace('+92', '0') : formData.phone;
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'phone') {
        submissionData.append(key, finalPhone);
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        body: submissionData
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Application created successfully!");
        navigate('/crm/applications');
      } else {
        toast.error(data.msg || "Failed to create application");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/crm/applications')} className="btn-back" style={{ background: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Manual Application Entry</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '900px' }}>
        <form className="form-grid" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Personal Details</h4>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>

          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Parent / Guardian Details</h4>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Father's Name</label>
            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Parent Email</label>
            <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }} />
          </div>

          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Program Selection</h4>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Applying For</label>
            <select name="program" value={formData.program} onChange={handleChange} required className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <option value="">Select Program...</option>
              {programs.map(p => (
                <option key={p._id} value={p.name}>{p.name} ({p.year})</option>
              ))}
            </select>
          </div>

          <div className="form-footer" style={{ gridColumn: 'span 2', marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <button type="button" className="btn-cancel" onClick={() => navigate('/crm/applications')} style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading} style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>
              {loading ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRMAddApplication;
