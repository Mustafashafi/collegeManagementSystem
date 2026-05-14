import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        let result = await response.json();
        if (response.ok) {
          // Guard against non-array parts if API returns them
          if (!Array.isArray(result.schedule)) result.schedule = [];
          if (!Array.isArray(result.recentAssignments)) result.recentAssignments = [];
          if (!result.stats) result.stats = { totalStudents: 0, classesToday: 0, assignmentsToGrade: 0 };
          
          setData(result);
        } else {
          // If 403 or other error, set empty data to avoid crashing
          setData({ teacher: { name: user.name }, schedule: [], recentAssignments: [], stats: { totalStudents: 0, classesToday: 0, assignmentsToGrade: 0 } });
        }
      } catch (err) {
        console.error('Error fetching teacher dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchDashboardData();
  }, [user.email]);

  if (loading) {
    return (
      <TeacherLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
        </div>
      </TeacherLayout>
    );
  }

  const { teacher, schedule, recentAssignments, stats } = data || {};

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Faculty Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '4px' }}>
          Welcome back, {teacher?.name || 'Prof. Smith'}. Here is your overview for today.
        </p>
      </div>

      <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{stats?.totalStudents || 0}</h2>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Students Assigned</p>
        </div>
        <div className="stat-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{stats?.classesToday || 0}</h2>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classes Scheduled Today</p>
        </div>
        <div className="stat-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{stats?.assignmentsToGrade || 0}</h2>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assignments to Grade</p>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Schedule Panel */}
        <div className="panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Today's Teaching Schedule</h3>
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="schedule-list" style={{ padding: '0 24px' }}>
            {schedule && schedule.length > 0 ? schedule.map((item, idx) => (
              <div key={idx} className="schedule-item" style={{ display: 'flex', padding: '24px 0', borderBottom: idx === schedule.length - 1 ? 'none' : '1px solid #f1f5f9', alignItems: 'center' }}>
                <div className="time" style={{ width: '100px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>{item.time}</div>
                </div>
                <div className="details" style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{item.subject}</h4>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.program} (Room {item.room})</p>
                </div>
                <button onClick={() => navigate('/teacher/attendance')} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}>
                  Mark Attendance
                </button>
              </div>
            )) : (
              <p style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No classes scheduled for today.</p>
            )}
          </div>
        </div>

        {/* Assignments Panel */}
        <div className="panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Recent Assignments</h3>
            <button className="btn-sm" onClick={() => navigate('/teacher/assignments')} style={{ border: 'none', background: 'transparent', color: '#3b82f6', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>View All</button>
          </div>
          <div className="assignment-list" style={{ padding: '24px' }}>
            {recentAssignments && recentAssignments.length > 0 ? recentAssignments.map((asgn, idx) => (
              <div key={idx} className="assignment-item" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: idx === recentAssignments.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{asgn.title}</h4>
                  <span style={{ fontSize: '11px', color: asgn.status === 'Pending' ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                    {asgn.status}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>{asgn.subject} - Due: {new Date(asgn.dueDate).toLocaleDateString()}</p>
                {asgn.status === 'Submitted' && (
                  <button 
                    onClick={() => navigate('/teacher/view-submissions', { state: { title: asgn.title, subject: asgn.subject, teacherName: teacher.name } })} 
                    style={{ width: '100%', padding: '10px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Grade Now
                  </button>
                )}
              </div>
            )) : (
              <p style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No assignments created yet.</p>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
