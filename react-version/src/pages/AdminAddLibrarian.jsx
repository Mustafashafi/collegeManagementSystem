import React from 'react';
import { Link } from 'react-router-dom';

const AdminAddLibrarian = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/librarians" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Add New Librarian</h1>
      </div>

      <div className="form-card">
        <form className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" placeholder="Jane Cooper" />
          </div>
          <div className="form-group">
            <label>Staff ID</label>
            <input type="text" className="form-control" placeholder="LIB-2026-01" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="jane.c@college.edu" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="form-control" placeholder="+1 ..." />
          </div>
          <div className="form-group">
            <label>Assigned Shift</label>
            <select className="form-control">
              <option>Morning (08:00 AM - 02:00 PM)</option>
              <option>Evening (02:00 PM - 08:00 PM)</option>
              <option>Full Day</option>
            </select>
          </div>
          <div className="form-group">
            <label>Access Level</label>
            <select className="form-control">
              <option>Library Assistant</option>
              <option>Senior Librarian</option>
              <option>Head Librarian</option>
            </select>
          </div>
        </form>
        <div className="form-footer">
          <Link to="/admin/librarians" className="btn-cancel">Cancel</Link>
          <button className="btn-submit" type="button">Add Librarian</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddLibrarian;
