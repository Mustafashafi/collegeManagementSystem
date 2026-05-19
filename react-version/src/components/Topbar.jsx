import React, { useState, useEffect, useRef } from 'react';
import { notificationsApi } from '../services/api';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const Topbar = ({ user, notifications = [], setNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead({ email: user.email, role: user.role });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationsApi.markRead(notification._id, user.email);
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
      }
      setIsOpen(false);
      if (notification.link) {
        window.location.href = notification.link;
      }
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Search bar removed as per user request */}
      </div>
      <div className="topbar-right" style={{ position: 'relative' }} ref={dropdownRef}>
        <button 
          className="icon-btn" 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ position: 'relative', cursor: 'pointer', border: 'none', background: 'none' }}
        >
          <i className="fas fa-bell" style={{ fontSize: '18px', color: 'var(--text-main)' }}></i>
          {unreadCount > 0 && (
            <span className="badge" style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="notification-dropdown" style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            width: '360px',
            maxHeight: '480px',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="dropdown-header" style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Notifications</h4>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead} 
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="dropdown-list" style={{ overflowY: 'auto', flex: 1 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <i className="far fa-bell-slash" style={{ fontSize: '24px', marginBottom: '8px', display: 'block', opacity: 0.5 }}></i>
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      background: n.isRead ? '#fff' : '#f8fafc',
                      transition: 'background 0.2s',
                      display: 'flex',
                      gap: '12px',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = n.isRead ? '#fff' : '#f8fafc'}
                  >
                    {!n.isRead && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '6px',
                        top: '18px'
                      }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: n.isRead ? 600 : 700, color: 'var(--text-main)' }}>
                          {n.title}
                        </h5>
                        <button 
                          onClick={(e) => handleDeleteNotification(e, n._id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            padding: '2px',
                            fontSize: '11px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="user-profile" style={{ marginLeft: '16px' }}>
          <div className="avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
            {user.profileImage ? (
              <img src={`${API_BASE_URL}${user.profileImage}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user.initials
            )}
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p style={{ textTransform: 'capitalize' }}>{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
