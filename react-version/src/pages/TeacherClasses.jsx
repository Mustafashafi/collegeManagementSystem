import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const TeacherClasses = () => {
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        const data = await response.json();
        if (response.ok) {
          setTeacher(data.teacher);
          // Derive unique classes from schedule (Program + Subject)
          const uniqueClasses = [];
          const seen = new Set();
          
          (data.fullSchedule || []).forEach(item => {
            const key = `${item.program}-${item.subject}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueClasses.push(item);
            }
          });
          
          setClasses(uniqueClasses);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchData();
  }, [user.email]);

  const icons = ['fa-code', 'fa-database', 'fa-cog', 'fa-microchip', 'fa-chart-line', 'fa-book'];

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>My Assigned Classes</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Manage students and academic records for your courses.</p>
      </div>
      
      {loading ? (
        <div style={{ padding: '50px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i></div>
      ) : (
        <div className="class-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {classes.map((cls, idx) => (
            <div className="class-card" key={idx} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: '0.2s' }}>
              <div className="class-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
                <div className="class-icon" style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#111827', border: '1px solid #f1f5f9' }}>
                  <i className={`fas ${icons[idx % icons.length]}`}></i>
                </div>
                <span className="student-count" style={{ fontSize: '11px', color: '#3b82f6', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                  {cls.year}
                </span>
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{cls.subject}</h3>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Program: {cls.program}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>Assigned Faculty: {teacher.name}</p>
              
              <div className="class-footer" style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn-outline" 
                  onClick={() => navigate('/teacher/attendance', { state: { classId: cls._id } })}
                  style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}
                >
                  View Roster
                </button>
                <button 
                  className="btn-outline" 
                  onClick={() => navigate('/teacher/attendance', { state: { classId: cls._id } })}
                  style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherClasses;
