import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';
import { authApi } from '../services/api';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canView, setCanView] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check Permissions
        const permRes = await authApi.getPermissions('student');
        if (permRes.data.success) {
          const timetablePerm = permRes.data.permissions.find(p => p.name === 'View Timetable');
          if (timetablePerm && !timetablePerm.enabled) {
            setCanView(false);
            setLoading(false);
            return;
          }
        }

        const profileRes = await fetch(`${API_BASE_URL}/api/students/profile/${user.email}`);
        const profileData = await profileRes.json();
        setProfile(profileData);

        if (profileData && profileData.program) {
          const timetableRes = await fetch(`${API_BASE_URL}/api/students/timetable/${encodeURIComponent(profileData.program)}?year=${encodeURIComponent(profileData.year || '')}`);
          const timetableData = await timetableRes.json();
          setTimetable(timetableData);
        }
      } catch (err) {
        console.error('Error fetching timetable:', err);
        toast.error("Failed to load timetable.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchData();
  }, [user.email]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="dashboard-content" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '60px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <i className="fas fa-lock" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '20px' }}></i>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Access Restricted</h2>
          <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
            The Timetable feature has been temporarily disabled by the administration. 
            Please check back later or contact the academic office for information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Weekly Academic Timetable</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Program: {profile?.program || 'N/A'}</p>
        </div>
      </div>

      <div className="timetable-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {days.map(day => {
          const dayClasses = timetable.filter(t => t.day === day);
          return (
            <div key={day} className="day-panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              <div className="day-header" style={{ background: '#f8fafc', padding: '12px 20px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: '14px' }}>
                {day}
              </div>
              <div className="day-body" style={{ padding: '10px' }}>
                {dayClasses.length === 0 ? (
                  <p style={{ padding: '10px', color: '#6b7280', fontSize: '12px', textAlign: 'center' }}>No classes scheduled.</p>
                ) : dayClasses.map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', borderBottom: idx !== dayClasses.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{item.subject}</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.time} • {item.room}</p>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{item.teacher}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentTimetable;
