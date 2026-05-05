import React from 'react';
import { Link } from 'react-router-dom';

const AdminAddEvent = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/events" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Create New Event</h1>
      </div>

      <div className="form-card">
        <form className="form-grid">
          <div className="form-group full">
            <label>Event Title</label>
            <input type="text" className="form-control" placeholder="e.g. Annual Sports Day 2026" />
          </div>
          <div className="form-group">
            <label>Event Category</label>
            <select className="form-control">
              <option>Academic</option>
              <option>Sports</option>
              <option>Workshop / Seminar</option>
              <option>Cultural Event</option>
              <option>Holiday Notice</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location / Venue</label>
            <input type="text" className="form-control" placeholder="Main Auditorium" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="text" className="form-control" placeholder="09:00 AM - 05:00 PM" />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea className="form-control" style={{ minHeight: '100px' }} placeholder="Describe the event details..."></textarea>
          </div>
          <div className="form-group full">
            <label>Cover Image (URL)</label>
            <input type="text" className="form-control" placeholder="https://..." />
          </div>
        </form>
        <div className="form-footer">
          <Link to="/admin/events" className="btn-cancel">Cancel</Link>
          <button className="btn-submit" type="button">Publish Event</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddEvent;
