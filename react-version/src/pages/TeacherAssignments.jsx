import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useNavigate } from 'react-router-dom';

const TeacherAssignments = () => {
  const navigate = useNavigate();

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
        <table className="data-table">
          <thead>
            <tr>
              <th>Assignment Title</th>
              <th>Class / Subject</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Binary Trees Project</strong></td>
              <td>Data Structures (B.Sc CS)</td>
              <td>Oct 28, 2026</td>
              <td>30 / 45</td>
              <td><span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Active</span></td>
              <td><button className="btn-sm">View & Grade</button></td>
            </tr>
            <tr>
              <td><strong>SQL Query Assignment</strong></td>
              <td>Database Mgmt (B.Sc CS)</td>
              <td>Oct 20, 2026</td>
              <td>40 / 40</td>
              <td><span className="status-badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>Closed</span></td>
              <td><button className="btn-sm">View Grades</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAssignments;
