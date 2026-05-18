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
            <div className="college-card" key={college._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="college-header" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div className="college-logo" style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f1f5f9', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
                  {getInitials(college.name)}
                </div>
                <div className="college-info" style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>{college.name}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{college.location} • Plan: {college.subscription.split(' ')[0]}</p>
                </div>
              </div>

              <div className="college-stats" style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '16px 0' }}>
                <div className="c-stat" style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Active Users</h4>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginTop: '4px', margin: 0 }}>{college.totalUsers.toLocaleString()}</p>
                </div>
                <div className="c-stat" style={{ flex: 1, borderLeft: '1px solid #f3f4f6', paddingLeft: '16px' }}>
                  <h4 style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Storage Used</h4>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginTop: '4px', margin: 0 }}>{college.storageUsed || '0 GB'}</p>
                </div>
              </div>

              <div className="college-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="status-active" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: college.status === 'Active' ? '#22c55e' : '#ef4444' }}>
                  <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: college.status === 'Active' ? '#22c55e' : '#ef4444' }}></div> {college.status}
                </div>
                <div className="actions" style={{ display: 'flex', gap: '8px' }}>
                  <a href={`mailto:${college.adminEmail}`} className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#4b5563', textDecoration: 'none', background: '#fff', cursor: 'pointer', transition: '0.2s' }} title={`Contact Admin: ${college.adminName}`}>
                    <i className="far fa-envelope"></i>
                  </a>
                  <button onClick={() => handleDelete(college._id, college.name)} className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', cursor: 'pointer', transition: '0.2s' }} title="Delete Institution">
                    <i className="far fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminColleges;
