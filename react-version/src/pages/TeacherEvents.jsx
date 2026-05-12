import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import TeacherLayout from '../components/TeacherLayout';

const TeacherEvents = () => {
  const { data: notices, isLoading } = useQuery({
    queryKey: ['teacherEvents'],
    queryFn: () => api.get('/api/events', { params: { audience: 'Teacher' } }).then(res => res.data),
  });

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
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Stay updated with the latest institutional announcements for faculty.</p>
      </div>
      
      {isLoading ? (
        <div style={{ padding: '50px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>
      ) : (
        <div className="notice-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notices && notices.length > 0 ? notices.map((notice) => (
            <div className="notice-card" key={notice._id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
              <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                <span className="day" style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{getDay(notice.date)}</span>
                <span className="month" style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>{getMonthName(notice.date)}</span>
              </div>
              
              <div className="notice-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', background: notice.tagBg || '#f3f4f6', color: notice.tagColor || '#111827' }}>
                    {notice.tag}
                  </span>
                  {notice.location && <span style={{ fontSize: '11px', color: '#9ca3af' }}><i className="fas fa-map-marker-alt"></i> {notice.location}</span>}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{notice.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{notice.description}</p>
                {notice.time && <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}><i className="fas fa-clock"></i> {notice.time}</div>}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', color: '#9ca3af' }}>
              <i className="fas fa-bell-slash" style={{ fontSize: '40px', marginBottom: '16px', display: 'block', opacity: 0.5 }}></i>
              No specific notices or events for teachers at the moment.
            </div>
          )}
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherEvents;
