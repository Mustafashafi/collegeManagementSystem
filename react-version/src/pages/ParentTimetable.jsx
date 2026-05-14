import React, { useState, useEffect } from 'react';
import { parentApi, studentApi } from '../services/api';
import toast from 'react-hot-toast';

const ParentTimetable = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
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
    const fetchTimetable = async () => {
      if (!selectedChild) return;
      try {
        const response = await studentApi.getTimetable(selectedChild.program, selectedChild.year);
        // Sort timetable slots by time if possible, or just keep them grouped by day
        setTimetable(response.data || []);
      } catch (err) {
        toast.error("Failed to load schedule");
      }
    };
    fetchTimetable();
  }, [selectedChild]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  if (loading) return (
    <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)' }}></i>
    </div>
  );

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>Academic Schedule</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Monitor {selectedChild?.firstName}'s weekly class routines and lecture timings.</p>
      </div>

      {/* Child Switcher */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '12px' }}>
        {children.map(child => (
          <button 
            key={child._id} 
            onClick={() => setSelectedChild(child)}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '30px', 
              background: selectedChild?._id === child._id ? 'var(--primary)' : '#fff',
              color: selectedChild?._id === child._id ? '#fff' : '#4b5563',
              border: '1px solid',
              borderColor: selectedChild?._id === child._id ? 'var(--primary)' : '#e5e7eb',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: '0.2s',
              boxShadow: selectedChild?._id === child._id ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <i className="fas fa-user-circle" style={{ marginRight: '8px' }}></i>
            {child.firstName} {child.lastName}
          </button>
        ))}
      </div>

      {/* Structured Timetable Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {days.map(day => {
          const daySlots = timetable.filter(t => t.day === day);
          const isToday = day === currentDay;

          return (
            <div 
              key={day} 
              style={{ 
                background: '#fff', 
                borderRadius: '16px', 
                border: isToday ? '2px solid var(--primary)' : '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: isToday ? '0 20px 25px -5px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <div style={{ 
                background: isToday ? 'var(--primary)' : '#f9fafb', 
                padding: '16px 20px', 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 800, 
                  color: isToday ? '#fff' : '#111827',
                  margin: 0
                }}>
                  {day}
                </h3>
                {isToday && <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Today</span>}
              </div>

              <div style={{ padding: '16px' }}>
                {daySlots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af' }}>
                    <i className="fas fa-calendar-day" style={{ fontSize: '24px', opacity: 0.3, marginBottom: '10px', display: 'block' }}></i>
                    <p style={{ fontSize: '13px', fontStyle: 'italic' }}>No lectures scheduled</p>
                  </div>
                ) : (
                  daySlots.map((slot, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        background: '#f8fafc', 
                        border: '1px solid #f1f5f9',
                        marginBottom: idx === daySlots.length - 1 ? 0 : '12px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{slot.subject}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>
                            <i className="far fa-clock"></i>
                            {slot.time}
                          </div>
                        </div>
                        <div style={{ background: '#fff', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                          RM {slot.room}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                          <i className="fas fa-user-tie"></i>
                        </div>
                        <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>{slot.teacher}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParentTimetable;
