import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { API_BASE_URL } from '../config/api';

const TeacherEvents = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events`);
        const data = await response.json();
        setNotices(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getMonthName = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDay = (dateStr) => {
    return new Date(dateStr).getDate().toString().padStart(2, '0');
  };

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Notices & Events</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Stay updated with the latest institutional announcements.</p>
      </div>
      
      {loading ? (
        <div style={{ padding: '50px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i></div>
      ) : (
        <div className="notice-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notices.length > 0 ? notices.map((notice, index) => (
            <div className="notice-card" key={index} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                <span className="day" style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{getDay(notice.date)}</span>
                <span className="month" style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>{getMonthName(notice.date)}</span>
              </div>
              
              <div className="notice-content" style={{ flex: 1 }}>
                <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', background: notice.tagBg, color: notice.tagColor }}>
                  {notice.tag}
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{notice.title}</h3>
                <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6 }}>{notice.description}</p>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>No notices or events at the moment.</div>
          )}
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherEvents;
