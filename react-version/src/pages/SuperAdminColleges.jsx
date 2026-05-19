import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { NavLink } from 'react-router-dom';
import { superAdminApi } from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Email Modal State
  const [emailModal, setEmailModal] = useState({
    isOpen: false,
    adminEmail: '',
    adminName: '',
    subject: '',
    message: '',
    sending: false
  });

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await superAdminApi.getColleges();
      if (data.success) {
        setColleges(data.colleges || []);
      } else {
        setError('Failed to fetch institutions.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you absolutely sure you want to remove "${name}"?\nThis will also revoke the primary administrator's login access.`)) {
      return;
    }

    try {
      toast.loading(`Deleting ${name}...`, { id: 'deleteCollege' });
      const { data } = await superAdminApi.deleteCollege(id);
      if (data.success) {
        toast.success(`${name} deleted successfully!`, { id: 'deleteCollege' });
        setColleges(prev => prev.filter(c => c._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete institution.', { id: 'deleteCollege' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error deleting institution.', { id: 'deleteCollege' });
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailModal.subject || !emailModal.message) {
      return toast.error('Subject and message are required.');
    }

    try {
      setEmailModal(prev => ({ ...prev, sending: true }));
      toast.loading('Sending email...', { id: 'sendEmail' });
      
      const payload = {
        recipients: [{ email: emailModal.adminEmail, name: emailModal.adminName }],
        subject: emailModal.subject,
        message: emailModal.message
      };

      const { data } = await superAdminApi.sendEmail(payload);
      
      if (data.success) {
        toast.success('Email sent successfully!', { id: 'sendEmail' });
        setEmailModal({ isOpen: false, adminEmail: '', adminName: '', subject: '', message: '', sending: false });
      } else {
        toast.error(data.msg || 'Failed to send email.', { id: 'sendEmail' });
      }
    } catch (err) {
      console.error('Error sending email:', err);
      toast.error('Server error sending email.', { id: 'sendEmail' });
    } finally {
      setEmailModal(prev => ({ ...prev, sending: false }));
    }
  };

  // Filter colleges based on search query
  const filteredColleges = colleges.filter(college => {
    const q = search.toLowerCase();
    return (
      (college.name && college.name.toLowerCase().includes(q)) ||
      (college.location && college.location.toLowerCase().includes(q)) ||
      (college.adminEmail && college.adminEmail.toLowerCase().includes(q)) ||
      (college.adminName && college.adminName.toLowerCase().includes(q)) ||
      (college.code && college.code.toLowerCase().includes(q))
    );
  });

  const getInitials = (name) => {
    if (!name) return 'IN';
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Institution Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Register, configure, and monitor independent institutional clusters.</p>
        </div>
        <NavLink to="/super-admin/add-college" className="btn-primary" style={{ textDecoration: 'none', background: '#1a1a1a', color: 'white', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', transition: '0.2s' }}>
          <i className="fas fa-plus"></i> Add Institution
        </NavLink>
      </div>

      <div className="search-bar" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <i className="fas fa-search" style={{ color: '#9ca3af', fontSize: '16px' }}></i>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search institutions by name, location, admin or code..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#111827' }} 
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="loading-spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1a1a1a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchColleges} style={{ marginTop: '16px', background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      ) : filteredColleges.length === 0 ? (
        <div className="panel" style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          <i className="fas fa-university" style={{ fontSize: '48px', marginBottom: '16px', color: '#d1d5db' }}></i>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>No Institutions Found</h3>
          <p style={{ fontSize: '14px' }}>Try adjusting your search criteria or register a new institution.</p>
        </div>
      ) : (
        <div className="college-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredColleges.map((college) => (
            <div
              key={college._id}
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.2s'
              }}
            >
              {/* Card Header */}
              <div style={{ padding: '20px 20px 16px', display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '10px',
                  background: '#1a1a1a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '15px', flexShrink: 0, letterSpacing: '0.5px'
                }}>
                  {getInitials(college.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {college.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '3px 0 0 0' }}>
                    {college.location}
                  </p>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                  background: college.subscription?.toLowerCase().includes('enterprise') ? '#ede9fe' : '#f0fdf4',
                  color: college.subscription?.toLowerCase().includes('enterprise') ? '#7c3aed' : '#166534',
                  flexShrink: 0
                }}>
                  {college.subscription?.split(' ')[0] || 'Basic'}
                </span>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'flex', padding: '16px 20px', gap: '0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Active Users</p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>{college.totalUsers?.toLocaleString() || '0'}</p>
                </div>
                <div style={{ width: '1px', background: '#f3f4f6' }}></div>
                <div style={{ flex: 1, paddingLeft: '20px' }}>
                  <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Storage Used</p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>{college.storageUsed || '0 GB'}</p>
                </div>
              </div>

              {/* Admin Info */}
              {college.adminEmail && (
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="far fa-user-circle" style={{ fontSize: '13px', color: '#9ca3af' }}></i>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{college.adminName || 'Admin'}</span>
                  <span style={{ fontSize: '12px', color: '#d1d5db', margin: '0 2px' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{college.adminEmail}</span>
                </div>
              )}

              {/* Footer */}
              <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: college.status === 'Active' ? '#22c55e' : '#ef4444' }}></div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: college.status === 'Active' ? '#16a34a' : '#dc2626' }}>{college.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEmailModal({ isOpen: true, adminEmail: college.adminEmail, adminName: college.adminName, subject: '', message: '', sending: false })}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#6b7280', background: '#fff', cursor: 'pointer', transition: '0.2s' }}
                    title={`Contact: ${college.adminName}`}
                  >
                    <i className="far fa-envelope" style={{ fontSize: '12px' }}></i>
                  </button>
                  <button
                    onClick={() => handleDelete(college._id, college.name)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', cursor: 'pointer', transition: '0.2s' }}
                    title="Delete Institution"
                  >
                    <i className="far fa-trash-alt" style={{ fontSize: '12px' }}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {emailModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>Send Email to Admin</h3>
              <button onClick={() => setEmailModal({ ...emailModal, isOpen: false })} style={{ background: 'none', border: 'none', fontSize: '16px', color: '#6b7280', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSendEmail}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>To</label>
                <input type="text" value={`${emailModal.adminName} <${emailModal.adminEmail}>`} disabled style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#6b7280', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Subject</label>
                <input 
                  type="text" 
                  required
                  value={emailModal.subject} 
                  onChange={e => setEmailModal({...emailModal, subject: e.target.value})}
                  placeholder="Enter email subject"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Message</label>
                <textarea 
                  required
                  value={emailModal.message}
                  onChange={e => setEmailModal({...emailModal, message: e.target.value})}
                  placeholder="Type your message here..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', minHeight: '120px', resize: 'vertical', boxSizing: 'border-box' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setEmailModal({ ...emailModal, isOpen: false })} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={emailModal.sending} style={{ padding: '10px 20px', background: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: emailModal.sending ? 0.7 : 1 }}>
                  {emailModal.sending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminColleges;
