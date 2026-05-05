import React from 'react';

const StudentResults = () => {
  const results = [
    { code: "CS 201", title: "Data Structures", credits: 4, grade: "A", status: "Pass" },
    { code: "MAT 102", title: "Calculus II", credits: 3, grade: "B+", status: "Pass" },
    { code: "ENG 105", title: "Technical Writing", credits: 2, grade: "A-", status: "Pass" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>My Academic Performance</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>View your grades and transcript summary.</p>
      </div>

      <div className="result-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>Semester 2 - Fall 2025</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Course Code</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Course Title</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Credits</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Grade</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.code}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.title}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.credits}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#1a1a1a' }}>{res.grade}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb', color: '#10b981' }}>{res.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="gpa-summary" style={{ display: 'flex', gap: '30px', marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
          <div className="gpa-item">
            <h4 style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Semester GPA</h4>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>3.75</p>
          </div>
          <div className="gpa-item">
            <h4 style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Total Credits</h4>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>9.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;
