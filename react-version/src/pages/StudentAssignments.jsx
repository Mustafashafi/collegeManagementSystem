import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentAssignments = () => {
  const navigate = useNavigate();

  const assignments = [
    {
      title: "Design & Analysis of Algorithms - Research Paper",
      due: "Oct 26, 2026",
      teacher: "Prof. Robert Smith",
      status: "Pending",
      type: "pending"
    },
    {
      title: "Networking Basics - Lab Exercise 4",
      submitted: "Oct 20, 2026",
      grade: "90/100",
      status: "Submitted",
      type: "submitted"
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>My Academic Assignments</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Submit your work and track grading status.</p>
      </div>

      {assignments.map((as, idx) => (
        <div key={idx} className="assignment-card" style={{ 
          background: '#fff', 
          border: '1px solid #e5e7eb', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          transition: '0.2s'
        }}>
          <div className="as-info">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{as.title}</h3>
            <div className="as-meta" style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#6b7280' }}>
              {as.type === 'pending' ? (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-calendar-alt"></i> Due: {as.due}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-user-tie"></i> {as.teacher}</span>
                </>
              ) : (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-calendar-alt"></i> Submitted: {as.submitted}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> Graded: {as.grade}</span>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={`status-tag ${as.type === 'pending' ? 'status-pending' : 'status-submitted'}`} style={{ 
              padding: '6px 12px', 
              borderRadius: '8px', 
              fontSize: '11px', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              background: as.type === 'pending' ? '#fff7ed' : '#f0fdf4',
              color: as.type === 'pending' ? '#9a3412' : '#166534',
              border: as.type === 'pending' ? '1px solid #ffedd5' : '1px solid #dcfce7'
            }}>
              {as.status}
            </span>
            {as.type === 'pending' && (
              <button 
                className="btn-submit-work" 
                onClick={() => navigate('/student/submit-assignment')}
                style={{ 
                  padding: '8px 16px', 
                  background: '#1a1a1a', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  marginLeft: '15px' 
                }}
              >
                Submit Work
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentAssignments;
