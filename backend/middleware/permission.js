const Role = require('../models/Role');

/**
 * Middleware to check if a specific permission is enabled for a role.
 * @param {string} roleTitle - The role to check (e.g., 'Student', 'Teacher')
 * @param {string} permissionName - The permission name to verify
 */
const checkPermission = (roleTitle, permissionName) => {
  return async (req, res, next) => {
    try {
      // Find the role document (case-insensitive)
      const role = await Role.findOne({ title: new RegExp('^' + roleTitle + '$', 'i') });
      
      // If the role exists in our RBAC system, check the specific permission
      if (role) {
        const perm = role.permissions.find(p => p.name === permissionName);
        if (perm && !perm.enabled) {
          return res.status(403).json({
            success: false,
            msg: `Access Denied: The '${permissionName}' feature is currently disabled for ${roleTitle}s.`
          });
        }
      }
      
      // If role doesn't exist or permission is enabled, proceed
      next();
    } catch (err) {
      console.error(`Permission check error (${roleTitle} -> ${permissionName}):`, err);
      res.status(500).json({ success: false, msg: 'Internal server error during authorization.' });
    }
  };
};

module.exports = checkPermission;
