import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { notificationsApi } from '../services/api';

const MainLayout = ({ sidebarProps, user: initialUser }) => {
  // Always get fresh user from localStorage on render
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.email && !user?.role) return;
    try {
      const res = await notificationsApi.getNotifications({
        email: user.email,
        role: user.role
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Polling every 8 seconds for notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 8000);

    return () => clearInterval(interval);
  }, [user?.email, user?.role]);

  // Mark notifications as read when navigating to their link
  useEffect(() => {
    if (notifications.length === 0) return;

    const unreadMatching = notifications.filter(n => 
      !n.isRead && n.link && (n.link === location.pathname || n.link.startsWith(location.pathname + '/'))
    );

    if (unreadMatching.length > 0) {
      const markAsRead = async () => {
        try {
          // Update local state immediately for snappy UI
          setNotifications(prev => prev.map(n => 
            unreadMatching.some(um => um._id === n._id) ? { ...n, isRead: true } : n
          ));
          
          // API calls in background
          await Promise.all(unreadMatching.map(n => notificationsApi.markRead(n._id)));
        } catch (err) {
          console.error('Failed to mark notifications as read on navigation', err);
        }
      };
      markAsRead();
    }
  }, [location.pathname, notifications]);

  return (
    <div className="main-layout">
      <Sidebar {...sidebarProps} notifications={notifications} />
      <main className="main-content">
        <Topbar user={user} notifications={notifications} setNotifications={setNotifications} />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
