import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const LibrarianDashboard = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['libraryStats'],
    queryFn: () => libraryApi.getStats().then(res => res.data || { totalBooks: 0, currentlyIssued: 0, pendingRequests: 0, overdue: 0 }),
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['libraryRequests'],
    queryFn: () => libraryApi.getRequests().then(res => Array.isArray(res.data) ? res.data : []),
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, status }) => libraryApi.updateRequest(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['libraryRequests']);
      queryClient.invalidateQueries(['libraryStats']);
      toast.success('Request status updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to update request');
    }
  });

  const handleUpdate = (id, status) => {
    updateRequestMutation.mutate({ id, status });
  };

  if (statsLoading || requestsLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>;
  }

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Library Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage inventory, track issues, and review requests.</p>
        </div>
        <Link to="/librarian/books/add" className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
          <i className="fas fa-plus"></i> Add New Book
        </Link>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Books</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{stats?.totalBooks || 0}</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>In library inventory</div>
          <i className="fas fa-book" style={{ fontSize: '20px', color: 'var(--primary)', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Currently Issued</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{stats?.currentlyIssued || 0}</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Books currently out</div>
          <i className="fas fa-hand-holding" style={{ fontSize: '20px', color: 'var(--primary)', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Requests</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{stats?.pendingRequests || 0}</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Awaiting approval</div>
          <i className="fas fa-clipboard-list" style={{ fontSize: '20px', color: 'var(--primary)', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', color: '#ef4444' }}>{stats?.overdue || 0}</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Requires follow-up</div>
          <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444', fontSize: '20px', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Book Requests</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Book Title</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Requested By</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Date</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests?.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No requests found</td></tr>
                ) : requests?.slice(0, 5).map((req, idx) => (
                  <tr key={req._id}>
                    <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      <strong>{req.bookTitle}</strong><br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.bookId}</span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      {req.userName}<br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {req.studentId && req.studentId !== 'N/A' ? req.studentId : req.userRole}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      {new Date(req.requestDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      <span className="status-badge" style={{ 
                        padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, 
                        background: req.status === 'Pending' ? '#fef9c3' : req.status === 'Issued' ? '#dbeafe' : req.status === 'Returned' ? '#dcfce7' : '#fee2e2', 
                        color: req.status === 'Pending' ? '#854d0e' : req.status === 'Issued' ? '#1e40af' : req.status === 'Returned' ? '#166534' : '#b91c1c' 
                      }}>{req.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      <div className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                        {req.status === 'Pending' && (
                          <>
                            <button onClick={() => handleUpdate(req._id, 'Approved')} className="btn-outline approve" style={{ padding: '6px 12px', background: '#fff', border: '1px solid #166534', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#166534' }}>Approve</button>
                            <button onClick={() => handleUpdate(req._id, 'Rejected')} className="btn-outline reject" style={{ padding: '6px 12px', background: '#fff', border: '1px solid #b91c1c', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#b91c1c' }}>Reject</button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <button onClick={() => handleUpdate(req._id, 'Issued')} className="btn-outline" style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: 'var(--primary)' }}>Issue Book</button>
                        )}
                        {req.status === 'Issued' && (
                          <button onClick={() => handleUpdate(req._id, 'Returned')} className="btn-outline" style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: 'var(--text-main)' }}>Return Book</button>
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
    </div>
  );
};

export default LibrarianDashboard;
