import React from 'react';
import { Link } from 'react-router-dom';

const AdminEvents = () => {
  const events = [
    {
      title: "Annual Athletics Meet",
      tag: "Sports",
      date: "Oct 30, 2026",
      time: "09:00 AM - 05:00 PM",
      location: "Main Stadium",
      status: "Upcoming",
      icon: "fas fa-trophy"
    },
    {
      title: "AI & Ethics Seminar",
      tag: "Workshop",
      date: "Nov 05, 2026",
      time: "10:30 AM - 01:00 PM",
      location: "Conference Hall B",
      status: "Upcoming",
      icon: "fas fa-laptop-code"
    }
  ];

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
        {events.map((event, idx) => (
          <div className="event-card" key={idx}>
            <div className="event-image"><i className={event.icon}></i></div>
            <div className="event-details">
              <span className="event-tag">{event.tag}</span>
              <h3 className="event-title">{event.title}</h3>
              <div className="event-info"><i className="fas fa-calendar"></i> {event.date}</div>
              <div className="event-info"><i className="fas fa-clock"></i> {event.time}</div>
              <div className="event-info"><i className="fas fa-map-marker-alt"></i> {event.location}</div>
            </div>
            <div className="event-footer">
              <span className="status-upcoming">{event.status}</span>
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
