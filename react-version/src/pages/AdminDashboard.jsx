import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { label: "Total Students", value: "2,450", icon: "fas fa-user-graduate", bgColor: "#eff6ff", iconColor: "#3b82f6" },
    { label: "Total Teachers", value: "142", icon: "fas fa-chalkboard-teacher", bgColor: "#ecfdf5", iconColor: "#10b981" },
    { label: "New Inquiries (This Month)", value: "328", icon: "fas fa-user-plus", bgColor: "#f5f3ff", iconColor: "#8b5cf6" },
    { label: "Fees Collected", value: "$45.2k", icon: "fas fa-file-invoice-dollar", bgColor: "#fff7ed", iconColor: "#f97316" },
  ];

  const recentAdmissions = [
    { name: "Michael Chen", program: "B.Sc Computer Science", date: "Oct 24, 2026", status: "Under Review", statusClass: "status-pending" },
    { name: "Sarah Williams", program: "B.A English", date: "Oct 23, 2026", status: "Approved", statusClass: "status-approved" },
    { name: "James Rodriguez", program: "B.B.A Management", date: "Oct 22, 2026", status: "Pending Docs", statusClass: "status-pending" },
    { name: "Emily Davis", program: "M.Sc Physics", date: "Oct 21, 2026", status: "Enrolled", statusClass: "status-approved" },
  ];

  const activities = [
    { title: "New Book Request", desc: "Library: 5 new requests pending review", time: "30m ago", icon: "fas fa-book-reader" },
    { title: "Fee Payment Received", desc: "John Doe paid $1,200 for Term 1", time: "2h ago", icon: "fas fa-file-invoice" },
    { title: "Access Role Updated", desc: "System: Teacher permissions modified", time: "4h ago", icon: "fas fa-user-shield" },
    { title: "Event Created", desc: "Annual Sports Day scheduled", time: "1d ago", icon: "fas fa-calendar-plus" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening across the institution today.</p>
      </div>

      {/* Quick Directory Filter */}
      <div className="filter-panel" style={{ 
        background: '#fff', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid var(--border)', 
        marginBottom: '30px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr) auto', 
        gap: '20px', 
        alignItems: 'end', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>View Category</label>
          <div className="select-wrapper">
            <select className="form-control" style={{ background: '#f9fafb' }}>
              <option>All Individuals</option>
              <option>Students</option>
              <option>Teachers</option>
            </select>
            <i className="fas fa-chevron-down" style={{ right: '12px', fontSize: '12px' }}></i>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Academic Program</label>
          <div className="select-wrapper">
            <select className="form-control" style={{ background: '#f9fafb' }}>
              <option>All Programs</option>
              <option>B.Sc Computer Science</option>
            </select>
            <i className="fas fa-chevron-down" style={{ right: '12px', fontSize: '12px' }}></i>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Study Year</label>
          <div className="select-wrapper">
            <select className="form-control" style={{ background: '#f9fafb' }}>
              <option>All Years</option>
              <option>1st Year</option>
            </select>
            <i className="fas fa-chevron-down" style={{ right: '12px', fontSize: '12px' }}></i>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Department</label>
          <div className="select-wrapper">
            <select className="form-control" style={{ background: '#f9fafb' }}>
              <option>All Departments</option>
              <option>Computer Science</option>
            </select>
            <i className="fas fa-chevron-down" style={{ right: '12px', fontSize: '12px' }}></i>
          </div>
        </div>
        <div>
          <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '13px', fontWeight: 700, background: '#111827', minWidth: '150px' }}>
            <i className="fas fa-th-large" style={{ marginRight: '8px' }}></i>Quick View
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.iconColor }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Admissions / Applications</h3>
            <button className="btn-sm">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Program</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAdmissions.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.program}</td>
                  <td>{item.date}</td>
                  <td><span className={`status-badge ${item.statusClass}`} style={{ textTransform: 'none' }}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent Activities</h3>
          </div>
          <div className="activity-list">
            {activities.map((activity, idx) => (
              <div className="activity-item" key={idx}>
                <div className="activity-icon"><i className={activity.icon}></i></div>
                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{activity.desc}</p>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
