import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminClasses = () => {
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ['adminClasses'],
    queryFn: () => adminApi.getClasses().then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminClasses']);
      toast.success('Program deleted successfully');
    },
    onError: () => toast.error('Failed to delete program')
  });

  const handleDelete = (cls) => {
    if (window.confirm(`Are you sure you want to delete "${cls.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(cls._id);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Classes & Subjects</h1>
          <p>Manage courses, batches, and assign subjects to teachers.</p>
        </div>
        <Link to="/admin/add-class" className="btn-primary"><i className="fas fa-plus"></i> Add New Class</Link>
      </div>

      <div className="grid-cards">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
            <i className="fas fa-spinner fa-spin"></i> Loading classes...
          </div>
        ) : classes?.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
            No programs found. Click "Add New Class" to create one.
          </div>
        ) : classes?.map((cls, idx) => (
          <div className="class-card" key={idx}>
            <div className="class-header">
              <span className="class-title">{cls.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="class-badge">{cls.badge}</span>
                <button
                  onClick={() => handleDelete(cls)}
                  title="Delete Program"
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: '0.2s' }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0.6}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div className="class-stats">
              <div><i className="fas fa-users"></i> {cls.students} Students</div>
              <div><i className="fas fa-book-open"></i> {cls.subjectsCount} Subjects</div>
            </div>
            <div className="subject-list">
              {cls.subjects.map((sub, sIdx) => (
                <div className="subject-item" key={sIdx}>
                  <span className="subject-name">{sub.name}</span>
                  <span className="subject-teacher">{sub.teacher}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClasses;
