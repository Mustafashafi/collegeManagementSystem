import React from 'react';

const CRMAddCampaign = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/crm/marketing" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </a>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Create New Campaign</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Campaign Name</label>
            <input type="text" className="form-control" placeholder="e.g. Fall Intake 2026 Promo" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Target Audience / Program</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>All Programs</option>
              <option>B.Sc Computer Science</option>
              <option>Business Administration</option>
              <option>Engineering</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Source / Platform</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>Facebook Ads</option>
              <option>Google Search</option>
              <option>Email Marketing</option>
              <option>Print Media</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Start Date</label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>End Date</label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Allocated Budget ($)</label>
            <input type="number" className="form-control" placeholder="0.00" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Campaign Status</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>Draft</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
          </div>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Description / Notes</label>
            <textarea className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', minHeight: '100px', outline: 'none', boxSizing: 'border-box' }} placeholder="Add campaign details..."></textarea>
          </div>
        </div>
        <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-cancel" onClick={() => window.location.href='/crm/marketing'} style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Cancel</button>
          <button className="btn-submit" style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>Save Campaign</button>
        </div>
      </div>
    </div>
  );
};

export default CRMAddCampaign;
