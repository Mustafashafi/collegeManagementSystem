import React from 'react';
import TeacherLayout from '../components/TeacherLayout';

const TeacherEvents = () => {
  const notices = [
    {
      date: '28',
      month: 'OCT',
      tag: 'ACADEMIC',
      tagBg: '#e0f2fe',
      tagColor: '#0369a1',
      title: 'End Semester Examination Schedule',
      desc: 'The final examination schedule for the Fall 2026 semester has been released. Please review the invigilation duties assigned to your department.'
    },
    {
      date: '31',
      month: 'OCT',
      tag: 'HOLIDAY',
      tagBg: '#fee2e2',
      tagColor: '#b91c1c',
      title: 'Halloween Break',
      desc: 'The college will remain closed on October 31st. All classes are suspended for the day. Normal operations will resume on November 1st.'
    },
    {
      date: '05',
      month: 'NOV',
      tag: 'EVENT',
      tagBg: '#fef3c7',
      tagColor: '#854d0e',
      title: 'Annual Tech Symposium 2026',
      desc: 'Registration is now open for the annual technology symposium. Faculty members are encouraged to mentor student projects and register for workshops.'
    }
  ];

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Notices & Events</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Stay updated with the latest institutional announcements.</p>
      </div>
      
      <div className="notice-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notices.map((notice, index) => (
          <div className="notice-card" key={index} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #f1f5f9' }}>
              <span className="day" style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{notice.date}</span>
              <span className="month" style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>{notice.month}</span>
            </div>
            
            <div className="notice-content" style={{ flex: 1 }}>
              <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', background: notice.tagBg, color: notice.tagColor }}>
                {notice.tag}
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{notice.title}</h3>
              <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6 }}>{notice.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </TeacherLayout>
  );
};

export default TeacherEvents;
