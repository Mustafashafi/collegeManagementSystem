import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { notificationsApi } from '../services/api';

const TeacherLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const teacherName = user.name || 'Teacher';

  // ── Notification State ──────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      const res = await notificationsApi.getNotifications({ email: user.email, role: 'teacher' });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Teacher notifications error:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [user?.email]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead({ email: user.email, role: 'teacher' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const handleNotificationClick = async (n) => {
    try {
      if (!n.isRead) {
        await notificationsApi.markRead(n._id);
        setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, isRead: true } : x));
      }
      setIsOpen(false);
      if (n.link) window.location.href = n.link;
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getInitials = (name) => {
    if (!name) return 'TR';
    const names = name.split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(teacherName);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: '260px', background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header" style={{ height: '70px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '32px', height: '32px', background: '#1a1a1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>EduSystem</h2>
        </div>

        <div className="nav-menu" style={{ padding: '20px 0', flex: 1 }}>
          <div className="nav-section">
            <div className="nav-section-title" style={{ padding: '0 24px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Teacher Menu</div>
            <NavLink to="/teacher/dashboard" className="nav-item"><i className="fas fa-home"></i> Dashboard</NavLink>
            <NavLink to="/teacher/timetable" className="nav-item"><i className="fas fa-calendar-alt"></i> Timetable</NavLink>
            <NavLink to="/teacher/classes" className="nav-item"><i className="fas fa-chalkboard"></i> My Classes</NavLink>
            <NavLink to="/teacher/attendance" className="nav-item"><i className="fas fa-clipboard-user"></i> Attendance</NavLink>
            <NavLink to="/teacher/assignments" className="nav-item"><i className="fas fa-tasks"></i> Assignments</NavLink>
            <NavLink to="/teacher/results" className="nav-item"><i className="fas fa-poll"></i> Results / Grades</NavLink>
            <NavLink to="/teacher/events" className="nav-item"><i className="fas fa-bell"></i> Notices & Events</NavLink>
            <NavLink to="/login" className="nav-item" style={{ marginTop: '20px' }}><i className="fas fa-sign-out-alt"></i> Logout</NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header className="topbar" style={{ height: '70px', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 30px' }}>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }} ref={dropdownRef}>

            {/* ── Bell Icon ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ position: 'relative', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <i className="fas fa-bell" style={{ fontSize: '18px', color: '#374151' }}></i>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#ef4444', color: '#fff', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* ── Dropdown ── */}
            {isOpen && (
              <div style={{
                position: 'absolute', top: '46px', right: '0',
                width: '360px', maxHeight: '480px',
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                zIndex: 1000, overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
              }}>
                {/* Header */}
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid #f1f5f9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f8fafc'
                }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{
                      border: 'none', background: 'none', color: '#6366f1',
                      fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0
                    }}>
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* List */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '30px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                      <i className="far fa-bell-slash" style={{ fontSize: '24px', marginBottom: '8px', display: 'block', opacity: 0.5 }}></i>
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        style={{
                          padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer', background: n.isRead ? '#fff' : '#f0f9ff',
                          display: 'flex', gap: '12px', position: 'relative',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = n.isRead ? '#fff' : '#f0f9ff'}
                      >
                        {!n.isRead && (
                          <span style={{
                            width: '7px', height: '7px', background: '#6366f1',
                            borderRadius: '50%', position: 'absolute', left: '6px', top: '18px',
                            flexShrink: 0
                          }} />
                        )}
                        <div style={{ flex: 1, paddingLeft: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h5 style={{ margin: '0 0 3px 0', fontSize: '13px', fontWeight: n.isRead ? 600 : 700, color: '#111827' }}>
                              {n.title}
                            </h5>
                            <button
                              onClick={e => handleDelete(e, n._id)}
                              style={{ border: 'none', background: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '11px', padding: '2px' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                              onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>{n.message}</p>
                          <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '5px', display: 'block' }}>
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── Avatar ── */}
            <div style={{ width: '36px', height: '36px', background: '#1a1a1a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
              {initials}
            </div>
            <div className="user-info">
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{teacherName}</h4>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>Teacher</p>
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
