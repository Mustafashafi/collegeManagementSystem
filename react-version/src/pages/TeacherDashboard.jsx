import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Faculty Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '4px' }}>Welcome back, Prof. Smith. Here is your overview for today.</p>
      </div>

      <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>120</h2>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Students Assigned</p>
        </div>
        <div className="stat-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>04</h2>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classes Scheduled Today</p>
        </div>
        <div className="stat-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>15</h2>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assignments to Grade</p>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Schedule Panel */}
        <div className="panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Today's Teaching Schedule</h3>
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>Oct 24, 2026</span>
          </div>
          <div className="schedule-list" style={{ padding: '0 24px' }}>
            <div className="schedule-item" style={{ display: 'flex', padding: '24px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div className="time" style={{ width: '100px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>09:00 AM</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>10:30 AM</div>
              </div>
              <div className="details" style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Data Structures & Algorithms</h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>B.Sc CS - 2nd Year (Room 101)</p>
              </div>
              <button style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}>
                Mark Attendance
              </button>
            </div>
            <div className="schedule-item" style={{ display: 'flex', padding: '24px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div className="time" style={{ width: '100px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>11:00 AM</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>12:30 PM</div>
              </div>
              <div className="details" style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Database Management</h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>B.Sc CS - 3rd Year (Lab 2)</p>
              </div>
              <button style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}>
                Mark Attendance
              </button>
            </div>
            <div className="schedule-item" style={{ display: 'flex', padding: '24px 0', alignItems: 'center' }}>
              <div className="time" style={{ width: '100px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>02:00 PM</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>03:30 PM</div>
              </div>
              <div className="details" style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Software Engineering</h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>B.Sc CS - 4th Year (Room 205)</p>
              </div>
              <button style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}>
                Mark Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Assignments Panel */}
        <div className="panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Recent Assignments</h3>
            <button className="btn-sm" onClick={() => navigate('/teacher/assignments')} style={{ border: 'none', background: 'transparent', color: '#3b82f6', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>View All</button>
          </div>
          <div className="assignment-list" style={{ padding: '24px' }}>
            <div className="assignment-item" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Binary Trees Project</h4>
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700 }}>Due in 2 days</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Data Structures - B.Sc 2nd Year</p>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>30/45 Students Submitted</div>
            </div>
            <div className="assignment-item" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>SQL Query Assignment</h4>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Completed</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Database Mgmt - B.Sc 3rd Year</p>
              <button style={{ width: '100%', padding: '10px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Grade Now (15 left)
              </button>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
