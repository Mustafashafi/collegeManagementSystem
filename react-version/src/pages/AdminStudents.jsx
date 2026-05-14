import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminStudents = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  const { data: filters } = useQuery({
    queryKey: ['adminFilters'],
    queryFn: () => adminApi.getFilters().then(res => res.data),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminStudents', page, search, program, year, status],
    queryFn: () => adminApi.getStudents({ page, limit: 7, search, program, year, status }).then(res => res.data),
    keepPreviousData: true,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminStudents']);
      toast.success('Student deleted permanently');
    },
    onError: () => toast.error('Failed to delete student')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminStudents']);
      toast.success('Student updated successfully');
      setEditingStudent(null);
    },
    onError: (err) => toast.error(err.response?.data?.msg || 'Update failed')
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: editingStudent._id, data: editingStudent });
  };

  const students = data?.students || [];
  const totalEntries = data?.totalEntries || 0;
  const totalPages = data?.totalPages || 1;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Student Directory</h1>
          <p>Manage and view all enrolled student records across all departments.</p>
        </div>
        <Link to="/admin/add-student" className="btn-primary"><i className="fas fa-plus"></i> Add New Student</Link>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search by name, ID, email..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="select-wrapper">
          <select value={program} onChange={(e) => { setProgram(e.target.value); setPage(1); }}>
            <option value="">All Programs</option>
            {filters?.programs?.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
        <div className="select-wrapper">
          <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }}>
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
        <div className="select-wrapper">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      <div className="panel">
        {isLoading ? (
          <div className="loading-state" style={{ padding: '40px', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--primary)' }}></i>
            <p>Loading student records...</p>
          </div>
        ) : isError ? (
          <div className="error-state" style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '24px' }}></i>
            <p>Error loading students. Please check your connection.</p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name & ID</th>
                  <th>Program & Year</th>
                  <th>Contact Info</th>
                  <th>Guardian Details</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No students found matching your criteria.</td>
                  </tr>
                ) : students.map((student, idx) => (
                  <tr key={student._id || idx}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">{getInitials(`${student.firstName} ${student.lastName}`)}</div>
                        <div className="student-details">
                          <h4>{student.firstName} {student.lastName}</h4>
                          <p>ID: {student.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{student.program}</strong><br />
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{student.year}</span>
                    </td>
                    <td>
                      {student.email}<br />
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{student.phone}</span>
                    </td>
                    <td>
                      {student.fatherName || 'Not Linked'}<br />
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{student.parentEmail || 'No Portal'}</span>
                    </td>
                    <td><span className={`status-badge ${student.status === 'Active' ? 'status-active' : 'status-inactive'}`}>{student.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon" 
                          title="Edit Profile" 
                          style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => setEditingStudent(student)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Delete Permanently" 
                          style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
                          onClick={() => handleDelete(student._id)}
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
              <span>Showing {(page - 1) * 7 + 1} to {Math.min(page * 7, totalEntries)} of {totalEntries} entries</span>
              <div className="page-numbers">
                <div className={`page-num ${page === 1 ? 'disabled' : ''}`} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  <i className="fas fa-chevron-left"></i>
                </div>
                {[...Array(totalPages)].map((_, i) => (
                  <div 
                    key={i + 1} 
                    className={`page-num ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </div>
                ))}
                <div className={`page-num ${page === totalPages ? 'disabled' : ''}`} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Edit Student & Parent Details</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" value={editingStudent.firstName} onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" value={editingStudent.lastName} onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={editingStudent.email} onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" className="form-control" value={editingStudent.phone} onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})} />
                </div>
                
                <h4 style={{ gridColumn: 'span 2', fontSize: '14px', fontWeight: 700, marginTop: '15px', color: 'var(--primary)' }}>Guardian Linkage</h4>
                <div className="form-group">
                  <label>Father's Name</label>
                  <input type="text" className="form-control" placeholder="Enter Father's Name" value={editingStudent.fatherName || ''} onChange={(e) => setEditingStudent({...editingStudent, fatherName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Parent Email (Auto-Portal)</label>
                  <input type="email" className="form-control" placeholder="parent@example.com" value={editingStudent.parentEmail || ''} onChange={(e) => setEditingStudent({...editingStudent, parentEmail: e.target.value})} />
                </div>
              </div>
              
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-cancel" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
