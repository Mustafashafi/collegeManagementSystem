import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        const result = await response.json();
        if (response.ok) {
          // Group assignments by title/subject to show consolidated view
          const grouped = result.recentAssignments.reduce((acc, curr) => {
            const key = `${curr.title}-${curr.subject}`;
            if (!acc[key]) {
              acc[key] = { ...curr, count: 0, submitted: 0 };
            }
            acc[key].count += 1;
            if (curr.status === 'Submitted' || curr.status === 'Graded') acc[key].submitted += 1;
            return acc;
          }, {});
          setAssignments(Object.values(grouped));
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchAssignments();
  }, [user.email]);

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h1>Manage Assignments</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Create, track, and grade assignments for your classes.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/teacher/add-assignment')}>
          <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> Create Assignment
        </button>
      </div>

      <div className="panel">
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Subject</th>
                <th>Due Date</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? assignments.map((asgn, idx) => (
                <tr key={idx}>
                  <td><strong>{asgn.title}</strong></td>
                  <td>{asgn.subject}</td>
                  <td>{new Date(asgn.dueDate).toLocaleDateString()}</td>
                  <td>{asgn.submitted} / {asgn.count || '?'}</td>
                  <td>
                    <span className="status-badge" style={{ 
                      background: new Date(asgn.dueDate) > new Date() ? '#dbeafe' : '#f3f4f6', 
                      color: new Date(asgn.dueDate) > new Date() ? '#1e40af' : '#4b5563' 
                    }}>
                      {new Date(asgn.dueDate) > new Date() ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-sm" onClick={() => navigate('/teacher/results')}>
                      {asgn.submitted > 0 ? 'View & Grade' : 'View Details'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No assignments found. Click "Create Assignment" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherAssignments;
