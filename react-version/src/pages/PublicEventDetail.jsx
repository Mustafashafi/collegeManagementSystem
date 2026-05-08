import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsData } from '../data/eventsData';

const PublicEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = eventsData.find(e => e.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!event) {
    return (
      <div className="container" style={{ padding: '10rem 2rem', textAlign: 'center' }}>
        <h2>Event Not Found</h2>
        <p>The event you are looking for does not exist.</p>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Events</Link>
      </div>
    );
  }

  return (
    <>
      <section 
        className="event-detail-hero" 
        style={{ backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container">
          <div className="badge" style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
            Upcoming Event
          </div>
          <h1 data-aos="fade-up">{event.title}</h1>
          <div className="event-meta" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }} data-aos="fade-up" data-aos-delay="100">
            <span><i className="fas fa-calendar-alt"></i> {event.date} {event.month}, 2026</span>
            <span><i className="fas fa-clock"></i> {event.time}</span>
            <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
          </div>
        </div>
      </section>

      <section className="container event-detail-container">
        <div className="event-detail-card">
          <div className="event-detail-content">
            <h2>About the Event</h2>
            <p>{event.fullDetails}</p>
            
            <div className="event-feature-grid">
              {event.features.map((feature, idx) => (
                <div key={idx} className="event-feature-item">
                  <div className="event-feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="event-feature-text">
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="event-sidebar">
            <div className="event-detail-sidebar-box">
              <h3>Registration</h3>
              <p>{event.registrationInfo}</p>
              
              <div className="event-price-tag">
                <div className="event-price-label">Ticket Price</div>
                <div className="event-price-value">{event.price}</div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>
                Register Now <i className="fas fa-arrow-right"></i>
              </button>
              
              <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Share this event</h4>
                <div className="social-links">
                  <a href="#" className="social-btn"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="social-btn"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="social-btn"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#" className="social-btn"><i className="fab fa-whatsapp"></i></a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button onClick={() => navigate('/events')} className="btn btn-outline" style={{ width: '100%' }}>
                <i className="fas fa-arrow-left"></i> Back to All Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

};

export default PublicEventDetail;

