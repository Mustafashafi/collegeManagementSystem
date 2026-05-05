import React from 'react';
import { Link } from 'react-router-dom';

const AdminStudents = () => {
  const students = [
    {
      name: "Michael Chen",
      id: "S-2024-001",
      initials: "MC",
      program: "B.Sc Computer Science",
      year: "2nd Year",
      email: "michael.c@example.com",
      phone: "+1 234-567-8900",
      enrollmentDate: "Sep 01, 2024",
      status: "Active",
      statusClass: "status-active"
    },
    {
      name: "Sarah Williams",
      id: "S-2023-042",
      initials: "SW",
      program: "B.A English",
      year: "3rd Year",
      email: "sarah.w@example.com",
      phone: "+1 987-654-3210",
      enrollmentDate: "Sep 05, 2023",
      status: "Active",
      statusClass: "status-active"
    },
    {
      name: "James Rodriguez",
      id: "S-2025-112",
      initials: "JR",
      program: "B.B.A Management",
      year: "1st Year",
      email: "james.r@example.com",
      phone: "+1 456-789-0123",
      enrollmentDate: "Aug 28, 2025",
      status: "Inactive",
      statusClass: "status-inactive"
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Student Directory</h1>
          <p>Manage and view all enrolled student records across all departments.</p>
        </div>
        <Link to="/admin/add-student" className="btn-primary"><i className="fas fa-plus"></i> Add New Student</Link>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search by name, ID, email..." />
        </div>
        <div className="select-wrapper">
          <select>
            <option value="">Course / Program</option>
            <option value="bsc-cs">B.Sc Computer Science</option>
            <option value="bba">B.B.A Management</option>
            <option value="ba-eng">B.A English</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
        <div className="select-wrapper">
          <select>
            <option value="">Batch / Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
        <div className="select-wrapper">
          <select>
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name & ID</th>
              <th>Program & Year</th>
              <th>Contact Info</th>
              <th>Enrollment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={idx}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">{student.initials}</div>
                    <div className="student-details">
                      <h4>{student.name}</h4>
                      <p>ID: {student.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{student.program}</strong><br />
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{student.year}</span>
                </td>
                <td>
                  {student.email}<br />
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{student.phone}</span>
                </td>
                <td>{student.enrollmentDate}</td>
                <td><span className={`status-badge ${student.statusClass}`}>{student.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" title="View Profile"><i className="fas fa-eye"></i></button>
                    <button className="btn-icon" title="Edit Record"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon" title="Delete"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Showing 1 to 3 of 2,450 entries</span>
          <div className="page-numbers">
            <div className="page-num"><i className="fas fa-chevron-left"></i></div>
            <div className="page-num active">1</div>
            <div className="page-num">2</div>
            <div className="page-num">3</div>
            <div className="page-num">...</div>
            <div className="page-num">245</div>
            <div className="page-num"><i className="fas fa-chevron-right"></i></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
