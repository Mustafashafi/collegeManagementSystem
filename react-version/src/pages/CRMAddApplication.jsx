import React from 'react';

const CRMAddApplication = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/crm/applications" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </a>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Manual Application Entry (Admission Form)</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '900px' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Personal Details</h4>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Applicant Full Name</label>
            <input type="text" className="form-control" placeholder="e.g. Emily Smith" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Date of Birth</label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Gender</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Email Address</label>
            <input type="email" className="form-control" placeholder="emily@example.com" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Complete Address</label>
            <input type="text" className="form-control" placeholder="123 Main St, City, Country" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Parent / Guardian Details</h4>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Guardian Name</label>
            <input type="text" className="form-control" placeholder="John Smith" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Guardian Phone</label>
            <input type="tel" className="form-control" placeholder="+1 234 567 8900" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Academic Details & Program Selection</h4>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Previous School / Institution</label>
            <input type="text" className="form-control" placeholder="Lincoln High School" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>High School Passing Year & Marks</label>
            <input type="text" className="form-control" placeholder="2023 - 85%" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Applying For (Program)</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option>Select Program...</option>
              <option>B.Sc Computer Science</option>
              <option>Business Administration</option>
              <option>Engineering (Mechanical)</option>
            </select>
          </div>

          <h4 className="section-subtitle" style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, margin: '10px 0', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', color: 'var(--primary)' }}>Document Uploads</h4>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>ID Card / Passport</label>
            <div className="file-upload" style={{ border: '2px dashed var(--border)', padding: '20px', textAlign: 'center', borderRadius: '8px', background: '#f8fafc', cursor: 'pointer' }}>
              <i className="fas fa-id-card" style={{ fontSize: '24px', color: 'var(--text-muted)', marginBottom: '10px' }}></i>
              <p>Click to upload ID</p>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Academic Transcripts</label>
            <div className="file-upload" style={{ border: '2px dashed var(--border)', padding: '20px', textAlign: 'center', borderRadius: '8px', background: '#f8fafc', cursor: 'pointer' }}>
              <i className="fas fa-file-alt" style={{ fontSize: '24px', color: 'var(--text-muted)', marginBottom: '10px' }}></i>
              <p>Click to upload certificates</p>
            </div>
          </div>
        </div>
        <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-cancel" onClick={() => window.location.href='/crm/applications'} style={{ padding: '12px 24px', background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>Cancel</button>
          <button className="btn-submit" style={{ padding: '12px 24px', background: 'var(--primary)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>Submit Application</button>
        </div>
      </div>
    </div>
  );
};

export default CRMAddApplication;
