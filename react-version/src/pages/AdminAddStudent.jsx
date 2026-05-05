import React from 'react';
import { Link } from 'react-router-dom';

const AdminAddStudent = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/students" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Add New Student</h1>
      </div>

      <div className="form-card">
        <form className="form-grid">
          <h4 className="section-subtitle">Personal Information</h4>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" placeholder="John" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" className="form-control" placeholder="Doe" />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" className="form-control" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select className="form-control">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="john.doe@example.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="form-control" placeholder="+1 234 567 890" />
          </div>

          <h4 className="section-subtitle">Academic Details</h4>
          <div className="form-group">
            <label>Student ID / Roll No</label>
            <input type="text" className="form-control" placeholder="S-2026-001" />
          </div>
          <div className="form-group">
            <label>Admission Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="form-group">
            <label>Course / Program</label>
            <select className="form-control">
              <option>B.Sc Computer Science</option>
              <option>B.A English</option>
              <option>B.B.A</option>
              <option>M.Sc Physics</option>
            </select>
          </div>
          <div className="form-group">
            <label>Academic Year / Level</label>
            <select className="form-control">
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
          <div className="form-group">
            <label>Section (Optional)</label>
            <input type="text" className="form-control" placeholder="A" />
          </div>

          <h4 className="section-subtitle">Emergency Contact</h4>
          <div className="form-group">
            <label>Guardian Name</label>
            <input type="text" className="form-control" placeholder="Full Name" />
          </div>
          <div className="form-group">
            <label>Relationship</label>
            <input type="text" className="form-control" placeholder="Father / Mother" />
          </div>
          <div className="form-group">
            <label>Emergency Phone</label>
            <input type="tel" className="form-control" placeholder="+1 ..." />
          </div>
        </form>
        <div className="form-footer">
          <Link to="/admin/students" className="btn-cancel">Cancel</Link>
          <button className="btn-submit" type="button">Register Student</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddStudent;
