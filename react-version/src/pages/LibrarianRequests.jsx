import React from 'react';

const LibrarianRequests = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Student & Teacher Book Requests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Approve or reject reservations made through the portals.</p>
      </div>

      <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Request ID</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Borrower Details</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Title</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Request Date</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}><strong>#REQ-402</strong></td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                Michael Chen<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S-2041 (Student)</span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Database System Concepts</td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Oct 24, 2026</td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                <span className="status-badge status-pending" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fef9c3', color: '#854d0e' }}>Pending</span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                <div className="btn-group" style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm approve" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Approve</button>
                  <button className="btn-sm reject" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Reject</button>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}><strong>#REQ-398</strong></td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                Sarah Williams<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S-1982 (Student)</span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Modern Physics</td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Oct 22, 2026</td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                <span className="status-badge status-approved" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Approved</span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                <button className="btn-sm" style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Issue Book</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrarianRequests;
