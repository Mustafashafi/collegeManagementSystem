import React, { useState } from 'react';

const AdminTeacherAttendance = () => {
  const [view, setView] = useState('daily');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const stats = [
    { label: "Total Faculty", value: "142", trend: "2 new this month", trendColor: "#10b981", trendIcon: "fas fa-caret-up" },
    { label: "Present Today", value: "134", trend: "94.3% Attendance", trendColor: "#10b981", trendIcon: "fas fa-check-circle" },
    { label: "Absent", value: "5", trend: "3 on leave", trendColor: "#ef4444", trendIcon: "fas fa-exclamation-circle" },
    { label: "Late Arrival", value: "3", trend: "2.1% rate", trendColor: "#f59e0b", trendIcon: "fas fa-clock" },
  ];

  const roster = [
    { name: "Prof. Robert Smith", id: "T-1001", initials: "RS", dept: "Computer Science", role: "Head of Dept.", checkIn: "08:45 AM", status: "Present", statusClass: "status-present" },
    { name: "Dr. Jane Doe", id: "T-1002", initials: "JD", dept: "Physics", role: "Professor", checkIn: "09:05 AM", status: "Late", statusClass: "status-late" },
    { name: "Alice Brown", id: "T-1005", initials: "AB", dept: "Mathematics", role: "Lecturer", checkIn: "--:--", status: "Absent", statusClass: "status-absent" },
    { name: "Mark Lee", id: "T-1008", initials: "ML", dept: "English", role: "Assistant Professor", checkIn: "--:--", status: "On Leave", statusClass: "status-on-leave" },
  ];

  const monthlyData = [
    { name: "Prof. Robert Smith", id: "T-1001", initials: "RS", workingDays: 22, present: 21, absent: 0, late: 1, leaves: 0, percentage: "95.4%" },
    { name: "Dr. Jane Doe", id: "T-1002", initials: "JD", workingDays: 22, present: 19, absent: 1, late: 2, leaves: 0, percentage: "86.3%" },
    { name: "Alice Brown", id: "T-1005", initials: "AB", workingDays: 22, present: 20, absent: 2, late: 0, leaves: 0, percentage: "90.9%" },
    { name: "Mark Lee", id: "T-1008", initials: "ML", workingDays: 22, present: 15, absent: 2, late: 0, leaves: 5, percentage: "68.1%" },
  ];

  const dailyLogs = [
    { date: "Oct 24, 2026", checkIn: "08:45 AM", checkOut: "04:30 PM", status: "Present", statusClass: "status-present", remarks: "Regular" },
    { date: "Oct 23, 2026", checkIn: "08:50 AM", checkOut: "04:35 PM", status: "Present", statusClass: "status-present", remarks: "Regular" },
    { date: "Oct 22, 2026", checkIn: "09:15 AM", checkOut: "04:30 PM", status: "Late", statusClass: "status-late", remarks: "Traffic delay" },
    { date: "Oct 21, 2026", checkIn: "08:40 AM", checkOut: "04:45 PM", status: "Present", statusClass: "status-present", remarks: "Regular" },
    { date: "Oct 20, 2026", checkIn: "--:--", checkOut: "--:--", status: "Absent", statusClass: "status-absent", remarks: "Medical" },
  ];

  if (selectedTeacher) {
    return (
      <div className="dashboard-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn-icon" onClick={() => setSelectedTeacher(null)}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1>Detailed Attendance Log</h1>
              <p>Individual attendance records for the current academic month.</p>
            </div>
          </div>
          <button className="btn-primary">
            <i className="fas fa-print"></i> Print Log
          </button>
        </div>

        <div className="panel" style={{ marginBottom: '24px' }}>
          <div className="panel-body" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="teacher-info">
              <div className="teacher-avatar" style={{ width: '60px', height: '60px', fontSize: '20px' }}>{selectedTeacher.initials}</div>
              <div className="teacher-details">
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedTeacher.name}</h2>
                <p style={{ fontSize: '14px' }}>ID: {selectedTeacher.id} • Computer Science Department</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{selectedTeacher.present}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Present</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{selectedTeacher.absent}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Absent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{selectedTeacher.late}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Late</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>{selectedTeacher.percentage}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Overall</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Attendance History (October 2026)</h3>
            <div className="select-wrapper">
              <select><option>October 2026</option><option>September 2026</option></select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Working Hours</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {dailyLogs.map((log, idx) => (
                <tr key={idx}>
                  <td><strong>{log.date}</strong></td>
                  <td>{log.checkIn}</td>
                  <td>{log.checkOut}</td>
                  <td>{log.checkIn !== '--:--' ? "7.5 hrs" : "--"}</td>
                  <td><span className={`status-badge ${log.statusClass}`}>{log.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Teacher Attendance Report</h1>
          <p>Monitor and manage daily attendance records for all faculty members.</p>
        </div>
        <button className="btn-outline">
          <i className="fas fa-download"></i> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</span>
            <span style={{ fontSize: '12px', color: stat.trendColor, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className={stat.trendIcon}></i> {stat.trend}
            </span>
          </div>
        ))}
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button className={`tab-btn ${view === 'daily' ? 'active' : ''}`} onClick={() => setView('daily')}>
          <i className="fas fa-calendar-day"></i> Daily Roster
        </button>
        <button className={`tab-btn ${view === 'monthly' ? 'active' : ''}`} onClick={() => setView('monthly')}>
          <i className="fas fa-chart-line"></i> Monthly Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="select-wrapper">
            <select>
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>English</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="select-wrapper">
            <select>
              <option>All Roles</option>
              <option>Professor</option>
              <option>Assistant Professor</option>
              <option>Lecturer</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
        <input type="date" defaultValue="2026-10-24" style={{
          background: '#f3f4f6', border: '1px solid transparent', padding: '10px 16px',
          borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter', color: 'var(--text-main)', outline: 'none'
        }} />
      </div>

      {/* Daily Roster */}
      {view === 'daily' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Daily Attendance Roster</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing records for Oct 24, 2026</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Details</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Check-In</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((t, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="teacher-info">
                      <div className="teacher-avatar">{t.initials}</div>
                      <div className="teacher-details">
                        <h4>{t.name}</h4>
                        <p>{t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td><strong>{t.dept}</strong></td>
                  <td>{t.role}</td>
                  <td>{t.checkIn}</td>
                  <td><span className={`status-badge ${t.statusClass}`}>{t.status}</span></td>
                  <td>
                    <div className="attendance-actions">
                      <button className="btn-action btn-present" title="Mark Present">P</button>
                      <button className="btn-action btn-absent" title="Mark Absent">A</button>
                      <button className="btn-action" title="Edit Remarks"><i className="fas fa-edit"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly Report */}
      {view === 'monthly' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Monthly Attendance Summary</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Staff Performance · October 2026</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Details</th>
                <th>Working Days</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Leaves</th>
                <th>Percentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="teacher-info">
                      <div className="teacher-avatar">{row.initials}</div>
                      <div className="teacher-details">
                        <h4>{row.name}</h4>
                        <p>{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{row.workingDays}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>{row.present}</td>
                  <td style={{ color: '#ef4444', fontWeight: 600 }}>{row.absent}</td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>{row.late}</td>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{row.leaves}</td>
                  <td><strong>{row.percentage}</strong></td>
                  <td>
                    <button className="btn-sm" onClick={() => setSelectedTeacher(row)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-eye"></i> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherAttendance;
