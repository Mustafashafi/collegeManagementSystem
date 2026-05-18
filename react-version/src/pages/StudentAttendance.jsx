import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/attendance/${user.email}`);
        let data = await response.json();
        if (!Array.isArray(data)) data = [];
        setAttendance(data);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        toast.error("Failed to load attendance records.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchAttendance();
  }, [user.email]);

  // Group by subject for summary with whitespace and case normalization
  const summaryMap = {};
  attendance.forEach(a => {
    if (!a.subject) return;
    const normalizedName = a.subject.trim().replace(/\s+/g, ' ');
    const key = normalizedName.toLowerCase();
    
    if (!summaryMap[key]) {
      summaryMap[key] = { name: normalizedName, records: [] };
    }
    summaryMap[key].records.push(a);
  });

  const summaryData = Object.keys(summaryMap).map(key => {
    const { name, records } = summaryMap[key];
    const presentCount = records.filter(a => a.status === 'Present').length;
    const percentage = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;
    return { name, percentage, stats: `${presentCount}/${records.length} Classes` };
  });

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Attendance Tracking</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}> Monitor your presence across all enrolled courses.</p>
      </div>

      <div className="attendance-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {summaryData.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', color: '#6b7280' }}>
            No course attendance summary available.
          </div>
        ) : summaryData.map((course, idx) => (
          <div key={idx} className="course-att-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
            <div className="course-name" style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px' }}>{course.name}</div>
            <div className="progress-container" style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
              <div className="progress-bar" style={{ height: '100%', background: '#1a1a1a', borderRadius: '10px', width: `${course.percentage}%` }}></div>
            </div>
            <div className="att-stats" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
              <span>{course.percentage}% Attendance</span>
              <span>{course.stats}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="log-container" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
        <div className="log-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Detailed Attendance Log</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Course Name</th>
                <th style={{ background: '#f8fafc', padding: '15px 20px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>No attendance logs found.</td>
                </tr>
              ) : attendance.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>{new Date(log.date).toLocaleDateString()}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>{log.subject}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: log.status === 'Present' ? '#ecfdf5' : '#fef2f2',
                      color: log.status === 'Present' ? '#22c55e' : '#ef4444'
                    }}>
                      {log.status}
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

export default StudentAttendance;
