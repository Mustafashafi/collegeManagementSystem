import React from 'react';
import { Link } from 'react-router-dom';

const AdminTeachers = () => {
  const teachers = [
    {
      name: "Prof. Robert Smith",
      id: "T-1001",
      initials: "RS",
      department: "Computer Science",
      email: "robert.s@example.com",
      status: "Active",
      statusClass: "status-active"
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Teacher Directory</h1>
          <p>Manage all faculty and staff records.</p>
        </div>
        <Link to="/admin/add-teacher" className="btn-primary"><i className="fas fa-plus"></i> Add New Teacher</Link>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search teachers..." />
        </div>
        <div className="select-wrapper">
          <select>
            <option>Department</option>
            <option>Computer Science</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Teacher Name & ID</th>
              <th>Department</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, idx) => (
              <tr key={idx}>
                <td>
                  <div className="teacher-info">
                    <div className="teacher-avatar">{teacher.initials}</div>
                    <div className="teacher-details">
                      <h4>{teacher.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ID: {teacher.id}</p>
                    </div>
                  </div>
                </td>
                <td><strong>{teacher.department}</strong></td>
                <td>{teacher.email}</td>
                <td><span className={`status-badge ${teacher.statusClass}`}>{teacher.status}</span></td>
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
        <div className="pagination">
          <span>Showing 1 of 142 entries</span>
          <div className="page-numbers">
            <div className="page-num active">1</div>
            <div className="page-num">2</div>
            <div className="page-num">3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeachers;
