import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const StudentEvents = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['studentEvents'],
    queryFn: () => api.get('/api/events', { params: { audience: 'Student' } }).then(res => res.data),
  });

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Upcoming Campus Events</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Stay updated with workshops, holidays, and student activities.</p>
      </div>

      <div className="events-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}><i className="fas fa-spinner fa-spin"></i> Loading events...</div>
        ) : events?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <i className="fas fa-calendar-times" style={{ fontSize: '48px', color: 'var(--border)', marginBottom: '16px', display: 'block' }}></i>
            <p style={{ color: 'var(--text-muted)' }}>No upcoming events scheduled for students at this time.</p>
          </div>
        ) : events?.map((event) => (
          <div key={event._id} className="event-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div className="event-img" style={{ height: '140px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'var(--primary)', opacity: 0.8 }}>
              <i className={`fas ${event.tag === 'ACADEMIC' ? 'fa-book-reader' : event.tag === 'HOLIDAY' ? 'fa-umbrella-beach' : 'fa-calendar-star'}`}></i>
            </div>
            <div className="event-details" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="event-tag" style={{ padding: '4px 10px', background: '#f3f4f6', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--text-main)' }}>{event.tag}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{event.audience === 'All' ? 'Everyone' : 'Students Only'}</span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)', lineHeight: 1.4 }}>{event.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
              <div className="event-meta" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fas fa-calendar" style={{ color: 'var(--primary)', width: '14px' }}></i> {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                {event.time && <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fas fa-clock" style={{ color: 'var(--primary)', width: '14px' }}></i> {event.time}</span>}
                {event.location && <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fas fa-map-marker-alt" style={{ color: '#ef4444', width: '14px' }}></i> {event.location}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEvents;
