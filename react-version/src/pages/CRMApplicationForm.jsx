import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const CRMApplicationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [app, setApp] = React.useState(state?.application);
  const [processing, setProcessing] = React.useState(false);

  if (!app) {
    return (
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>No Application Selected</h3>
          <button className="btn-primary" onClick={() => navigate('/crm/applications')}>Go Back</button>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${app.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved', statusClass: 'status-approved' })
      });
      const data = await response.json();
      if (data.success) {
        setApp({ ...app, status: 'Approved', statusClass: 'status-approved' });
        toast.success('Application marked as Approved!');
      }
    } catch (err) {
      toast.error("Failed to approve application.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${app.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', statusClass: 'status-ended' })
      });
      const data = await response.json();
      if (data.success) {
        setApp({ ...app, status: 'Rejected', statusClass: 'status-ended' });
        toast.success('Application Rejected.');
      }
    } catch (err) {
      toast.error("Failed to reject application.");
    } finally {
      setProcessing(false);
    }
  };

  const handleEnroll = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${app.id}/enroll`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setApp({ ...app, status: 'Enrolled', statusClass: 'status-approved' });
        toast.success(data.msg || `Student Enrolled! New ID: ${data.student.studentId}`, { duration: 6000 });
      } else {
        toast.error(data.msg || "Failed to enroll student.");
      }
    } catch (err) {
      toast.error("Failed to enroll student.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDocView = (path) => {
    if (!path) {
      toast.error("Document not found.");
      return;
    }
    const filename = path.split('\\').pop().split('/').pop();
    // Assuming uploads are served from backend URL base (one level up from /api)
    const backendBase = API_BASE_URL.replace('/api', '');
    window.open(`${backendBase}/uploads/${filename}`, '_blank');
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/crm/applications')} 
            className="btn-back" 
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', background: '#fff', cursor: 'pointer' }}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Review Application: {app.appId}</h1>
          <span className={`status-badge ${app.statusClass}`}>{app.status}</span>
        </div>
      </div>

      <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px' }}>
          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>Personal Details</h3>
          <div className="data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Full Name</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.name}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Date of Birth</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{new Date(app.dob).toLocaleDateString()}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Email</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.email}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Phone</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.phone}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Address</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.address}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Gender</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.gender}</span></div>
          </div>

          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>Academic Background & Program</h3>
          <div className="data-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Previous School</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.previousInstitution}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Graduation Year</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.passingYear}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>GPA / Percentage</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.marks}</span></div>
            <div className="data-item" style={{ marginBottom: '10px' }}><span className="data-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Applied Program</span><span className="data-val" style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{app.program}</span></div>
          </div>

          <h3 className="section-title" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>Uploaded Documents</h3>
          <div className="doc-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
            {app.idDocument && (
              <div className="doc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: '#f8fafc' }}>
                <div className="doc-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}><i className="fas fa-file-pdf" style={{ color: '#ef4444', fontSize: '16px' }}></i> National ID / Passport</div>
                <button onClick={() => handleDocView(app.idDocument)} className="btn-view" style={{ padding: '4px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View</button>
              </div>
            )}
            {app.transcriptDocument && (
              <div className="doc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: '#f8fafc' }}>
                <div className="doc-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 500 }}><i className="fas fa-file-pdf" style={{ color: '#ef4444', fontSize: '16px' }}></i> Academic Transcript</div>
                <button onClick={() => handleDocView(app.transcriptDocument)} className="btn-view" style={{ padding: '4px 10px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View</button>
              </div>
            )}
            {!app.idDocument && !app.transcriptDocument && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No documents uploaded.</p>}
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
              <option>Standard Fee Plan</option>
              <option>Scholarship Plan (20%)</option>
              <option>Scholarship Plan (50%)</option>
            </select>
          </div>

          <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {app.status === 'Submitted' && (
              <>
                <button 
                  className="btn btn-approve" 
                  onClick={handleApprove} 
                  disabled={processing}
                  style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: '#10b981', color: '#fff' }}
                >
                  {processing ? "..." : "Approve Application"}
                </button>
                <button 
                  className="btn btn-reject" 
                  onClick={handleReject}
                  disabled={processing}
                  style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: '#ef4444', color: '#fff' }}
                >
                  Reject Application
                </button>
              </>
            )}
            
            {app.status === 'Approved' && (
              <button 
                className="btn btn-enroll" 
                onClick={handleEnroll}
                disabled={processing}
                style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', border: 'none', background: 'var(--primary)', color: '#fff', marginTop: '10px' }}
              >
                {processing ? "..." : "Enroll Student (Create ERP Record)"}
              </button>
            )}

            {app.status === 'Enrolled' && (
              <div style={{ textAlign: 'center', padding: '10px', background: '#f0fdf4', border: '1px solid #10b981', borderRadius: '8px', color: '#166534', fontWeight: 600 }}>
                <i className="fas fa-check-circle"></i> Already Enrolled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMApplicationForm;
