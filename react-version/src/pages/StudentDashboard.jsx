import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Student Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Attendance Rate</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>94.5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Pending Assignments</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>3</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Current GPA</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>3.82</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Books Borrowed</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>2</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Assignments</h3>
            <Link to="/student/assignments" style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600 }}>View All</Link>
          </div>
          <div className="list-item" style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="list-info">
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Advanced Data Structures</h4>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Due in 2 days • Prof. Smith</p>
            </div>
            <span className="badge" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Action Required</span>
          </div>
          <div className="list-item" style={{ padding: '14px 20px', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="list-info">
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Network Security Quiz</h4>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Due in 4 days • Dr. Doe</p>
            </div>
            <span className="badge" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Upcoming</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Today's Classes</h3>
          </div>
          <div className="list-item" style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="list-info">
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>CS 302 - Algorithms</h4>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>09:00 AM - 10:30 AM • Room 102</p>
            </div>
          </div>
          <div className="list-item" style={{ padding: '14px 20px', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="list-info">
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>MAT 201 - Discrete Math</h4>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>11:00 AM - 12:30 PM • Room 204</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Fee Status Summary</h3>
          <Link to="/student/fees" style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600 }}>Full Record</Link>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Total Payable</p>
            <p style={{ fontSize: '18px', fontWeight: 700 }}>$1,200.00</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Due Date</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#b91c1c' }}>Nov 15, 2026</p>
          </div>
          <div style={{ flex: 1, padding: '15px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-exclamation-triangle" style={{ color: '#d97706' }}></i>
            <p style={{ fontSize: '13px', color: '#92400e' }}>You have a pending tuition fee of <strong>$1,200.00</strong> for Term 2. Please ensure payment is made by the due date.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
