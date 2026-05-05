import React from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';

const SuperAdminStudents = () => (
  <SuperAdminLayout>
    <div className="page-header" style={{ marginBottom: '30px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Global Student Overview</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Viewing aggregate student data across all registered institutions.</p>
    </div>

    <div className="stats-row" style={{ marginBottom: '40px' }}>
      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>38,420</h2>
        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>Total Active Students</p>
      </div>
      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>1,250</h2>
        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>New Admissions (This Month)</p>
      </div>
      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>15,800</h2>
        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>Total Alumni</p>
      </div>
      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>98%</h2>
        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>Avg. Retention Rate</p>
      </div>
    </div>

    <div className="filter-bar" style={{ background: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
        <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
        <input type="text" placeholder="Search by name or ID..." style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '13px' }} />
      </div>
      
      <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '140px', background: '#fff' }}>
        <option>All Colleges</option>
      </select>
      <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '140px', background: '#fff' }}>
        <option>All Programs</option>
      </select>
      <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '140px', background: '#fff' }}>
        <option>All Departments</option>
      </select>
      <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '100px', background: '#fff' }}>
        <option>All Years</option>
      </select>
      <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '100px', background: '#fff' }}>
        <option>All Status</option>
      </select>
    </div>

    <div className="panel" style={{ overflow: 'hidden' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>STUDENT ID</th>
            <th>FULL NAME</th>
            <th>INSTITUTION</th>
            <th>PROGRAM / COURSE</th>
            <th>YEAR</th>
            <th>STATUS</th>
            <th style={{ textAlign: 'center' }}>VIEW</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: '#ST-9942', name: 'Johnathan Doe', inst: 'Skyra City College', prog: 'B.Sc Computer Science', year: '3rd Year', status: 'Active' },
            { id: '#ST-8821', name: 'Emily Williams', inst: 'Ivy Technical', prog: 'Diploma in Engineering', year: '2nd Year', status: 'Active' },
            { id: '#ST-7734', name: 'Michael Chen', inst: 'Skyra City College', prog: 'M.BA Business Admin', year: 'Alumni', status: 'Alumni' },
            { id: '#ST-6652', name: 'Sarah Jenkins', inst: 'Global Heights', prog: 'B.A Psychology', year: '1st Year', status: 'Active' },
            { id: '#ST-5541', name: 'Robert Brown', inst: 'Ivy Technical', prog: 'Civil Engineering', year: '4th Year', status: 'Active' },
          ].map((student, idx) => (
            <tr key={idx}>
              <td><strong>{student.id}</strong></td>
              <td>{student.name}</td>
              <td><span className="college-tag">{student.inst}</span></td>
              <td>{student.prog}</td>
              <td>{student.year}</td>
              <td>
                <span className={`status-pill ${student.status === 'Active' ? 'status-active' : 'status-alumni'}`} style={{ fontSize: '11px' }}>
                  {student.status}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#111827', fontSize: '16px' }}>
                  <i className="far fa-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <p>Showing 1 to 5 of 2,450 entries</p>
        <div className="page-numbers">
          <button className="page-num"><i className="fas fa-chevron-left"></i></button>
          <button className="page-num active">1</button>
          <button className="page-num">2</button>
          <button className="page-num">3</button>
          <span style={{ color: '#9ca3af' }}>...</span>
          <button className="page-num">245</button>
          <button className="page-num"><i className="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
);

export default SuperAdminStudents;
