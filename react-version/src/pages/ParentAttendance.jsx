import React, { useState, useEffect } from 'react';
import { parentApi } from '../services/api';
import toast from 'react-hot-toast';

const ParentAttendance = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentApi.getChildren(user.email);
        const students = response.data.students || [];
        setChildren(students);
        if (students.length > 0) setSelectedChild(students[0]);
      } catch (err) {
        toast.error("Failed to fetch children");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchChildren();
  }, [user.email]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedChild) return;
      try {
        const response = await parentApi.getStudent360(selectedChild.studentId);
        setAttendance(response.data.attendance || []);
      } catch (err) {
        toast.error("Failed to load attendance logs");
      }
    };
    fetchAttendance();
  }, [selectedChild]);

  // Compute subject-wise overall attendance stats
  const calculateSubjectSummary = () => {
    const summaryMap = {};
    attendance.forEach(record => {
      const { subject, status } = record;
      if (!subject) return;
      
      // Normalize subject name to resolve trailing spaces, case variations, etc.
      const normalizedSubject = subject.trim().replace(/\s+/g, ' ');
      const key = normalizedSubject.toLowerCase();

      if (!summaryMap[key]) {
        summaryMap[key] = { name: normalizedSubject, total: 0, present: 0 };
      }
      summaryMap[key].total += 1;
      if (status === 'Present') {
        summaryMap[key].present += 1;
      }
    });

    return Object.keys(summaryMap).map(key => {
      const { name, total, present } = summaryMap[key];
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return { subject: name, total, present, percentage };
    });
  };

  if (loading) return <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}><i className="fas fa-spinner fa-spin"></i></div>;

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Attendance Logs</h1>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>Monitor daily presence and overall academic standing.</p>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        {children.map(child => (
          <button
            key={child._id}
            onClick={() => setSelectedChild(child)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: selectedChild?._id === child._id ? 'var(--primary)' : '#fff',
              color: selectedChild?._id === child._id ? '#fff' : '#1a1a1a',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              fontWeight: 600,
              transition: '0.2s'
            }}
          >
            {child.firstName}
          </button>
        ))}
      </div>

      {/* Overall Subject-wise Summary Cards */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Subject-wise Attendance Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {calculateSubjectSummary().map((summary, idx) => (
            <div key={idx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827', maxWidth: '70%', wordBreak: 'break-word', lineHeight: '1.3' }}>{summary.subject}</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: summary.percentage >= 75 ? '#166534' : '#b91c1c'
                }}>
                  {summary.percentage}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{ background: '#f3f4f6', height: '6px', borderRadius: '3px', width: '100%', overflow: 'hidden' }}>
                <div style={{
                  background: summary.percentage >= 75 ? '#22c55e' : '#ef4444',
                  height: '100%',
                  width: `${summary.percentage}%`,
                  borderRadius: '3px',
                  transition: 'width 0.5s ease-out'
                }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>
                <span>{summary.present} of {summary.total} classes attended</span>
                <span style={{
                  color: summary.percentage >= 75 ? '#166534' : '#b91c1c',
                  background: summary.percentage >= 75 ? '#dcfce7' : '#fee2e2',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  {summary.percentage >= 75 ? 'Good Standing' : 'Low Attendance'}
                </span>
              </div>
            </div>
          ))}
          {calculateSubjectSummary().length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '24px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: '12px', background: '#fff', fontSize: '13px' }}>
              No subjects loaded for {selectedChild?.firstName}.
            </div>
          )}
        </div>
      </div>

      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Daily Presence Logs</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px' }}>No attendance records found.</td></tr>
              ) : attendance.map((record, idx) => (
                <tr key={idx}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.subject}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: record.status === 'Present' ? '#dcfce7' : '#fee2e2',
                      color: record.status === 'Present' ? '#166534' : '#991b1b'
                    }}>
                      {record.status}
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
