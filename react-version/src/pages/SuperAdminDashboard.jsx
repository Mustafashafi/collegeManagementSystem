import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { NavLink } from 'react-router-dom';
import { superAdminApi } from '../services/api';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    dataUsage: '0 GB',
    uptime: '100%'
  });
  const [topPerforming, setTopPerforming] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await superAdminApi.getDashboard();
      if (data.success) {
        setStats(data.stats);
        setTopPerforming(data.topPerforming || []);
        setRecentActivity(data.recentActivity || []);
      } else {
        setError('Failed to fetch platform metrics.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch (err) {
      return 'Recent';
    }
  };

  const getLogBadgeStyle = (type) => {
    switch (type) {
      case 'CREATE':
        return { background: '#dcfce7', color: '#166534' };
      case 'UPDATE':
        return { background: '#e0f2fe', color: '#0369a1' };
      case 'DELETE':
        return { background: '#fee2e2', color: '#b91c1c' };
      case 'SECURITY':
        return { background: '#fef3c7', color: '#92400e' };
      default:
        return { background: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Network Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Real-time statistics across all clusters & instances.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="loading-spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1a1a1a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '40px', marginBottom: '16px' }}></i>
          <p style={{ fontWeight: 600, fontSize: '16px' }}>{error}</p>
          <button onClick={fetchDashboardData} style={{ marginTop: '16px', background: '#1a1a1a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '40px' }}>
            <div className="stat-card">
              <div className="stat-icon blue" style={{ marginBottom: '10px' }}><i className="fas fa-university"></i></div>
              <div className="stat-val">{stats.totalInstitutions}</div>
              <div className="stat-label">Total Institutions</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple" style={{ marginBottom: '10px' }}><i className="fas fa-users"></i></div>
              <div className="stat-val">{(stats.totalStudents / 1000).toFixed(1)}k</div>
              <div className="stat-label">Total Students (Global)</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green" style={{ marginBottom: '10px' }}><i className="fas fa-database"></i></div>
              <div className="stat-val">{stats.dataUsage}</div>
              <div className="stat-label">Data Usage</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange" style={{ marginBottom: '10px' }}><i className="fas fa-clock"></i></div>
              <div className="stat-val">{stats.uptime}</div>
              <div className="stat-label">System Uptime</div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: '40px' }}>
            <div className="panel-header" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Registered Institutions</h3>
              <NavLink to="/super-admin/colleges" style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>Manage All</NavLink>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>INSTITUTION NAME</th>
                    <th>LOCATION</th>
                    <th>ACTIVE USERS</th>
                    <th>SUBSCRIPTION</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerforming.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>No institutions registered yet.</td>
                    </tr>
                  ) : (
                    topPerforming.map((inst) => (
                      <tr key={inst._id}>
                        <td>
                          <div className="inst-name">
                            <div className="inst-logo" style={{ background: '#f1f5f9', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>
                              {inst.name ? inst.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'IN'}
                            </div>
                            <strong style={{ fontSize: '14px', marginLeft: '10px' }}>{inst.name}</strong>
                          </div>
                        </td>
                        <td style={{ color: '#4b5563' }}>{inst.location}</td>
                        <td style={{ fontWeight: 500 }}>{inst.totalUsers.toLocaleString()}</td>
                        <td style={{ color: '#4b5563' }}>{inst.subscription.split(' ')[0]}</td>
                        <td>
                          <span className={`status-pill ${inst.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                            {inst.status}
                          </span>
                        </td>
                        <td>
                          <NavLink to="/super-admin/colleges" className="btn-view" style={{ fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Manage</NavLink>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent System Activity</h3>
            </div>
            <div style={{ padding: '24px' }}>
              {recentActivity.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>No recent activity logs.</p>
              ) : (
                recentActivity.map((activity, idx) => (
                  <div key={activity._id || idx} style={{ display: 'flex', gap: '16px', marginBottom: idx !== recentActivity.length - 1 ? '24px' : '0px', paddingBottom: idx !== recentActivity.length - 1 ? '24px' : '0px', borderBottom: idx !== recentActivity.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activity.eventType === 'CREATE' ? '#22c55e' : activity.eventType === 'DELETE' ? '#ef4444' : '#3b82f6', marginTop: '6px' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{activity.description}</p>
                        <span className="badge-log" style={{ ...getLogBadgeStyle(activity.eventType), padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>{activity.eventType}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        Admin: {activity.actor} | Institution: {activity.institution} | IP: {activity.ipAddress} | {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
