import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminAccessControl = () => {
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['adminRoles'],
    queryFn: () => adminApi.getRoles().then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, permissions }) => adminApi.updateRole(id, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminRoles']);
      toast.success('Permissions updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update permissions');
    }
  });

  const handleToggle = (role, permIdx) => {
    const updatedPermissions = [...role.permissions];
    updatedPermissions[permIdx].enabled = !updatedPermissions[permIdx].enabled;
    mutation.mutate({ id: role._id, permissions: updatedPermissions });
  };

  if (isLoading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px', color: 'var(--primary)' }}></i>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Role-Based Access Control</h1>
          <p>Define permissions for different staff roles across the system.</p>
        </div>
        <Link to="/admin/add-role" className="btn-primary"><i className="fas fa-plus"></i> Add New Role</Link>
      </div>

      <div className="role-grid">
        {roles?.map((role) => (
          <div className="role-card" key={role._id}>
            <div className="role-header">
              <div className="role-title"><i className={role.icon}></i> {role.title}</div>
              <span className="role-badge">{role.count}</span>
            </div>
            <div className="permission-list">
              {role.permissions.map((perm, pIdx) => (
                <div className="permission-item" key={pIdx}>
                  <span className="permission-name">{perm.name}</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={perm.enabled} 
                      onChange={() => handleToggle(role, pIdx)}
                      disabled={mutation.isLoading}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAccessControl;
