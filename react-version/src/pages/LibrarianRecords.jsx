import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../services/api';

const LibrarianRecords = () => {
  const [search, setSearch] = useState('');

  const { data: records, isLoading } = useQuery({
    queryKey: ['libraryRecords'],
    queryFn: () => libraryApi.getRecords().then(res => res.data),
  });

  const filteredRecords = records?.filter(rec => {
    const term = search.toLowerCase();
    return (
      rec.userName?.toLowerCase().includes(term) ||
      rec.studentId?.toLowerCase().includes(term) ||
      rec.bookTitle?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>All Library Transactions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Historical record of all issued and returned items.</p>
      </div>

      <div className="filter-section" style={{ marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}></i>
          <input 
            type="text" 
            placeholder="Search history by Borrower ID, Name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 40px', 
              background: '#fff', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              fontSize: '14px', 
              outline: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }} 
          />
        </div>
      </div>

      <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Borrower</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Title</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Issue Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Due Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Return Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-spinner fa-spin"></i> Loading...</td></tr>
              ) : filteredRecords?.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
              ) : filteredRecords?.map((rec) => (
                <tr key={rec._id}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    {rec.userName}<br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {rec.studentId && rec.studentId !== 'N/A' ? rec.studentId : rec.userRole}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{rec.bookTitle}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{rec.issueDate ? new Date(rec.issueDate).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{rec.dueDate ? new Date(rec.dueDate).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{rec.returnDate ? new Date(rec.returnDate).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span className="status-badge" style={{ 
                      padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, 
                      background: rec.status === 'Returned' ? '#f3f4f6' : rec.status === 'Issued' ? '#dbeafe' : '#fee2e2', 
                      color: rec.status === 'Returned' ? 'var(--text-muted)' : rec.status === 'Issued' ? '#1e40af' : '#b91c1c' 
                    }}>{rec.status}</span>
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

export default LibrarianRecords;
