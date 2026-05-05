import React from 'react';
import { Link } from 'react-router-dom';

const AdminLibrarians = () => {
  const librarians = [
    {
      name: "Alice Morgan",
      id: "LIB-501",
      initials: "AM",
      shift: "Morning Shift",
      email: "alice.m@example.com",
      status: "Active",
      statusClass: "status-active"
    },
    {
      name: "James Knight",
      id: "LIB-502",
      initials: "JK",
      shift: "Evening Shift",
      email: "james.k@example.com",
      status: "Active",
      statusClass: "status-active"
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Librarian Directory</h1>
          <p>Manage library staff and their system access.</p>
        </div>
        <Link to="/admin/add-librarian" className="btn-primary"><i className="fas fa-plus"></i> Add Librarian</Link>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search librarians..." />
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Name & ID</th>
              <th>Shift</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {librarians.map((staff, idx) => (
              <tr key={idx}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">{staff.initials}</div>
                    <div className="student-details">
                      <h4>{staff.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ID: {staff.id}</p>
                    </div>
                  </div>
                </td>
                <td><strong>{staff.shift}</strong></td>
                <td>{staff.email}</td>
                <td><span className={`status-badge ${staff.statusClass}`}>{staff.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" title="Edit Record"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon" title="Delete"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLibrarians;
