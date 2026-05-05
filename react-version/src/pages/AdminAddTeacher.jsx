import React from 'react';
import { Link } from 'react-router-dom';

const AdminAddTeacher = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/teachers" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Add New Teacher</h1>
      </div>

      <div className="form-card">
        <form className="form-grid">
          <h4 className="section-subtitle">Professional Information</h4>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" placeholder="Dr. John Doe" />
          </div>
          <div className="form-group">
            <label>Teacher ID</label>
            <input type="text" className="form-control" placeholder="T-10XX" />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select className="form-control">
              <option>Computer Science</option>
              <option>Physics</option>
              <option>Mathematics</option>
              <option>English</option>
            </select>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <select className="form-control">
              <option>Professor</option>
              <option>Assistant Professor</option>
              <option>Lecturer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Qualification</label>
            <input type="text" className="form-control" placeholder="Ph.D, M.Tech" />
          </div>
          <div className="form-group">
            <label>Experience (Years)</label>
            <input type="number" className="form-control" placeholder="5" />
          </div>

          <h4 className="section-subtitle">Contact Details</h4>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="john.doe@example.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="form-control" placeholder="+1 ..." />
          </div>
          <div className="form-group">
            <label>Joining Date</label>
            <input type="date" className="form-control" />
          </div>
        </form>
        <div className="form-footer">
          <Link to="/admin/teachers" className="btn-cancel">Cancel</Link>
          <button className="btn-submit" type="button">Register Teacher</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddTeacher;
