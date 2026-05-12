import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '../services/api';
import toast from 'react-hot-toast';

const LibrarianIssue = () => {
  const queryClient = useQueryClient();
  const [issueData, setIssueData] = useState({
    userId: '',
    bookId: '',
    dueDate: ''
  });

  const { data: activeIssues, isLoading } = useQuery({
    queryKey: ['activeIssues'],
    queryFn: () => libraryApi.getRequests().then(res => res.data.filter(r => r.status === 'Issued')),
  });

  const returnMutation = useMutation({
    mutationFn: (id) => libraryApi.updateRequest(id, { status: 'Returned' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['activeIssues']);
      queryClient.invalidateQueries(['libraryRecords']);
      queryClient.invalidateQueries(['libraryStats']);
      toast.success('Book marked as returned');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to return book');
    }
  });

  const handleReturn = (id) => {
    returnMutation.mutate(id);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Issue & Return Management</h1>
      </div>

      <div className="issue-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-plus-circle"></i> Issue New Book
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px' }}>To issue a book, please use the "Requests" tab to approve student requests, or fill the form below (Coming Soon).</p>
          
          <div className="form-group" style={{ marginBottom: '16px', opacity: 0.6 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>User Email or ID</label>
            <input disabled type="text" className="form-control" placeholder="e.g. student@college.com" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '16px', opacity: 0.6 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Book ISBN or Title</label>
            <input disabled type="text" className="form-control" placeholder="Search book..." style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button disabled className="btn-submit" style={{ width: '100%', padding: '12px', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'not-allowed', marginTop: '10px', opacity: 0.6 }}>Confirm Issue</button>
        </div>

        <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Active Issues (Awaiting Return)</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Borrower</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Title</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Due Date</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}><i className="fas fa-spinner fa-spin"></i> Loading...</td></tr>
                ) : activeIssues?.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No active issues found.</td></tr>
                ) : activeIssues?.map((issue) => (
                  <tr key={issue._id}>
                    <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      {issue.userName}<br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {issue.studentId && issue.studentId !== 'N/A' ? issue.studentId : issue.userRole}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{issue.bookTitle}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                      <button 
                        onClick={() => handleReturn(issue._id)}
                        className="btn-return" 
                        style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--primary)' }}
                      >
                        Mark Returned
                      </button>
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

export default LibrarianIssue;
