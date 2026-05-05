import React from 'react';

const CRMApplicationForm = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/crm/applications" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i>
          </a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Review Application: APP-2026-001</h1>
        </div>
      </div>

      <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px' }}>
          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>Personal Details</h3>
          <div className="data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Full Name</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>Emily Smith</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Date of Birth</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>15 Aug 2005</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Email</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>emily.s@email.com</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Phone</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>+1 987 654 3210</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Address</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>123 Main St, New York, NY</span></div>
          </div>

          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>Academic Background & Program</h3>
          <div className="data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Previous School</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>Lincoln High School</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Graduation Year</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>2023</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>GPA / Percentage</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>3.8 / 92%</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Applied Program</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>B.Sc Computer Science</span></div>
          </div>

          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>Uploaded Documents</h3>
          <div className="doc-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
            <div className="doc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: '#f8fafc' }}>
              <div className="doc-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}><i className="fas fa-file-pdf" style={{ color: '#ef4444', fontSize: '16px' }}></i> High School Transcript.pdf</div>
              <button className="btn-view" style={{ padding: '4px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View</button>
            </div>
            <div className="doc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: '#f8fafc' }}>
              <div className="doc-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}><i className="fas fa-file-image" style={{ color: '#3b82f6', fontSize: '16px' }}></i> ID_Card_Front.jpg</div>
              <button className="btn-view" style={{ padding: '4px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View</button>
            </div>
            <div className="doc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: '#f8fafc' }}>
              <div className="doc-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}><i className="fas fa-file-image" style={{ color: '#3b82f6', fontSize: '16px' }}></i> Passport_Photo.jpg</div>
              <button className="btn-view" style={{ padding: '4px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View</button>
            </div>
          </div>
        </div>

        <div className="review-panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', color: 'var(--primary)' }}>Review & Verification</h3>
          
          <div className="checklist" style={{ marginBottom: '20px' }}>
            <label className="check-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px' }}><input type="checkbox" style={{ width: '16px', height: '16px' }} /> Documents Verified</label>
            <label className="check-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px' }}><input type="checkbox" style={{ width: '16px', height: '16px' }} /> Academic Eligibility Met</label>
            <label className="check-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px' }}><input type="checkbox" style={{ width: '16px', height: '16px' }} /> Identity Verified</label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Fee Plan Assignment</label>
            <select style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' }}>
              <option>Standard B.Sc Fee Plan</option>
              <option>Scholarship Plan (20%)</option>
            </select>
          </div>

          <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-approve" onClick={() => document.getElementById('enrollBtn').style.display='block'} style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: '#10b981', color: '#fff' }}>Approve Application</button>
            <button className="btn btn-request" style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: '#f59e0b', color: '#fff' }}>Request Changes</button>
            <button className="btn btn-reject" style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: '#ef4444', color: '#fff' }}>Reject Application</button>
            
            <button id="enrollBtn" className="btn btn-enroll" onClick={() => alert('Student record created in ERP. ID generated: S-2026-045')} style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: 'var(--primary)', color: '#fff', marginTop: '20px', display: 'none' }}>Enroll Student (Send to ERP)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMApplicationForm;
