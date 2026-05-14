import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api';

const PermissionGuard = ({ role, permissionName, children, fallback = null }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const res = await authApi.getPermissions(role);
        if (res.data.success) {
          const perm = res.data.permissions.find(p => p.name === permissionName);
          setHasPermission(!!perm?.enabled);
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        console.error(`Permission check failed for ${permissionName}:`, err);
        setHasPermission(false);
      }
    };
    checkPermission();
  }, [role, permissionName]);

  if (hasPermission === null) return null; // Or a loader
  if (!hasPermission) return fallback;

  return <>{children}</>;
};

export default PermissionGuard;
