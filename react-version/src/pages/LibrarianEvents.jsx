import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Link } from 'react-router-dom';

const LibrarianEvents = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['librarianEvents'],
    queryFn: () => api.get('/api/events', { params: { audience: 'Librarian' } }).then(res => res.data),
  });

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Library Events & Notices</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Stay updated with library news, maintenance, and staff schedules.</p>
        </div>
        <Link to="/librarian/events/add" className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
          <i className="fas fa-plus"></i> Post New Notice
        </Link>
      </div>

      <div className="notice-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading notices...</div>
        ) : events?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <i className="fas fa-bell-slash" style={{ fontSize: '40px', color: 'var(--border)', marginBottom: '12px', display: 'block' }}></i>
            No specific library notices or events at this time.
          </div>
        ) : events?.map((event) => {
          const date = new Date(event.date);
          return (
            <div key={event._id} className="notice-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px', transition: 'box-shadow 0.2s' }}>
              <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'var(--primary-light, #f1f5f9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{date.getDate()}</span>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{date.toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="notice-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: event.tagBg || '#f3f4f6', color: event.tagColor || 'var(--text-muted)' }}>{event.tag || 'Library'}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{event.audience === 'All' ? 'Everyone' : 'Librarians Only'}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>{event.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{event.description}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', gap: '16px' }}>
                  {event.time && <span><i className="fas fa-clock" style={{ color: 'var(--primary)' }}></i> {event.time}</span>}
                  {event.location && <span><i className="fas fa-map-marker-alt" style={{ color: '#ef4444' }}></i> {event.location}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibrarianEvents;
