import React from 'react';

const StudentProfile = () => {
  return (
    <div className="dashboard-content">
      <div className="profile-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', maxWidth: '900px', overflow: 'hidden' }}>
        <div className="profile-header" style={{ background: '#1a1a1a', padding: '40px', color: '#fff', display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div className="profile-avatar-lg" style={{ width: '100px', height: '100px', borderRadius: '24px', background: '#fff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 800, border: '4px solid rgba(255,255,255,0.2)' }}>MC</div>
          <div className="profile-title">
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Michael Chen</h1>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>B.Sc Computer Science • 2nd Year • Section A</p>
          </div>
        </div>
        <div className="profile-body" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a' }}>Personal Information</h3>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Full Name</span>
              <span className="info-val" style={{ fontWeight: 600 }}>Michael Chen</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Student ID</span>
              <span className="info-val" style={{ fontWeight: 600 }}>S-2024-001</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Email</span>
              <span className="info-val" style={{ fontWeight: 600 }}>michael.chen@edu.com</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Phone</span>
              <span className="info-val" style={{ fontWeight: 600 }}>+1 234 567 890</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Date of Birth</span>
              <span className="info-val" style={{ fontWeight: 600 }}>May 12, 2005</span>
            </div>
          </div>
          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a' }}>Academic Details</h3>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Enrollment Year</span>
              <span className="info-val" style={{ fontWeight: 600 }}>2024</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Current Term</span>
              <span className="info-val" style={{ fontWeight: 600 }}>Semester 3</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Academic Mentor</span>
              <span className="info-val" style={{ fontWeight: 600 }}>Prof. Sarah Parker</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Campus</span>
              <span className="info-val" style={{ fontWeight: 600 }}>Main Campus, Block C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
