import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/students/assignments/${user.email}`);
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        toast.error("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchAssignments();
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
        <h1>My Academic Assignments</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Submit your work and track grading status.</p>
      </div>

      {assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280' }}>No assignments found at this time.</p>
        </div>
      ) : assignments.map((as, idx) => (
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-calendar-alt"></i> Due: {new Date(as.dueDate).toLocaleDateString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-user-tie"></i> {as.teacher}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-book"></i> {as.subject}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={`status-tag`} style={{ 
              padding: '6px 12px', 
              borderRadius: '8px', 
              fontSize: '11px', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              background: as.status === 'Pending' ? '#fff7ed' : '#f0fdf4',
              color: as.status === 'Pending' ? '#9a3412' : '#166534',
              border: as.status === 'Pending' ? '1px solid #ffedd5' : '1px solid #dcfce7'
            }}>
              {as.status}
            </span>
            {as.status === 'Pending' && (
              <button 
                className="btn-submit-work" 
                onClick={() => navigate('/student/submit-assignment', { state: { assignment: as } })}
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
