import React from 'react';

const StudentEvents = () => {
  const events = [
    { title: "Modern Web Dev Hackathon", tag: "Workshop", date: "Oct 30, 2026", location: "Innovation Lab, Block A", icon: "fa-code" },
    { title: "Annual Music Festival", tag: "Cultural", date: "Nov 05, 2026", location: "Main Auditorium", icon: "fa-music" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Upcoming Campus Events</h1>
      </div>

      <div className="events-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {events.map((event, idx) => (
          <div key={idx} className="event-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', transition: '0.2s' }}>
            <div className="event-img" style={{ height: '160px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: '#6b7280' }}>
              <i className={`fas ${event.icon}`}></i>
            </div>
            <div className="event-details" style={{ padding: '20px' }}>
              <span className="event-tag" style={{ display: 'inline-block', padding: '4px 8px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '10px', fontWeight: 700, marginBottom: '10px' }}>{event.tag}</span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{event.title}</h3>
              <div className="event-meta" style={{ fontSize: '12px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-calendar"></i> {event.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fas fa-map-marker-alt"></i> {event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEvents;
