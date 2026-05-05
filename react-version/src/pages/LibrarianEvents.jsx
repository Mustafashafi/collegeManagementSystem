import React from 'react';

const LibrarianEvents = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Library Events & Notices</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Stay updated with library news and maintenance schedules.</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.href='/librarian/events/add'} style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          <i className="fas fa-plus"></i> Post New Notice
        </button>
      </div>

      <div className="notice-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="notice-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px' }}>
          <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>29</span>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Oct</span>
          </div>
          <div className="notice-content" style={{ flex: 1 }}>
            <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', background: '#f3f4f6', color: 'var(--text-muted)' }}>Maintenance</span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Annual Stock Audit</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>The library will be partially closed for the annual stock audit. Book issuing will be suspended for 48 hours.</p>
          </div>
        </div>
        <div className="notice-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px' }}>
          <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>02</span>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Nov</span>
          </div>
          <div className="notice-content" style={{ flex: 1 }}>
            <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', background: '#f3f4f6', color: 'var(--text-muted)' }}>New Arrival</span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>New Scientific Journals Added</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Check out the latest editions of 'Nature' and 'Scientific American' now available in the periodicals section.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianEvents;
