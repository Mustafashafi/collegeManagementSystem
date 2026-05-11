import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';
import TeacherLayout from '../components/TeacherLayout';

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        const dashboardData = await dashboardRes.json();
        setProfile(dashboardData.teacher);
        setTimetable(dashboardData.fullSchedule || []);
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
      <TeacherLayout>
        <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Weekly Teaching Timetable</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Prof. {profile?.name || 'N/A'}</p>
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
                      <p style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, marginTop: '2px' }}>{item.program}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </TeacherLayout>
  );
};

export default TeacherTimetable;
