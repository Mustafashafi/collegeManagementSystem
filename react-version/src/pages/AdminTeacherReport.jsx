import React from 'react';

const AdminTeacherReport = () => {
  const stats = [
    { label: "Attendance Rate", value: "94.3%", trend: "+1.2% from last month", trendClass: "trend-up" },
    { label: "Avg. Late Days", value: "2.4 days", trend: "-0.5 days", trendClass: "trend-up" },
    { label: "Total Leave Days", value: "48 days", trend: "Across all faculty", trendClass: "" },
    { label: "Top Department", value: "Physics", trend: "98% Attendance", trendClass: "trend-up" },
  ];

  const reportData = [
    { name: "Prof. Robert Smith", dept: "Computer Science", totalDays: 22, present: 20, absent: 1, late: 1, rate: "90.9%" },
    { name: "Dr. Jane Doe", dept: "Physics", totalDays: 22, present: 21, absent: 0, late: 1, rate: "95.4%" },
    { name: "Alice Brown", dept: "Mathematics", totalDays: 22, present: 18, absent: 4, late: 0, rate: "81.8%" },
    { name: "Mark Wilson", dept: "English", totalDays: 22, present: 22, absent: 0, late: 0, rate: "100%" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Monthly Attendance Report</h1>
          <p>Detailed performance and attendance trends for the current month.</p>
        </div>
        <button className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', border: '1px solid var(--border)' }}>
          <i className="fas fa-download"></i> Export CSV
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            <span className={`stat-trend ${stat.trendClass}`}>{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <div className="select-wrapper">
            <select className="form-control">
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Physics</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="select-wrapper">
            <select className="form-control">
              <option>October 2026</option>
              <option>September 2026</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Faculty Attendance Summary</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Period: Oct 01 - Oct 31, 2026</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Department</th>
              <th>Working Days</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td><strong>{row.name}</strong></td>
                <td>{row.dept}</td>
                <td>{row.totalDays}</td>
                <td style={{ color: 'var(--present)', fontWeight: 600 }}>{row.present}</td>
                <td style={{ color: 'var(--absent)', fontWeight: 600 }}>{row.absent}</td>
                <td style={{ color: 'var(--late)', fontWeight: 600 }}>{row.late}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                      <div style={{ width: row.rate, height: '100%', background: 'var(--primary)' }}></div>
                    </div>
                    <strong>{row.rate}</strong>
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

export default AdminTeacherReport;
