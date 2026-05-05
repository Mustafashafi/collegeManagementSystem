import React from 'react';

const LibrarianIssue = () => {
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
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Student / Teacher ID</label>
            <input type="text" className="form-control" placeholder="e.g. S-2041" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Book ISBN or Title</label>
            <input type="text" className="form-control" placeholder="Search book..." style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Return Due Date</label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button className="btn-submit" style={{ width: '100%', padding: '12px', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>Confirm Issue</button>
        </div>

        <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Issues (Awaiting Return)</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}><i className="fas fa-search"></i></div>
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
                <tr>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    Michael Chen<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S-2041</span>
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Clean Code</td>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Oct 30, 2026</td>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <button className="btn-return" style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Mark Returned</button>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                    Sarah Williams<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>S-1982</span>
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Physics Vol 1</td>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Oct 20, 2026</td>
                  <td style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                    <button className="btn-return" style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#ef4444' }}>Overdue</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianIssue;
