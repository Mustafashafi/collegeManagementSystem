import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminEvents = () => {
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: () => adminApi.getEvents().then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
      toast.success('Event deleted');
    },
    onError: () => toast.error('Failed to delete event')
  });

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Events & Activities</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Plan and manage institutional events, workshops, and sports days.</p>
        </div>
        <Link to="/admin/add-event" className="btn-primary" style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-plus"></i> Create New Event
        </Link>
      </div>

      <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>
        ) : events?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>No events found. Start by creating one!</div>
        ) : events?.map((event) => (
          <div className="event-card" key={event._id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="event-image" style={{ height: '140px', background: 'var(--primary-light, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--primary)', opacity: 0.7 }}>
              <i className={event.tag === 'HOLIDAY' ? 'fas fa-umbrella-beach' : event.tag === 'ACADEMIC' ? 'fas fa-book' : 'fas fa-calendar-alt'}></i>
            </div>
            <div className="event-details" style={{ padding: '24px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="event-tag" style={{ padding: '4px 10px', background: '#f3f4f6', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{event.tag}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>To: {event.audience}</span>
              </div>
              <h3 className="event-title" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{event.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>{event.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="event-info" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-calendar" style={{ color: 'var(--primary)' }}></i> {new Date(event.date).toLocaleDateString()}</div>
                {event.time && <div className="event-info" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-clock" style={{ color: 'var(--primary)' }}></i> {event.time}</div>}
                {event.location && <div className="event-info" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-map-marker-alt" style={{ color: '#ef4444' }}></i> {event.location}</div>}
              </div>
            </div>
            <div className="event-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status-upcoming" style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '20px' }}>Upcoming</span>
              <div className="action-btns" style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => { if(window.confirm('Delete this event?')) deleteMutation.mutate(event._id) }}
                  className="btn-icon" 
                  style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
