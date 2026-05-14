import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { API_BASE_URL } from '../config/api';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const TeacherResults = () => {
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [examTitle, setExamTitle] = useState('Mid-Term Exam (Oct 2026)');
  const [students, setStudents] = useState([]);
  const [resultsData, setResultsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPublishedGrades, setHasPublishedGrades] = useState(false);
  const [canUpload, setCanUpload] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // Check Permissions
        const permRes = await authApi.getPermissions('teacher');
        if (permRes.data.success) {
          const uploadPerm = permRes.data.permissions.find(p => p.name === 'Upload Results');
          if (uploadPerm && !uploadPerm.enabled) {
            setCanUpload(false);
          }
        }

        const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        const data = await response.json();
        if (response.ok) {
          setTeacher(data.teacher);

          // Derive unique classes from schedule (Subject + Program)
          const uniqueClasses = [];
          const seen = new Set();

          (data.fullSchedule || []).forEach(item => {
            const key = `${item.subject}|${item.program}|${item.year}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueClasses.push({
                subject: item.subject,
                program: item.program,
                year: item.year,
                label: `${item.subject} (${item.program})`
              });
            }
          });

          setClasses(uniqueClasses);
          if (uniqueClasses.length > 0) {
            setSelectedClass(uniqueClasses[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching teacher:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchTeacher();
  }, [user.email]);

  useEffect(() => {
    const fetchRosterAndResults = async () => {
      if (!selectedClass) return;
      try {
        const { program, subject, year } = selectedClass;

        // Fetch students
        const response = await fetch(`${API_BASE_URL}/api/teachers/students/${encodeURIComponent(program)}?subject=${encodeURIComponent(subject)}&year=${encodeURIComponent(year)}`);
        let data = await response.json();
        if (!Array.isArray(data)) data = [];
        setStudents(data);

        // Fetch existing results
        const resResponse = await fetch(`${API_BASE_URL}/api/results/class?subject=${encodeURIComponent(subject)}&examType=${encodeURIComponent(examTitle)}&program=${encodeURIComponent(program)}`);
        const existingResults = resResponse.ok ? await resResponse.json() : [];

        const resultMap = {};
        existingResults.forEach(r => {
          resultMap[r.studentEmail] = r;
        });

        // Initialize results data with existing grades if they exist
        const initial = {};
        let existingFound = false;
        data.forEach(s => {
          if (resultMap[s.email]) {
            initial[s.email] = { marks: resultMap[s.email].marksObtained, totalMarks: resultMap[s.email].totalMarks };
            existingFound = true;
          } else {
            initial[s.email] = { marks: 0, totalMarks: 100 };
          }
        });
        setResultsData(initial);
        setHasPublishedGrades(existingFound);
      } catch (err) {
        console.error('Error fetching roster or results:', err);
      }
    };
    fetchRosterAndResults();
  }, [selectedClass, examTitle]);

  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 85) return 'A-';
    if (marks >= 80) return 'B+';
    if (marks >= 75) return 'B';
    if (marks >= 70) return 'B-';
    if (marks >= 65) return 'C+';
    if (marks >= 60) return 'C';
    if (marks >= 55) return 'C-';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const handleMarksChange = (email, marks) => {
    setResultsData(prev => ({
      ...prev,
      [email]: { ...prev[email], marks: parseInt(marks) || 0 }
    }));
  };

  const publishGrades = async () => {
    setIsSaving(true);
    try {
      const records = Object.entries(resultsData).map(([email, info]) => ({
        studentEmail: email,
        examType: examTitle,
        subject: selectedClass?.subject,
        program: selectedClass?.program,
        marksObtained: info.marks,
        totalMarks: info.totalMarks,
        grade: calculateGrade(info.marks)
      }));

      const response = await fetch(`${API_BASE_URL}/api/results/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });

      if (response.ok) {
        toast.success('Grades published successfully!');
      } else {
        toast.error('Failed to publish grades');
      }
    } catch (err) {
      console.error('Error publishing grades:', err);
      toast.error('Connection error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h1>Manage Results & Grades</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Enter exam scores and generate result sheets.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={publishGrades} 
          disabled={isSaving || !canUpload}
          style={!canUpload ? { opacity: 0.5, cursor: 'not-allowed', background: '#9ca3af' } : {}}
        >
          <i className={!canUpload ? "fas fa-lock" : "fas fa-save"} style={{ marginRight: '8px' }}></i> 
          {!canUpload ? 'Uploading Disabled' : (isSaving ? 'Saving...' : (hasPublishedGrades ? 'Update Grades' : 'Publish Grades'))}
        </button>
      </div>

      <div className="controls-bar" style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div className="select-wrapper" style={{ position: 'relative' }}>
          <select
            value={selectedClass ? `${selectedClass.subject}|${selectedClass.program}|${selectedClass.year}` : ''}
            onChange={(e) => {
              const [subject, program, year] = e.target.value.split('|');
              setSelectedClass({ subject, program, year });
            }}
            style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '220px' }}
          >
            {classes.map((cls, i) => (
              <option key={i} value={`${cls.subject}|${cls.program}|${cls.year}`}>{cls.label}</option>
            ))}
          </select>
          <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '12px' }}></i>
        </div>
        <div className="select-wrapper" style={{ position: 'relative' }}>
          <select
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }}
          >
            <option>Mid-Term Exam (Oct 2026)</option>
            <option>Final Exam</option>
            <option>Class Test 1</option>
          </select>
          <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '12px' }}></i>
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Details</th>
              <th>Max Marks</th>
              <th>Marks Obtained</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((s, idx) => (
              <tr key={s._id}>
                <td><strong>{idx + 1}</strong></td>
                <td>
                  <div className="student-info" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="student-avatar" style={{ width: '32px', height: '32px', background: '#fef3c7', color: '#d97706', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div className="student-details">
                      <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{s.firstName} {s.lastName}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.studentId}</p>
                    </div>
                  </div>
                </td>
                <td>100</td>
                <td>
                  <input
                    type="number"
                    value={resultsData[s.email]?.marks}
                    onChange={(e) => handleMarksChange(s.email, e.target.value)}
                    className="grade-input"
                    disabled={!canUpload}
                    style={{ 
                      width: '80px', 
                      padding: '8px', 
                      border: '1px solid var(--border)', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      textAlign: 'center', 
                      outline: 'none',
                      background: !canUpload ? '#f3f4f6' : '#fff',
                      cursor: !canUpload ? 'not-allowed' : 'text'
                    }}
                  />
                </td>
                <td><strong>{calculateGrade(resultsData[s.email]?.marks || 0)}</strong></td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No students found to grade.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default TeacherResults;
