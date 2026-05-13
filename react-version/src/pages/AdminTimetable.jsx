import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const AdminTimetable = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '09:00 AM - 10:00 AM',
    subject: '',
    teacher: '',
    room: ''
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    fetchPrograms();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedProgram && selectedYear) {
      fetchTimetable();
    } else {
      setTimetable([]);
    }
  }, [selectedProgram, selectedYear]);

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/programs`);
      const data = await res.json();
      setPrograms(data);
      if (data.length > 0) {
        setSelectedProgram(data[0].name);
        setSelectedYear(data[0].year);
      }
    } catch (err) {
      toast.error('Failed to fetch programs');
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/teachers`);
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      toast.error('Failed to fetch teachers');
    }
  };

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/timetable?program=${encodeURIComponent(selectedProgram)}&year=${encodeURIComponent(selectedYear)}`);
      const data = await res.json();
      setTimetable(data);
    } catch (err) {
      toast.error('Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/timetable/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Time slot deleted");
        fetchTimetable();
      } else {
        toast.error("Failed to delete time slot");
      }
    } catch (err) {
      toast.error("Error deleting time slot");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedYear) {
      return toast.error("Please select a program and year first");
    }
    try {
      const payload = {
        ...formData,
        program: selectedProgram,
        year: selectedYear
      };
      const res = await fetch(`${API_BASE_URL}/api/admin/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Time slot added");
        setIsModalOpen(false);
        fetchTimetable();
      } else {
        toast.error("Failed to add time slot");
      }
    } catch (err) {
      toast.error("Error adding time slot");
    }
  };

  const uniquePrograms = [...new Set(programs.map(p => p.name))];
  const availableYears = programs.filter(p => p.name === selectedProgram).map(p => p.year);

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Timetable Management</h1>
          <p>Design and configure the weekly schedule for classes.</p>
        </div>
      </div>

      <div className="controls-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="select-wrapper">
            <select className="form-control" value={selectedProgram} onChange={(e) => {
              setSelectedProgram(e.target.value);
              const matchingYears = programs.filter(p => p.name === e.target.value).map(p => p.year);
              setSelectedYear(matchingYears[0] || '');
            }}>
              {uniquePrograms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="select-wrapper">
            <select className="form-control" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus"></i> Add Time Slot
        </button>
      </div>

      <div className="timetable-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {days.map(day => {
          const dayClasses = timetable.filter(t => t.day === day).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={day} className="day-panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              <div className="day-header" style={{ background: '#f8fafc', padding: '12px 20px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                {day}
              </div>
              <div className="day-body" style={{ padding: '10px' }}>
                {loading ? (
                   <p style={{ padding: '10px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i></p>
                ) : dayClasses.length === 0 ? (
                  <p style={{ padding: '10px', color: '#6b7280', fontSize: '12px', textAlign: 'center' }}>No classes scheduled.</p>
                ) : dayClasses.map((item, idx) => (
                  <div key={item._id} style={{ padding: '12px', borderBottom: idx !== dayClasses.length - 1 ? '1px solid #f1f5f9' : 'none', position: 'relative' }}>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, paddingRight: '20px' }}>{item.subject}</h4>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.time} • {item.room}</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '6px' }}>
                      {item.teacher}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Add Time Slot</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Day</label>
                <select className="form-control" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} required>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Time</label>
                <input type="text" className="form-control" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} placeholder="e.g. 09:00 AM - 10:30 AM" required />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Subject</label>
                <input type="text" className="form-control" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Teacher</label>
                <select className="form-control" value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} required>
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Room</label>
                <input type="text" className="form-control" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="e.g. Room 101" required />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimetable;
