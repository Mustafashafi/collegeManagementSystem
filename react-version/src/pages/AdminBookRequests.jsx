import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../services/api';

const AdminBookRequests = () => {
  const [search, setSearch] = useState('');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['libraryRequests'],
    queryFn: () => libraryApi.getRequests().then(res => res.data),
  });

  const filteredRequests = requests?.filter(req => {
    const term = search.toLowerCase();
    return (
      req.userName?.toLowerCase().includes(term) ||
      req.studentId?.toLowerCase().includes(term) ||
      req.bookTitle?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Library Book Requests Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Overview of book issuance requests from students and teachers across the institution.</p>
        </div>
      </div>

      <div className="filter-section" style={{ marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}></i>
          <input 
            type="text" 
            placeholder="Search by Borrower ID, Name, or Book..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 40px', 
              background: '#fff', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              fontSize: '14px', 
              outline: 'none'
            }} 
          />
        </div>
      </div>

      <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Title & ID</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Requested By</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Request Date</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-spinner fa-spin"></i> Loading...</td></tr>
              ) : filteredRequests?.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No requests found.</td></tr>
              ) : filteredRequests?.map((req) => (
                <tr key={req._id}>
                  <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <strong>{req.bookTitle}</strong><br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {req.bookId}</span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    {req.userName}<br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {req.studentId && req.studentId !== 'N/A' ? req.studentId : req.userRole}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span className="status-badge" style={{ 
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, 
                      background: req.status === 'Pending' ? '#fef9c3' : req.status === 'Approved' ? '#dcfce7' : req.status === 'Issued' ? '#dbeafe' : '#fee2e2', 
                      color: req.status === 'Pending' ? '#854d0e' : req.status === 'Approved' ? '#166534' : req.status === 'Issued' ? '#1e40af' : '#b91c1c' 
                    }}>{req.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookRequests;
