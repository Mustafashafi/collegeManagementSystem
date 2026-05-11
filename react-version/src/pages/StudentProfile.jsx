import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, attendanceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/students/profile/${user.email}`),
          fetch(`${API_BASE_URL}/api/students/attendance/${user.email}`)
        ]);

        const profileData = await profileRes.json();
        const attendanceData = await attendanceRes.json();

        if (profileRes.ok) setStudent(profileData);
        if (attendanceRes.ok) setAttendance(attendanceData);

      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchProfileData();
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
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  return (
    <div className="dashboard-content">
      <div className="profile-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', maxWidth: '900px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div className="profile-header" style={{ background: '#1a1a1a', padding: '40px', color: '#fff', display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
          <div className="profile-avatar-lg" style={{ width: '100px', height: '100px', borderRadius: '24px', background: '#fff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 800, border: '4px solid rgba(255,255,255,0.2)' }}>{initials}</div>
          <div className="profile-title">
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{student.firstName} {student.lastName}</h1>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>{student.program}</p>
            <div className="status-badge" style={{ marginTop: '12px', display: 'inline-block', padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{student.status}</div>
          </div>
          <div className="attendance-radial" style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: attendanceRate > 75 ? '#22c55e' : '#f59e0b' }}>{attendanceRate}%</div>
            <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Attendance</div>
          </div>
        </div>
        
        <div className="profile-body" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="info-section">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-user-circle" style={{ color: '#6366f1' }}></i> Personal Information
            </h3>
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
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-graduation-cap" style={{ color: '#10b981' }}></i> Academic Details
            </h3>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Admission Date</span>
              <span className="info-val" style={{ fontWeight: 600 }}>{new Date(student.admissionDate).toLocaleDateString()}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Current Year</span>
              <span className="info-val" style={{ fontWeight: 600, color: '#2563eb' }}>{student.year || '1st Year'}</span>
            </div>
            <div className="info-row" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span className="info-label" style={{ color: '#6b7280', fontWeight: 500 }}>Attendance Rate</span>
              <span className="info-val" style={{ fontWeight: 700, color: attendanceRate > 75 ? '#166534' : '#991b1b' }}>{attendanceRate}% ({presentClasses}/{totalClasses})</span>
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
