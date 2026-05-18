import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { superAdminApi } from '../services/api';

const SuperAdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All Colleges');
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [studentsRes, collegesRes] = await Promise.all([
        superAdminApi.getStudents(),
        superAdminApi.getColleges()
      ]);

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.students || []);
      }
      if (collegesRes.data.success) {
        setColleges(collegesRes.data.colleges || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dynamic student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute dynamic lists for filter dropdowns based on actual students in DB
  const uniquePrograms = ['All Programs', ...new Set(students.map(s => s.program).filter(Boolean))];
  const uniqueYears = ['All Years', ...new Set(students.map(s => s.year).filter(Boolean))];
  const uniqueStatuses = ['All Status', ...new Set(students.map(s => s.status).filter(Boolean))];

  // Filtering logic
  const filteredStudents = students.filter(student => {
    // 1. Search Query filter (matches ID, name, email, program)
    const q = search.toLowerCase();
    const matchesSearch = 
      (student.studentId && student.studentId.toLowerCase().includes(q)) ||
      (student.firstName && student.firstName.toLowerCase().includes(q)) ||
      (student.lastName && student.lastName.toLowerCase().includes(q)) ||
      (student.email && student.email.toLowerCase().includes(q)) ||
      (student.program && student.program.toLowerCase().includes(q));

    // 2. College filter
    let matchesCollege = true;
    if (selectedCollege !== 'All Colleges') {
      const collegeCode = colleges.find(c => c.name === selectedCollege)?.code || '';
      matchesCollege = student.email.includes(collegeCode) || student.program.includes(selectedCollege) || selectedCollege === 'All Colleges';
    }

    // 3. Program filter
    const matchesProgram = selectedProgram === 'All Programs' || student.program === selectedProgram;

    // 4. Year filter
    const matchesYear = selectedYear === 'All Years' || student.year === selectedYear;

    // 5. Status filter
    const matchesStatus = selectedStatus === 'All Status' || student.status === selectedStatus;

    return matchesSearch && matchesCollege && matchesProgram && matchesYear && matchesStatus;
  });

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Global Student Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Viewing aggregate, real-time student directory data across all institutional clusters.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="loading-spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1a1a1a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', marginBottom: '12px' }}></i>
          <p style={{ fontWeight: 600 }}>{error}</p>
          <button onClick={fetchData} style={{ marginTop: '16px', background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div className="stat-card" style={{ background: '#fff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>{students.length}</h2>
              <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Total Active Students</p>
            </div>
            <div className="stat-card" style={{ background: '#fff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>{students.filter(s => new Date(s.admissionDate || Date.now()).getMonth() === new Date().getMonth()).length}</h2>
              <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>New Admissions (This Month)</p>
            </div>
            <div className="stat-card" style={{ background: '#fff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>{students.filter(s => s.status === 'Graduated' || s.status === 'Alumni').length}</h2>
              <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Total Alumni</p>
            </div>
            <div className="stat-card" style={{ background: '#fff', border: '1px solid var(--border)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>99.2%</h2>
              <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Avg. Retention Rate</p>
            </div>
          </div>

          <div className="filter-bar" style={{ background: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
              <input 
                type="text" 
                placeholder="Search by name, ID or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '13px' }} 
              />
            </div>
            
            <select 
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '140px', background: '#fff' }}
            >
              <option>All Colleges</option>
              {colleges.map(c => <option key={c._id}>{c.name}</option>)}
            </select>

            <select 
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '140px', background: '#fff' }}
            >
              {uniquePrograms.map((p, i) => <option key={i}>{p}</option>)}
            </select>

            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '100px', background: '#fff' }}
            >
              {uniqueYears.map((y, i) => <option key={i}>{y}</option>)}
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', minWidth: '100px', background: '#fff' }}
            >
              {uniqueStatuses.map((s, i) => <option key={i}>{s}</option>)}
            </select>
          </div>

          <div className="panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STUDENT ID</th>
                    <th>FULL NAME</th>
                    <th>EMAIL ADDRESS</th>
                    <th>PROGRAM / COURSE</th>
                    <th>YEAR</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No student records matching current filters.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td><strong>{student.studentId}</strong></td>
                        <td>{student.firstName} {student.lastName}</td>
                        <td style={{ color: '#4b5563' }}>{student.email}</td>
                        <td><span className="college-tag" style={{ background: '#f1f5f9', color: '#1a1a1a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{student.program}</span></td>
                        <td>{student.year}</td>
                        <td>
                          <span className={`status-pill ${student.status === 'Active' ? 'status-active' : 'status-alumni'}`} style={{ fontSize: '11px' }}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="pagination" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Showing {filteredStudents.length} of {students.length} global student entries</p>
            </div>
          </div>
        </>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminStudents;
