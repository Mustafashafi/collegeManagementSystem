import React from 'react';
import { NavLink } from 'react-router-dom';

const TeacherLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const teacherName = user.name || 'Teacher';
  
  const getInitials = (name) => {
    if (!name) return 'TR';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(teacherName);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: '260px', background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '32px', height: '32px', background: '#1a1a1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>EduSystem</h2>
        </div>
        
        <div className="nav-menu" style={{ padding: '20px 0', flex: 1 }}>
          <div className="nav-section">
            <div className="nav-section-title" style={{ padding: '0 24px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Teacher Menu</div>
            <NavLink to="/teacher/dashboard" className="nav-item">
              <i className="fas fa-home"></i> Dashboard
            </NavLink>
            <NavLink to="/teacher/timetable" className="nav-item">
              <i className="fas fa-calendar-alt"></i> Timetable
            </NavLink>
            <NavLink to="/teacher/classes" className="nav-item">
              <i className="fas fa-chalkboard"></i> My Classes
            </NavLink>
            <NavLink to="/teacher/attendance" className="nav-item">
              <i className="fas fa-clipboard-user"></i> Attendance
            </NavLink>
            <NavLink to="/teacher/assignments" className="nav-item">
              <i className="fas fa-tasks"></i> Assignments
            </NavLink>
            <NavLink to="/teacher/results" className="nav-item">
              <i className="fas fa-poll"></i> Results / Grades
            </NavLink>
            <NavLink to="/teacher/events" className="nav-item">
              <i className="fas fa-bell"></i> Notices & Events
            </NavLink>
            <NavLink to="/login" className="nav-item" style={{ marginTop: '20px' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header className="topbar" style={{ height: '70px', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 30px' }}>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#1a1a1a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
              {initials}
            </div>
            <div className="user-info">
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{teacherName}</h4>
            </div>
          </div>
        </header>

        <div className="dashboard-content" style={{ padding: '40px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
