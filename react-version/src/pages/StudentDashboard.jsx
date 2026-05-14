import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, feesRes, attRes, asgnRes, resRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/students/profile/${user.email}`),
          fetch(`${API_BASE_URL}/api/students/fees/${user.email}`),
          fetch(`${API_BASE_URL}/api/students/attendance/${user.email}`),
          fetch(`${API_BASE_URL}/api/students/assignments/${user.email}`),
          fetch(`${API_BASE_URL}/api/students/results/${user.email}`)
        ]);

        const profileData = await profileRes.json();
        let feesData = await feesRes.json();
        let attData = await attRes.json();
        let asgnData = await asgnRes.json();
        let resData = await resRes.json();

        // Fallback to empty arrays if RBAC denied access (non-array response)
        if (!Array.isArray(feesData)) feesData = [];
        if (!Array.isArray(attData)) attData = [];
        if (!Array.isArray(asgnData)) asgnData = [];
        if (!Array.isArray(resData)) resData = [];

        const seenResults = new Set();
        const uniqueResults = [];
        resData.forEach(r => {
            const key = `${r.subject}-${r.examType}`;
            if (!seenResults.has(key)) {
                seenResults.add(key);
                uniqueResults.push(r);
            }
        });

        setProfile(profileData);
        setFees(feesData);
        setAttendance(attData);
        setAssignments(asgnData);
        setResults(uniqueResults);

        if (profileData && profileData.program) {
          const ttRes = await fetch(`${API_BASE_URL}/api/students/timetable/${profileData.program}`);
          const ttData = await ttRes.json();
          setTimetable(ttData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchData();
  }, [user.email]);

  const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayClasses = timetable.filter(t => t.day === currentDay);

  // Attendance Rate calculation
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : '0';

  // Pending Assignments calculation
  const pendingAssignmentsCount = assignments.filter(a => a.status === 'Pending' && new Date(a.dueDate).setHours(23, 59, 59, 999) >= new Date()).length;

  // GPA calculation (Only calculate if all enrolled subjects have grades)
  const uniqueEnrolledSubjects = new Set(timetable.map(t => t.subject)).size;
  const uniqueGradedSubjects = new Set(results.map(r => r.subject)).size;

  const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
  const totalPoints = results.reduce((acc, r) => acc + (gradePoints[r.grade] || 0), 0);

  const gpa = (uniqueEnrolledSubjects > 0 && uniqueGradedSubjects >= uniqueEnrolledSubjects)
    ? (totalPoints / results.length).toFixed(2)
    : 'Pending';

  const pendingFees = fees.filter(f => f.status === 'Pending');
  const totalPending = pendingFees.reduce((acc, f) => acc + f.amount, 0);
  const nextDueDate = pendingFees.length > 0 ? new Date(pendingFees[0].dueDate).toLocaleDateString() : 'N/A';

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Welcome, {profile ? `${profile.firstName} ${profile.lastName}` : (user.name || 'Student')}!</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Here is your academic overview for today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Attendance Rate</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>{attendanceRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Pending Assignments</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>{pendingAssignmentsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Current GPA</div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700 }}>{gpa}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Year & Program</div>
          <div className="stat-val" style={{ fontSize: '16px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile?.year || '1st Year'} • {profile?.program || 'Enrolled'}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Assignments</h3>
            <Link to="/student/assignments" style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600 }}>View All</Link>
          </div>
          {assignments.length === 0 ? (
            <p style={{ padding: '20px', color: '#6b7280', fontSize: '13px' }}>No assignments found.</p>
          ) : assignments.slice(0, 2).map((asgn, idx) => (
            <div key={idx} className="list-item" style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="list-info">
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{asgn.title}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Due: {new Date(asgn.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {asgn.teacher}</p>
              </div>
              <span className="badge" style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                background: asgn.status === 'Pending' 
                  ? (new Date(asgn.dueDate).setHours(23, 59, 59, 999) < new Date() ? '#fee2e2' : '#fff7ed') 
                  : '#dcfce7',
                color: asgn.status === 'Pending' 
                  ? (new Date(asgn.dueDate).setHours(23, 59, 59, 999) < new Date() ? '#b91c1c' : '#9a3412') 
                  : '#166534'
              }}>{asgn.status === 'Pending' && new Date(asgn.dueDate).setHours(23, 59, 59, 999) < new Date() ? 'LATE' : asgn.status}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Today's Classes</h3>
          </div>
          {todayClasses.length === 0 ? (
            <p style={{ padding: '20px', color: '#6b7280', fontSize: '13px' }}>No classes scheduled for today ({currentDay}).</p>
          ) : todayClasses.map((cls, idx) => (
            <div key={idx} className="list-item" style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="list-info">
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{cls.subject}</h4>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{cls.time} • {cls.room}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Fee Status Summary</h3>
          <Link to="/student/fees" style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600 }}>Full Record</Link>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Pending Amount</p>
            <p style={{ fontSize: '18px', fontWeight: 700 }}>${totalPending.toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Next Due Date</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: totalPending > 0 ? '#b91c1c' : '#166534' }}>{nextDueDate}</p>
          </div>
          <div style={{ flex: 1, padding: '15px', background: totalPending > 0 ? '#fffbeb' : '#f0fdf4', border: totalPending > 0 ? '1px solid #fde68a' : '1px solid #bcf0da', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className={`fas ${totalPending > 0 ? 'fa-exclamation-triangle' : 'fa-check-circle'}`} style={{ color: totalPending > 0 ? '#d97706' : '#166534' }}></i>
            <p style={{ fontSize: '13px', color: totalPending > 0 ? '#92400e' : '#166534' }}>
              {totalPending > 0
                ? `You have a pending tuition fee of $${totalPending.toLocaleString()}. Please ensure payment is made by the due date.`
                : `All your fees are currently up to date. Thank you!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
