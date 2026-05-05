import React from 'react';

const ParentAttendance = () => {
  const summary = [
    { name: "Data Structures & Algorithms", percent: 95, classes: "19/20" },
    { name: "Discrete Mathematics", percent: 88, classes: "15/17" },
    { name: "Technical Writing", percent: 100, classes: "12/12" }
  ];

  const logs = [
    { date: "Oct 24, 2023", code: "CS201", name: "Data Structures & Algorithms", time: "09:00 AM - 10:30 AM", status: "Present" },
    { date: "Oct 23, 2023", code: "MA102", name: "Discrete Mathematics", time: "11:00 AM - 12:30 PM", status: "Absent" },
    { date: "Oct 23, 2023", code: "EN305", name: "Technical Writing", time: "02:00 PM - 03:30 PM", status: "Present" },
    { date: "Oct 22, 2023", code: "CS201", name: "Data Structures & Algorithms", time: "09:00 AM - 10:30 AM", status: "Present" },
    { date: "Oct 21, 2023", code: "MA102", name: "Discrete Mathematics", time: "11:00 AM - 12:30 PM", status: "Present" },
    { date: "Oct 20, 2023", code: "CS201", name: "Data Structures & Algorithms", time: "09:00 AM - 10:30 AM", status: "Absent" }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Attendance: Michael Chen</h1>
      </div>

      <div className="attendance-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {summary.map((course, idx) => (
          <div key={idx} className="course-att-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="course-name" style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px' }}>{course.name}</div>
            <div className="progress-container" style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
              <div className="progress-bar" style={{ height: '100%', background: '#1a1a1a', borderRadius: '10px', width: `${course.percent}%` }}></div>
            </div>
            <div className="att-stats" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
              <span>{course.percent}% Attendance</span>
              <span>{course.classes} Classes</span>
            </div>
          </div>
        ))}
      </div>

      <div className="log-container" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="log-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Detailed Attendance Log</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="attendance-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Course Code</th>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Course Name</th>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Time Slot</th>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>{log.date}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>{log.code}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>{log.name}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>{log.time}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>
                    <span 
                      className={`status-badge ${log.status === 'Present' ? 'status-present' : 'status-absent'}`} 
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        background: log.status === 'Present' ? '#ecfdf5' : '#fef2f2',
                        color: log.status === 'Present' ? '#22c55e' : '#ef4444'
                      }}
                    >
                      <i className={`fas ${log.status === 'Present' ? 'fa-check-circle' : 'fa-times-circle'}`}></i> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentAttendance;
