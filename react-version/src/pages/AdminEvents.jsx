import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';

const AdminEvents = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: () => adminApi.getEvents().then(res => res.data),
  });

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Events & Activities</h1>
          <p>Plan and manage institutional events, workshops, and sports days.</p>
        </div>
        <Link to="/admin/add-event" className="btn-primary"><i className="fas fa-plus"></i> Create New Event</Link>
      </div>

      <div className="events-grid">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>
        ) : events?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>No events found.</div>
        ) : events?.map((event, idx) => (
          <div className="event-card" key={event._id || idx}>
            <div className="event-image"><i className={event.icon || 'fas fa-calendar-alt'}></i></div>
            <div className="event-details">
              <span className="event-tag">{event.tag || event.type || 'Event'}</span>
              <h3 className="event-title">{event.title}</h3>
              <div className="event-info"><i className="fas fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</div>
              <div className="event-info"><i className="fas fa-clock"></i> {event.time}</div>
              <div className="event-info"><i className="fas fa-map-marker-alt"></i> {event.location}</div>
            </div>
            <div className="event-footer">
              <span className="status-upcoming">Upcoming</span>
              <div className="action-btns">
                <button className="btn-icon"><i className="fas fa-edit"></i></button>
                <button className="btn-icon"><i className="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
