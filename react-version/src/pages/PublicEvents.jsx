import React from 'react';

const PublicEvents = () => {
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
          {/* Event 1 */}
          <div className="event-card" data-aos="fade-up">
            <div className="event-img">
              <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop" alt="Tech Fest" />

              <div className="event-date">
                <span>15</span>
                <small>May</small>
              </div>
            </div>
            <div className="event-content">
              <h3>Annual Tech Fest 2026</h3>
              <div className="event-meta">
                <span><i className="fas fa-clock"></i> 09:00 AM</span>
                <span><i className="fas fa-map-marker-alt"></i> Main Auditorium</span>
              </div>
              <p>Join us for three days of innovation, hackathons, and guest lectures from industry giants like Google and Meta.</p>
            </div>
          </div>

          {/* Event 2 */}
          <div className="event-card" data-aos="fade-up" data-aos-delay="100">
            <div className="event-img">
              <img src="https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?q=80&w=1470&auto=format&fit=crop" alt="Graduation" />


              <div className="event-date">
                <span>22</span>
                <small>June</small>
              </div>
            </div>
            <div className="event-content">
              <h3>Convocation Ceremony</h3>
              <div className="event-meta">
                <span><i className="fas fa-clock"></i> 10:30 AM</span>
                <span><i className="fas fa-map-marker-alt"></i> Convocation Hall</span>
              </div>
              <p>Celebrating the achievements of our graduating class of 2026. A milestone journey comes to a grand celebration.</p>
            </div>
          </div>

          {/* Event 3 */}
          <div className="event-card" data-aos="fade-up" data-aos-delay="200">
            <div className="event-img">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop" alt="Workshop" />


              <div className="event-date">
                <span>05</span>
                <small>July</small>
              </div>
            </div>
            <div className="event-content">
              <h3>AI & Ethics Workshop</h3>
              <div className="event-meta">
                <span><i className="fas fa-clock"></i> 02:00 PM</span>
                <span><i className="fas fa-map-marker-alt"></i> Tech Hub Lab 4</span>
              </div>
              <p>Explore the future of Artificial Intelligence and its ethical implications in this hands-on workshop for all students.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicEvents;
