import React, { useState, useEffect } from 'react';
import { parentApi, studentApi } from '../services/api';
import toast from 'react-hot-toast';

const ParentAcademic = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [results, setResults] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentApi.getChildren(user.email);
        const students = response.data.students || [];
        setChildren(students);
        if (students.length > 0) setSelectedChild(students[0]);
      } catch (err) {
        toast.error("Failed to fetch family members");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchChildren();
  }, [user.email]);

  useEffect(() => {
    const fetchAcademicData = async () => {
      if (!selectedChild) return;
      try {
        const [resResponse, ttResponse] = await Promise.all([
          parentApi.getStudent360(selectedChild.studentId),
          studentApi.getTimetable(selectedChild.program, selectedChild.year)
        ]);
        
        setResults(resResponse.data.results || []);
        setTimetable(ttResponse.data || []);
      } catch (err) {
        toast.error("Failed to load academic records");
      }
    };
    fetchAcademicData();
  }, [selectedChild]);

  // GPA Calculation Logic (Mirrors Student Portal)
  const uniqueEnrolledSubjects = new Set(timetable.map(t => t.subject)).size;
  const uniqueGradedSubjects = new Set(results.map(r => r.subject)).size;

  const gradePoints = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
  const totalPoints = results.reduce((acc, r) => acc + (gradePoints[r.grade] || 0), 0);
  
  const gpa = (uniqueEnrolledSubjects > 0 && uniqueGradedSubjects >= uniqueEnrolledSubjects) 
    ? (totalPoints / results.length).toFixed(2) 
    : 'Pending';

  if (loading) return <div className="dashboard-content" style={{ textAlign: 'center', padding: '100px' }}><i className="fas fa-spinner fa-spin"></i></div>;

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Academic Performance & Grades</h1>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>Official transcripts and examination records for your children.</p>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '12px' }}>
        {children.map(child => (
          <button 
            key={child._id} 
            onClick={() => setSelectedChild(child)}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '30px', 
              background: selectedChild?._id === child._id ? 'var(--primary)' : '#fff',
              color: selectedChild?._id === child._id ? '#fff' : '#1a1a1a',
              border: '1px solid #e5e7eb',
              fontWeight: 600,
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {child.firstName}
          </button>
        ))}
      </div>

      <div className="result-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Examination Transcript</h3>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>{selectedChild?.firstName} {selectedChild?.lastName} • {selectedChild?.studentId}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current GPA</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: gpa === 'Pending' ? '#9ca3af' : 'var(--primary)' }}>{gpa}</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ background: '#f9fafb', padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Subject</th>
                <th style={{ background: '#f9fafb', padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Exam Type</th>
                <th style={{ background: '#f9fafb', padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Score</th>
                <th style={{ background: '#f9fafb', padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontStyle: 'italic' }}>No official results published yet for this session.</td></tr>
              ) : results.map((res, idx) => (
                <tr key={idx} style={{ transition: '0.2s' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' }}><strong>{res.subject}</strong></td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', borderBottom: '1px solid #f3f4f6' }}>{res.examType}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' }}>{res.marksObtained} <span style={{ color: '#9ca3af', fontSize: '12px' }}>/ {res.totalMarks}</span></td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ 
                      fontWeight: 800, 
                      color: res.grade === 'F' ? '#ef4444' : '#111827',
                      background: res.grade === 'F' ? '#fef2f2' : '#f8fafc',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {res.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {gpa !== 'Pending' && (
          <div style={{ marginTop: '32px', padding: '20px', background: 'linear-gradient(to right, #f8fafc, #fff)', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Subjects Enrolled</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{uniqueEnrolledSubjects}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Subjects Graded</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{uniqueGradedSubjects}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Institutional Honors Status</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                {parseFloat(gpa) >= 3.5 ? '✨ Distinction List' : parseFloat(gpa) >= 3.0 ? '✓ Satisfactory' : 'Under Review'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentAcademic;
