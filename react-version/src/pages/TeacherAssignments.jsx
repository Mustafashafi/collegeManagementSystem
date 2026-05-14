import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [editingKey, setEditingKey] = useState(null);
  const [tempDate, setTempDate] = useState('');
  const [canManage, setCanManage] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Check Permissions
        const permRes = await authApi.getPermissions('teacher');
        if (permRes.data.success) {
          const managePerm = permRes.data.permissions.find(p => p.name === 'Manage Assignments');
          if (managePerm && !managePerm.enabled) {
            setCanManage(false);
          }
        }

        const response = await fetch(`${API_BASE_URL}/api/teachers/assignments-all/${user.email}`);
        const result = await response.json();
        if (response.ok) {
          // Group assignments by title/subject to show consolidated view
          const grouped = result.reduce((acc, curr) => {
            const key = `${curr.title}-${curr.subject}`;
            if (!acc[key]) {
              acc[key] = { ...curr, count: 0, submitted: 0, key };
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

  const handleDateUpdate = async (asgn, newDate) => {
    if (!newDate) return setEditingKey(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers/assignments/due-date`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: asgn.title,
          subject: asgn.subject,
          teacherEmail: user.email,
          newDueDate: newDate
        })
      });

      if (response.ok) {
        toast.success('Due date updated');
        setAssignments(assignments.map(a => 
          a.key === asgn.key ? { ...a, dueDate: newDate } : a
        ));
      } else {
        toast.error('Failed to update due date');
      }
    } catch (err) {
      console.error('Error updating date:', err);
      toast.error('Connection error');
    } finally {
      setEditingKey(null);
    }
  };

  const handleDelete = async (title, subject) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers/assignments/${encodeURIComponent(title)}/${encodeURIComponent(subject)}/${encodeURIComponent(user.email)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Assignment deleted successfully');
        setAssignments(assignments.filter(a => !(a.title === title && a.subject === subject)));
      } else {
        toast.error('Failed to delete assignment');
      }
    } catch (err) {
      console.error('Error deleting assignment:', err);
      toast.error('Connection error');
    }
  };

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h1>Manage Assignments</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Create, track, and grade assignments for your classes.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/teacher/add-assignment')}
          disabled={!canManage}
          style={!canManage ? { opacity: 0.5, cursor: 'not-allowed', background: '#9ca3af' } : {}}
        >
          <i className={!canManage ? "fas fa-lock" : "fas fa-plus"} style={{ marginRight: '8px' }}></i> 
          {!canManage ? 'Creation Disabled' : 'Create Assignment'}
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
                  <td 
                    onClick={() => {
                      if (!canManage) return;
                      setEditingKey(asgn.key);
                      setTempDate(new Date(asgn.dueDate).toISOString().split('T')[0]);
                    }}
                    style={{ cursor: canManage ? 'pointer' : 'default', position: 'relative' }}
                  >
                    {editingKey === asgn.key ? (
                      <input 
                        type="date" 
                        autoFocus
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        onBlur={() => handleDateUpdate(asgn, tempDate)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleDateUpdate(asgn, tempDate);
                          if (e.key === 'Escape') setEditingKey(null);
                        }}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--primary)', fontSize: '13px' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: canManage ? 'var(--primary)' : 'inherit', fontWeight: 600 }}>
                        {new Date(asgn.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {canManage && <i className="fas fa-edit" style={{ fontSize: '10px', opacity: 0.5 }}></i>}
                      </div>
                    )}
                  </td>
                  <td>{asgn.submitted} / {asgn.count || '?'}</td>
                  <td>
                    <span className="status-badge" style={{ 
                      background: new Date(asgn.dueDate).setHours(23, 59, 59, 999) > new Date() ? '#dbeafe' : '#f3f4f6', 
                      color: new Date(asgn.dueDate).setHours(23, 59, 59, 999) > new Date() ? '#1e40af' : '#4b5563' 
                    }}>
                      {new Date(asgn.dueDate).setHours(23, 59, 59, 999) > new Date() ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-sm" 
                        onClick={() => navigate('/teacher/view-submissions', { state: { title: asgn.title, subject: asgn.subject, teacherName: asgn.teacher } })}
                      >
                        {asgn.submitted > 0 ? 'View & Grade' : 'View Details'}
                      </button>
                      <button 
                        className="btn-sm" 
                        onClick={() => handleDelete(asgn.title, asgn.subject)}
                        disabled={!canManage}
                        style={{ 
                          background: '#fee2e2', 
                          color: '#b91c1c', 
                          border: '1px solid #fecaca',
                          opacity: canManage ? 1 : 0.5,
                          cursor: canManage ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <i className={!canManage ? "fas fa-lock" : "fas fa-trash"}></i>
                      </button>
                    </div>
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
