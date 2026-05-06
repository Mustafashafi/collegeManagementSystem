import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Clear session on mount to handle logouts properly
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const roleRoutes = {
    superadmin: '/super-admin/dashboard',
    admin: '/admin',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
    librarian: '/librarian/dashboard',
    crm: '/crm',
    parent: '/parent/dashboard',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(roleRoutes[data.user.role] || '/admin');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'superadmin', label: 'Super Admin' },
    { id: 'admin', label: 'Admin' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'student', label: 'Student' },
    { id: 'librarian', label: 'Librarian' },
    { id: 'crm', label: 'CRM Staff' },
    { id: 'parent', label: 'Parent' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1,
        backgroundColor: '#141933',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px'
      }}>
        <div style={{ maxWidth: '400px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1f264d',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            🎓
          </div>

          <h1 style={{ marginBottom: '15px' }}>College Management System</h1>

          <p style={{ opacity: 0.8, marginBottom: '20px' }}>
            An integrated platform for managing academics,
            administration, admissions, and relationships — all in one place.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
            <li style={{ marginBottom: '10px' }}>✔ Complete Academic & Administrative Management</li>
            <li style={{ marginBottom: '10px' }}>✔ Admission Pipeline from Inquiry to Enrollment</li>
            <li style={{ marginBottom: '10px' }}>✔ Real-time Communication & Notifications</li>
            <li style={{ marginBottom: '10px' }}>✔ Comprehensive Reports & Analytics</li>
            <li style={{ marginBottom: '10px' }}>✔ Role-Based Access for All Stakeholders</li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        backgroundColor: '#f4f6fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '380px' }}>

          <h2 style={{ marginBottom: '5px' }}>Welcome Back</h2>
          <p style={{ fontSize: '14px', color: 'gray', marginBottom: '20px' }}>
            Select your role and sign in to continue
          </p>

          {/* Role Selector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: role === r.id ? 'none' : '1px solid #ddd',
                  backgroundColor: role === r.id ? '#141933' : 'white',
                  color: role === r.id ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffe0e0',
              color: 'red',
              padding: '8px',
              borderRadius: '6px',
              marginBottom: '10px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px' }}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginTop: '5px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '13px' }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginTop: '5px'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '15px'
            }}>
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span style={{ cursor: 'pointer' }}>Forgot Password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#141933',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: '20px',
            fontSize: '12px',
            textAlign: 'center',
            color: 'gray'
          }}>
            © 2026 College ERP & CRM System
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;