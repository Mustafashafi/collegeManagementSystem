import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/results/${user.email}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        toast.error("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchResults();
  }, [user.email]);

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
        <h1>My Academic Performance</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>View your grades and transcript summary.</p>
      </div>

      <div className="result-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>Current Academic Record</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Subject</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Exam Type</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Marks</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>No exam results found yet.</td>
                </tr>
              ) : results.map((res, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.subject}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.examType}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.marksObtained} / {res.totalMarks}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#1a1a1a' }}>{res.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;
