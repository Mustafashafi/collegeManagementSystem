import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminTeachers = () => {
  const queryClient = useQueryClient();
  const [deptFilter, setDeptFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: filters } = useQuery({
    queryKey: ['adminFilters'],
    queryFn: () => adminApi.getFilters().then(res => res.data),
  });

  const { data: teachers, isLoading, isError } = useQuery({
    queryKey: ['adminTeachers', deptFilter, search],
    queryFn: () => adminApi.getTeachers({ department: deptFilter, search }).then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTeachers']);
      toast.success('Teacher and all associated data deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to delete teacher');
    }
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to completely delete ${name}? This will remove their portal access, timetable, and all records permanently.`)) {
      deleteMutation.mutate(id);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Teacher Directory</h1>
          <p>Manage all faculty and staff records.</p>
        </div>
        <Link to="/admin/add-teacher" className="btn-primary"><i className="fas fa-plus"></i> Add New Teacher</Link>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search teachers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="select-wrapper">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {filters?.departments?.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      <div className="panel">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--primary)' }}></i>
            <p>Loading teachers...</p>
          </div>
        ) : isError ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
            <p>Error loading teacher data.</p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teacher Name & ID</th>
                  <th>Department</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers?.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No teachers found.</td>
                  </tr>
                ) : teachers?.map((teacher, idx) => (
                  <tr key={teacher._id || idx}>
                    <td>
                      <div className="teacher-info">
                        <div className="teacher-avatar">{getInitials(teacher.name)}</div>
                        <div className="teacher-details">
                          <h4>{teacher.name}</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ID: {teacher.employeeId || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td><strong>{teacher.department || 'N/A'}</strong></td>
                    <td>{teacher.email}</td>
                    <td><span className={`status-badge status-active`}>Active</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" title="Edit Record"><i className="fas fa-edit"></i></button>
                        <button 
                          className="btn-icon" 
                          title="Delete" 
                          onClick={() => handleDelete(teacher._id, teacher.name)}
                          disabled={deleteMutation.isLoading}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <span>Showing {teachers?.length || 0} entries</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTeachers;
