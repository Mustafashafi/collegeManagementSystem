import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';

const SuperAdminActivity = () => (
  <SuperAdminLayout>
    <div className="page-header" style={{ marginBottom: '30px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800 }}>System Activity Log</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Monitoring global changes and security events across all clusters.</p>
    </div>

    <div className="panel">
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
          <tr>
            <td>Oct 24, 09:42 AM</td>
            <td><strong style={{ color: '#111827' }}>Skyra City College</strong></td>
            <td>Admin_Sarah</td>
            <td><span className="badge-log log-update" style={{ background: '#e0f2fe', color: '#0369a1' }}>UPDATE</span></td>
            <td>Modified global fee structure for 2027</td>
            <td style={{ color: '#4b5563' }}>192.168.1.45</td>
          </tr>
          <tr>
            <td>Oct 24, 08:15 AM</td>
            <td><strong style={{ color: '#111827' }}>Global System</strong></td>
            <td>GA_Master</td>
            <td><span className="badge-log log-security" style={{ background: '#fef3c7', color: '#92400e' }}>SECURITY</span></td>
            <td>Failed login attempt detected from unknown IP</td>
            <td style={{ color: '#4b5563' }}>45.78.221.12</td>
          </tr>
          <tr>
            <td>Oct 23, 11:20 PM</td>
            <td><strong style={{ color: '#111827' }}>Ivy Technical</strong></td>
            <td>Librarian_J</td>
            <td><span className="badge-log log-create" style={{ background: '#dcfce7', color: '#166534' }}>CREATE</span></td>
            <td>Batch upload: 500 new library records</td>
            <td style={{ color: '#4b5563' }}>10.0.0.122</td>
          </tr>
          <tr>
            <td>Oct 23, 04:55 PM</td>
            <td><strong style={{ color: '#111827' }}>Global System</strong></td>
            <td>GA_Master</td>
            <td><span className="badge-log log-delete" style={{ background: '#fee2e2', color: '#b91c1c' }}>DELETE</span></td>
            <td>Removed deprecated test college: 'Legacy Univ'</td>
            <td style={{ color: '#4b5563' }}>192.168.1.10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </SuperAdminLayout>
);

export default SuperAdminActivity;
