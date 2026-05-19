import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { superAdminApi } from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminAccess = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await superAdminApi.getRoles();
      if (data.success) {
        setRoles(data.roles || []);
      } else {
        setError('Failed to fetch role directory.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleTogglePermission = (roleIdx, permIdx) => {
    setRoles(prevRoles => {
      const updatedRoles = [...prevRoles];
      const role = { ...updatedRoles[roleIdx] };
      const permissions = [...role.permissions];
      permissions[permIdx] = {
        ...permissions[permIdx],
        enabled: !permissions[permIdx].enabled
      };
      role.permissions = permissions;
      updatedRoles[roleIdx] = role;
      return updatedRoles;
    });
  };

  const handleSavePermissions = async (role) => {
    try {
      toast.loading(`Saving permissions for ${role.title}...`, { id: 'savePerm' });
      const { data } = await superAdminApi.updateRole(role._id, { permissions: role.permissions });
      if (data.success) {
        toast.success(`Access level configuration for "${role.title}" updated successfully!`, { id: 'savePerm' });
      } else {
        toast.error(data.message || 'Failed to update access level.', { id: 'savePerm' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error updating role configuration.', { id: 'savePerm' });
    }
  };

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Global Access Levels</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Define default feature authorization schemas and global system controls for institutional roles.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="loading-spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1a1a1a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchRoles} style={{ marginTop: '16px', background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      ) : (
        <div className="access-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
          {roles.map((role, roleIdx) => (
            <div className="access-card" key={role._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f1f5f9', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  <i className={role.icon || 'fas fa-user'}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>{role.title}</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>RBAC System Role</p>
                </div>
              </div>

              <div className="perm-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                {role.permissions.map((perm, permIdx) => (
                  <div className="perm-item" key={perm._id || permIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="perm-name" style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{perm.name}</span>
                    
                    {/* Toggle Switch */}
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                      <input 
                        type="checkbox" 
                        checked={perm.enabled} 
                        onChange={() => handleTogglePermission(roleIdx, permIdx)}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: perm.enabled ? '#22c55e' : '#d1d5db',
                        borderRadius: '12px',
                        transition: 'background-color 0.3s',
                        display: 'block'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '18px',
                          width: '18px',
                          left: perm.enabled ? '23px' : '3px',
                          top: '3px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          transition: 'left 0.3s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                          display: 'block'
                        }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSavePermissions(role)} 
                className="btn-save"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                Update Permissions
              </button>
            </div>
          ))}
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminAccess;
