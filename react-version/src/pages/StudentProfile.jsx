import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/profile/${user.email}`);
        const data = await response.json();
        if (response.ok) {
          setStudent(data);
        } else {
          toast.error(data.msg || "Profile not found.");
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchProfile();
  }, [user.email]);

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>Profile not found. Please contact administration.</h3>
        </div>
      </div>
    );
  }

  const initials = `${student.firstName[0]}${student.lastName[0]}`;

  return (
    <div className="dashboard-content">
      <div className="profile-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', maxWidth: '900px', overflow: 'hidden' }}>
        <div className="profile-header" style={{ background: '#1a1a1a', padding: '40px', color: '#fff', display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div className="profile-avatar-lg" style={{ width: '100px', height: '100px', borderRadius: '24px', background: '#fff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 800, border: '4px solid rgba(255,255,255,0.2)' }}>{initials}</div>
          <div className="profile-title">
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{student.firstName} {student.lastName}</h1>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>{student.program} • {student.studentId} • {student.status}</p>
          </div>
        </div>
        <div className="profile-body" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a' }}>Personal Information</h3>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Full Name</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{student.firstName} {student.lastName}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Student ID</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{student.studentId}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Email</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{student.email}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Phone</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{student.phone}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Date of Birth</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{new Date(student.dob).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a' }}>Academic Details</h3>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Admission Date</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{new Date(student.admissionDate).toLocaleDateString()}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Program</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{student.program}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Status</span>
              <span className="info-val" style={{ fontWeight: 600, color: '#166534' }}>{student.status}</span>
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
