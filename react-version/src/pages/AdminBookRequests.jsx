import React from 'react';

const AdminBookRequests = () => {
  const requests = [
    { title: "Introduction to Algorithms", isbn: "978-0262033848", user: "Michael Chen", uid: "S-2024-001 (Student)", date: "Oct 22, 2026", status: "Pending", statusClass: "status-pending" },
    { title: "Clean Code", isbn: "978-0132350884", user: "Sarah Williams", uid: "S-2023-042 (Student)", date: "Oct 21, 2026", status: "Approved", statusClass: "status-approved" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Library Book Requests Overview</h1>
          <p>Overview of book issuance requests from students and teachers across the institution.</p>
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Book Title & ISBN</th>
              <th>Requested By</th>
              <th>Request Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={idx}>
                <td>
                  <strong>{req.title}</strong><br />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ISBN: {req.isbn}</span>
                </td>
                <td>
                  {req.user}<br />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {req.uid}</span>
                </td>
                <td>{req.date}</td>
                <td><span className={`status-badge ${req.statusClass}`}>{req.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookRequests;
