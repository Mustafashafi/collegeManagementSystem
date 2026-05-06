import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const location = useLocation();

  if (!token || !userString) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userString);

  // If roles are specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have the right role, redirect to a default safe page or login
    // Usually, redirecting to their own dashboard is better if they are logged in
    const roleRoutes = {
      superadmin: '/super-admin/dashboard',
      admin: '/admin',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
      librarian: '/librarian/dashboard',
      crm: '/crm',
      parent: '/parent/dashboard',
    };
    
    return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;