import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Link } from 'react-router-dom';

const LibrarianEvents = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => adminApi.getEvents().then(res => res.data),
  });

  // Filter library related events if categories exist
  const libraryEvents = events?.filter(e => e.category?.toLowerCase() === 'library' || e.title?.toLowerCase().includes('library')) || events;

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Library Events & Notices</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Stay updated with library news and maintenance schedules.</p>
        </div>
        <Link to="/librarian/events/add" className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
          <i className="fas fa-plus"></i> Post New Notice
        </Link>
      </div>

      <div className="notice-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading notices...</div>
        ) : libraryEvents?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>No library notices at this time.</div>
        ) : libraryEvents?.map((event) => {
          const date = new Date(event.date);
          return (
            <div key={event._id} className="notice-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px' }}>
              <div className="date-box" style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{date.getDate()}</span>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{date.toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="notice-content" style={{ flex: 1 }}>
                <span className="notice-tag" style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', background: '#f3f4f6', color: 'var(--text-muted)' }}>{event.category || 'Library'}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{event.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{event.description}</p>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
                  <i className="fas fa-clock"></i> {event.time || 'All Day'} | <i className="fas fa-map-marker-alt"></i> {event.location || 'Central Library'}
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
