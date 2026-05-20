import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';

const PublicEvents = () => {
  const navigate = useNavigate();
  const { data: events, isLoading } = useQuery({
    queryKey: ['publicEvents'],
    queryFn: () => adminApi.getEvents().then(res => res.data),
  });

  const getEventImage = (event) => {
    if (event.image && event.image.trim() !== '') {
      return event.image;
    }
    const fallbacks = {
      ACADEMIC: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
      HOLIDAY: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      EVENT: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      NOTICE: 'https://images.unsplash.com/photo-1572945281864-7079c6d4907a?q=80&w=600&auto=format&fit=crop',
      LIBRARY: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop'
    };
    return fallbacks[event.tag] || fallbacks.EVENT;
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 data-aos="fade-up">Upcoming Events</h1>
          <p data-aos="fade-up" data-aos-delay="100">Stay updated with the latest happenings, workshops, and festivals at Skyra Institute.</p>
        </div>
      </section>

      <section className="container">
        <div className="events-grid">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>
          ) : events?.map((event, index) => (
            <div 
              key={event._id || index} 
              className="event-card" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              onClick={() => navigate(`/events/${event._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="event-img">
                <img src={getEventImage(event)} alt={event.title} />
                <div className="event-date">
                  <span>{new Date(event.date).getDate()}</span>
                  <small>{new Date(event.date).toLocaleString('default', { month: 'short' })}</small>
                </div>
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span><i className="fas fa-clock"></i> {event.time}</span>
                  <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                </div>
                <p>{event.description}</p>
                <div style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Read More <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PublicEvents;

