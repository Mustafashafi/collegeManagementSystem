import React, { useState, useEffect } from 'react';
import { parentApi } from '../services/api';
import toast from 'react-hot-toast';

const ParentAssignments = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [assignments, setAssignments] = useState([]);
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
    const fetchAssignments = async () => {
      if (!selectedChild) return;
      try {
        const response = await parentApi.getStudent360(selectedChild.studentId);
        setAssignments(response.data.assignments || []);
      } catch (err) {
        toast.error("Failed to load assignments");
      }
    };
    fetchAssignments();
  }, [selectedChild]);

  if (loading) return <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}><i className="fas fa-spinner fa-spin"></i></div>;

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Assignments Tracking</h1>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>Monitor homework and project submissions.</p>
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
              cursor: 'pointer'
            }}
          >
            {child.firstName}
          </button>
        ))}
      </div>

      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Subject</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>No assignments found.</td></tr>
              ) : assignments.map((asgn, idx) => (
                <tr key={idx}>
                  <td><strong>{asgn.title}</strong></td>
                  <td>{asgn.subject}</td>
                  <td>{new Date(asgn.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      background: asgn.status === 'Submitted' ? '#dcfce7' : '#fee2e2',
                      color: asgn.status === 'Submitted' ? '#166534' : '#991b1b'
                    }}>
                      {asgn.status}
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

export default ParentAssignments;
