import React from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsData } from '../data/eventsData';

const PublicEvents = () => {
  const navigate = useNavigate();

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
          {eventsData.map((event, index) => (
            <div 
              key={event.id} 
              className="event-card" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              onClick={() => navigate(`/events/${event.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="event-img">
                <img src={event.image} alt={event.title} />
                <div className="event-date">
                  <span>{event.date}</span>
                  <small>{event.month}</small>
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

