import React from 'react';

const LibrarianRecords = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>All Library Transactions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Historical record of all issued and returned items.</p>
      </div>

      <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Transaction ID</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Borrower</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Book Title</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Issue Date</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Return Date</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}><strong>#TX-8842</strong></td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                Michael Chen<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S-2041</span>
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Clean Code</td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Oct 10, 2026</td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Oct 20, 2026</td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                <span className="status-badge status-returned" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#f3f4f6', color: 'var(--text-muted)' }}>Returned</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}><strong>#TX-8845</strong></td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                Sarah Williams<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S-1982</span>
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Physics Vol 1</td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Oct 15, 2026</td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>-</td>
              <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                <span className="status-badge status-issued" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dbeafe', color: '#1e40af' }}>Issued</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrarianRecords;
