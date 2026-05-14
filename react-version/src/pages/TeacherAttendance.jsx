import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const TeacherAttendance = () => {
  const location = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [fullSchedule, setFullSchedule] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [canMark, setCanMark] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // Check Permissions
        const permRes = await authApi.getPermissions('teacher');
        if (permRes.data.success) {
          const markPerm = permRes.data.permissions.find(p => p.name === 'Mark Attendance');
          if (markPerm && !markPerm.enabled) {
            setCanMark(false);
          }
        }

        const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        const data = await response.json();
        if (response.ok) {
          setTeacher(data.teacher);
          setFullSchedule(data.fullSchedule || []);
          if (data.fullSchedule && data.fullSchedule.length > 0) {
            const initialClassId = location.state?.classId || data.fullSchedule[0]._id;
            setSelectedClassId(initialClassId);
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
    const fetchRoster = async () => {
      const selectedClass = fullSchedule.find(c => c._id === selectedClassId);
      if (!selectedClass) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/teachers/students/${selectedClass.program}?subject=${selectedClass.subject}&year=${selectedClass.year}`);
        const data = await response.json();
        setStudents(data);
        
        // Initialize attendance data
        const initial = {};
        data.forEach(s => {
          initial[s.email] = { status: 'Present', remarks: '' };
        });
        setAttendanceData(initial);
      } catch (err) {
        console.error('Error fetching roster:', err);
      }
    };
    fetchRoster();
  }, [selectedClassId, fullSchedule]);

  const handleStatusChange = (email, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [email]: { ...prev[email], status }
    }));
  };

  const handleRemarkChange = (email, remarks) => {
    setAttendanceData(prev => ({
      ...prev,
      [email]: { ...prev[email], remarks }
    }));
  };

  const saveAttendance = async () => {
    const selectedClass = fullSchedule.find(c => c._id === selectedClassId);
    if (!selectedClass) return;

    setIsSaving(true);
    try {
      const records = Object.entries(attendanceData).map(([email, info]) => ({
        studentEmail: email,
        status: info.status,
        remarks: info.remarks,
        subject: selectedClass.subject,
        teacher: teacher.name,
        date: selectedDate
      }));

      const response = await fetch(`${API_BASE_URL}/api/attendance/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });

      if (response.ok) {
        toast.success(`Attendance for ${selectedClass.subject} on ${selectedDate} saved!`);
      } else {
        toast.error('Failed to save attendance');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      toast.error('Connection error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h1>Mark Attendance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Record daily attendance for your assigned classes.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={saveAttendance} 
          disabled={isSaving || !canMark}
          style={!canMark ? { opacity: 0.5, cursor: 'not-allowed', background: '#9ca3af' } : {}}
        >
          <i className={!canMark ? "fas fa-lock" : "fas fa-save"} style={{ marginRight: '8px' }}></i> 
          {!canMark ? 'Attendance Disabled' : (isSaving ? 'Saving...' : 'Save Attendance')}
        </button>
      </div>

      <div className="controls-bar" style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="select-group" style={{ display: 'flex', gap: '16px' }}>
          <div className="select-wrapper" style={{ position: 'relative' }}>
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '300px' }}
            >
              {fullSchedule.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.subject} ({cls.program}) - {cls.year} - {cls.day}</option>
              ))}
            </select>
            <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '12px' }}></i>
          </div>
        </div>
        <input 
          type="date" 
          className="date-picker" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ background: '#f3f4f6', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
        />
      </div>

      <div className="panel">
        <div className="panel-header" style={{ background: '#f9fafb' }}>
          <h3>Class Roster ({students.length} Students)</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Details</th>
              <th>Status (Present / Absent / Late)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((s, idx) => (
              <tr key={s._id}>
                <td><strong>{idx + 1}</strong></td>
                <td>
                  <div className="student-info" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="student-avatar" style={{ width: '32px', height: '32px', background: '#f0f4ff', color: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div className="student-details">
                      <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{s.firstName} {s.lastName}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.studentId}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="attendance-radios" style={{ display: 'flex', gap: '10px' }}>
                    {['Present', 'Absent', 'Late'].map(status => (
                      <label key={status} style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: attendanceData[s.email]?.status === status ? '#1a1a1a' : '#f3f4f6',
                        color: attendanceData[s.email]?.status === status ? '#fff' : '#4b5563',
                        transition: '0.2s'
                      }}>
                        <input 
                          type="radio" 
                          name={`att_${s._id}`} 
                          value={status} 
                          checked={attendanceData[s.email]?.status === status}
                          onChange={() => handleStatusChange(s.email, status)}
                          style={{ display: 'none' }}
                        /> {status[0]}
                      </label>
                    ))}
                  </div>
                </td>
                <td>
                  <input 
                    type="text" 
                    value={attendanceData[s.email]?.remarks || ''}
                    onChange={(e) => handleRemarkChange(s.email, e.target.value)}
                    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', fontSize: '12px', outline: 'none' }} 
                    placeholder="Optional remark..." 
                  />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No students found in this program.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAttendance;
