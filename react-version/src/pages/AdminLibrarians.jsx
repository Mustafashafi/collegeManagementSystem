import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLibrarians = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: librarians, isLoading } = useQuery({
    queryKey: ['librarians'],
    queryFn: () => adminApi.getLibrarians().then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteLibrarian(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['librarians']);
      toast.success('Librarian removed successfully');
    },
    onError: () => toast.error('Failed to remove librarian')
  });

  const filteredLibrarians = librarians?.filter(lib => 
    lib.name?.toLowerCase().includes(search.toLowerCase()) || 
    lib.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Librarian Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage library staff and their system access.</p>
        </div>
        <Link to="/admin/add-librarian" className="btn-primary" style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
          <i className="fas fa-plus"></i> Add Librarian
        </Link>
      </div>

      <div className="filter-bar" style={{ marginBottom: '20px' }}>
        <div className="search-input" style={{ maxWidth: '400px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
          <input 
            type="text" 
            placeholder="Search librarians by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      <div className="panel" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Staff Name & Info</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Role</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Joined Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', background: '#f9fafb', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
              ) : filteredLibrarians?.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No librarians found.</td></tr>
              ) : filteredLibrarians?.map((staff) => (
                <tr key={staff._id}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <div className="student-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="student-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                        {staff.name?.charAt(0)}
                      </div>
                      <div className="student-details">
                        <h4 style={{ margin: 0, fontSize: '13px' }}>{staff.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>Librarian</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>{new Date(staff.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Active</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
                    <div className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => { if(window.confirm('Remove this librarian?')) deleteMutation.mutate(staff._id) }}
                        className="btn-icon" 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }} 
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
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

export default AdminLibrarians;
