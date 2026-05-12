import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';

const LibrarianRequests = () => {
  const queryClient = useQueryClient();
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
      req.bookTitle?.toLowerCase().includes(term) ||
      req.bookId?.toLowerCase().includes(term)
    );
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, status }) => libraryApi.updateRequest(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['libraryRequests']);
      queryClient.invalidateQueries(['libraryStats']);
      toast.success('Request updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to update request');
    }
  });

  const handleUpdate = (id, status) => {
    updateRequestMutation.mutate({ id, status });
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Student & Teacher Book Requests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Approve or reject reservations made through the portals.</p>
      </div>

      <div className="filter-section" style={{ marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '14px' }}></i>
          <input 
            type="text" 
            placeholder="Search by Borrower ID, Name, or Book Title..." 
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
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Details</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Borrower Details</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Request Date</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-spinner fa-spin"></i> Loading...</td></tr>
              ) : filteredRequests?.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No requests found.</td></tr>
              ) : filteredRequests?.map((req) => (
                <tr key={req._id}>
                  <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <strong>{req.bookTitle}</strong><br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.bookId}</span>
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
                  <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <div className="btn-group" style={{ display: 'flex', gap: '8px' }}>
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleUpdate(req._id, 'Approved')} className="btn-sm approve" style={{ padding: '6px 12px', border: '1px solid #166534', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#166534' }}>Approve</button>
                          <button onClick={() => handleUpdate(req._id, 'Rejected')} className="btn-sm reject" style={{ padding: '6px 12px', border: '1px solid #b91c1c', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#b91c1c' }}>Reject</button>
                        </>
                      )}
                      {req.status === 'Approved' && (
                        <button onClick={() => handleUpdate(req._id, 'Issued')} className="btn-sm" style={{ padding: '6px 12px', border: '1px solid var(--primary)', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }}>Issue Book</button>
                      )}
                      {req.status === 'Issued' && (
                        <button onClick={() => handleUpdate(req._id, 'Returned')} className="btn-sm" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Return Book</button>
                      )}
                    </div>
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

export default LibrarianRequests;
