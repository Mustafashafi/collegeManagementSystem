import React from 'react';

const LibrarianDashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Library Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage inventory, track issues, and review requests.</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }} onClick={() => window.location.href='/librarian/books/add'}>
          <i className="fas fa-plus"></i> Add New Book
        </button>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Books</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>12,450</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>In library inventory</div>
          <i className="fas fa-book" style={{ fontSize: '20px', color: 'var(--primary)', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Currently Issued</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>842</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Books currently out</div>
          <i className="fas fa-hand-holding" style={{ fontSize: '20px', color: 'var(--primary)', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Requests</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>24</div>
          <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Awaiting approval</div>
          <i className="fas fa-clipboard-list" style={{ fontSize: '20px', color: 'var(--primary)', position: 'absolute', top: '20px', right: '20px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue</span>
          </div>
          <div className="stat-val" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', color: '#ef4444' }}>15</div>
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
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Book Title & ISBN</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Requested By</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Date</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <strong>Introduction to Algorithms</strong><br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ISBN: 978-0262033848</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    Michael Chen<br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Student ID: S-2041</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Oct 24, 2026</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span className="status-badge status-pending" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fef9c3', color: '#854d0e' }}>Pending</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <div className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-outline approve" style={{ padding: '6px 12px', background: '#fff', border: '1px solid #166534', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#166534' }}>Approve</button>
                      <button className="btn-outline reject" style={{ padding: '6px 12px', background: '#fff', border: '1px solid #b91c1c', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#b91c1c' }}>Reject</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <strong>Clean Code</strong><br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ISBN: 978-0132350884</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    Prof. Robert Smith<br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Teacher</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Oct 23, 2026</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span className="status-badge status-issued" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dbeafe', color: '#1e40af' }}>Issued</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <button className="btn-outline" style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: 'var(--text-main)' }}>Return Book</button>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                    <strong>Physics for Scientists</strong><br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ISBN: 978-1133947271</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                    Sarah Williams<br />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Student ID: S-1982</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>Oct 10, 2026</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                    <span className="status-badge status-overdue" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>Overdue</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: 'none' }}>
                    <button className="btn-outline" style={{ padding: '6px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: 'var(--text-main)' }}>Send Reminder</button>
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

export default LibrarianDashboard;
