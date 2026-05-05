import React from 'react';

const LibrarianAddEvent = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/librarian/events" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </a>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Post New Library Notice</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Notice Title</label>
          <input type="text" className="form-control" placeholder="e.g. Library Closure for Audit" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Category</label>
          <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
            <option>Maintenance</option>
            <option>New Arrival</option>
            <option>Holiday</option>
            <option>General Event</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Notice Date</label>
          <input type="date" className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Content / Description</label>
          <textarea className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', minHeight: '120px', outline: 'none', boxSizing: 'border-box' }} placeholder="Write the details of the notice..."></textarea>
        </div>
        <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-cancel" onClick={() => window.location.href='/librarian/events'} style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Cancel</button>
          <button className="btn-submit" style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>Publish Notice</button>
        </div>
      </div>
    </div>
  );
};

export default LibrarianAddEvent;
