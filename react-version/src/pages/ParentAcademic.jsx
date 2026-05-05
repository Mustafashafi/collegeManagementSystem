import React from 'react';

const ParentAcademic = () => {
  const results = [
    { subject: "Data Structures", obtained: 85, total: 100, grade: "A-", remarks: "Good performance, needs more focus on trees." },
    { subject: "Discrete Math", obtained: 92, total: 100, grade: "A", remarks: "Excellent analytical skills." },
    { subject: "Computer Networks", obtained: 78, total: 100, grade: "B+", remarks: "Satisfactory." },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Academic Progress: Michael Chen</h1>
      </div>

      <div className="result-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>Recent Exam Results (Mid-Term)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ background: '#f9fafb', padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Subject</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Marks Obtained</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Total Marks</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Grade</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.subject}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.obtained}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.total}</td>
                  <td className="grade" style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: '#1a1a1a' }}>{res.grade}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{res.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="gpa-summary" style={{ display: 'flex', gap: '30px', marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
          <div className="gpa-item">
            <h4 style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Overall Percentage</h4>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>85.0%</p>
          </div>
          <div className="gpa-item">
            <h4 style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Class Rank</h4>
            <p style={{ fontSize: '20px', fontWeight: 700 }}>5th</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAcademic;
