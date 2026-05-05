import React from 'react';
import { Link } from 'react-router-dom';

const AdminAccessControl = () => {
  const roles = [
    {
      title: "Teacher",
      icon: "fas fa-chalkboard-teacher",
      count: "142 Users",
      permissions: [
        { name: "Mark Attendance", enabled: true },
        { name: "Upload Results", enabled: true },
        { name: "Manage Assignments", enabled: true },
        { name: "Access Finance", enabled: false },
      ]
    },
    {
      title: "Librarian",
      icon: "fas fa-user-tie",
      count: "5 Users",
      permissions: [
        { name: "Manage Books", enabled: true },
        { name: "Issue Books", enabled: true },
        { name: "View Student Profile", enabled: true },
        { name: "Delete Records", enabled: false },
      ]
    },
    {
      title: "Admissions Officer",
      icon: "fas fa-user-check",
      count: "3 Users",
      permissions: [
        { name: "Manage Leads", enabled: true },
        { name: "Approve Applications", enabled: true },
        { name: "Marketing Campaigns", enabled: true },
        { name: "Edit Fee Structure", enabled: false },
      ]
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Role-Based Access Control</h1>
          <p>Define permissions for different staff roles across the system.</p>
        </div>
        <Link to="/admin/add-role" className="btn-primary"><i className="fas fa-plus"></i> Add New Role</Link>
      </div>

      <div className="role-grid">
        {roles.map((role, idx) => (
          <div className="role-card" key={idx}>
            <div className="role-header">
              <div className="role-title"><i className={role.icon}></i> {role.title}</div>
              <span className="role-badge">{role.count}</span>
            </div>
            <div className="permission-list">
              {role.permissions.map((perm, pIdx) => (
                <div className="permission-item" key={pIdx}>
                  <span className="permission-name">{perm.name}</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked={perm.enabled} />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAccessControl;
