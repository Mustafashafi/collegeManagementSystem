import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { superAdminApi } from '../services/api';

const SuperAdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await superAdminApi.getActivity();
      if (data.success) {
        setActivities(data.activity || []);
      } else {
        setError('Failed to fetch activity logs.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

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

  // Filter logs based on search and type
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      (activity.description && activity.description.toLowerCase().includes(search.toLowerCase())) ||
      (activity.actor && activity.actor.toLowerCase().includes(search.toLowerCase())) ||
      (activity.institution && activity.institution.toLowerCase().includes(search.toLowerCase())) ||
      (activity.ipAddress && activity.ipAddress.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'ALL' || activity.eventType === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>System Activity Log</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Monitoring global configuration changes, provisions, and security events across all institutional instances.</p>
        </div>
        <button onClick={fetchActivityLogs} className="btn-icon" style={{ padding: '8px 12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }} disabled={loading}>
          <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i> Refresh Logs
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '280px', background: '#fff', padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-search" style={{ color: '#9ca3af', fontSize: '14px' }}></i>
          <input 
            type="text" 
            placeholder="Search activity by description, actor, institution or IP..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: '#111827' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CREATE', 'UPDATE', 'DELETE', 'SECURITY'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: filterType === type ? 'none' : '1px solid #e5e7eb',
                background: filterType === type ? '#1a1a1a' : '#fff',
                color: filterType === type ? '#fff' : '#4b5563',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="loading-spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1a1a1a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchActivityLogs} style={{ marginTop: '16px', background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          No system activities match your current query or type.
        </div>
      ) : (
        <div className="panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>INSTITUTION</th>
                  <th>USER / ACTOR</th>
                  <th>EVENT TYPE</th>
                  <th>DESCRIPTION</th>
                  <th>IP ADDRESS</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity, idx) => (
                  <tr key={activity._id || idx}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(activity.timestamp).toLocaleString()}</td>
                    <td><strong style={{ color: '#111827' }}>{activity.institution}</strong></td>
                    <td style={{ color: '#4b5563' }}>{activity.actor}</td>
                    <td>
                      <span className="badge-log" style={{ ...getLogBadgeStyle(activity.eventType), padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        {activity.eventType}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{activity.description}</td>
                    <td style={{ color: '#6b7280', fontSize: '12px' }}>{activity.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination" style={{ padding: '20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Showing {filteredActivities.length} of {activities.length} system logs</p>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminActivity;
