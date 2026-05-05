import React from 'react';
import TeacherLayout from '../components/TeacherLayout';

const TeacherClasses = () => {
  const classes = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      info: 'B.Sc Computer Science - 2nd Year (Morning)',
      icon: 'fa-code',
      studentCount: 45
    },
    {
      id: 2,
      title: 'Database Management',
      info: 'B.Sc Computer Science - 3rd Year (Evening)',
      icon: 'fa-database',
      studentCount: 40
    },
    {
      id: 3,
      title: 'Software Engineering',
      info: 'B.Sc Computer Science - 4th Year (Afternoon)',
      icon: 'fa-cog',
      studentCount: 40
    }
  ];

  return (
    <TeacherLayout>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>My Assigned Classes</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Manage students and academic records for your courses.</p>
      </div>
      
      <div className="class-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {classes.map((item) => (
          <div className="class-card" key={item.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: '0.2s' }}>
            <div className="class-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div className="class-icon" style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#111827', border: '1px solid #f1f5f9' }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <span className="student-count" style={{ fontSize: '11px', color: '#9ca3af', background: '#f3f4f6', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                {item.studentCount} Students
              </span>
            </div>
            
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{item.title}</h3>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>{item.info}</p>
            
            <div className="class-footer" style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}>
                View Roster
              </button>
              <button className="btn-outline" style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}>
                Mark Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </TeacherLayout>
  );
};

export default TeacherClasses;
