import React from 'react';
import { Link } from 'react-router-dom';

const AdminAddClass = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/classes" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Create New Class / Section</h1>
      </div>

      <div className="form-card">
        <form className="form-grid">
          <div className="form-group">
            <label>Class Name</label>
            <input type="text" className="form-control" placeholder="e.g. B.Sc CS 2nd Year" />
          </div>
          <div className="form-group">
            <label>Section</label>
            <input type="text" className="form-control" placeholder="e.g. A" />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select className="form-control">
              <option>Computer Science</option>
              <option>Physics</option>
              <option>Business Administration</option>
            </select>
          </div>
          <div className="form-group">
            <label>Class Teacher</label>
            <select className="form-control">
              <option>Prof. Robert Smith</option>
              <option>Dr. Jane Doe</option>
              <option>Assoc. Prof. Wilson</option>
            </select>
          </div>
          <div className="form-group">
            <label>Room Number</label>
            <input type="text" className="form-control" placeholder="101" />
          </div>
          <div className="form-group">
            <label>Max Strength</label>
            <input type="number" className="form-control" placeholder="50" />
          </div>
        </form>
        <div className="form-footer">
          <Link to="/admin/classes" className="btn-cancel">Cancel</Link>
          <button className="btn-submit" type="button">Create Class</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddClass;
