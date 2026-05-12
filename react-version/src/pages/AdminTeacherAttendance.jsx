import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminTeacherAttendance = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState('daily');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: teachers } = useQuery({
    queryKey: ['adminTeachers'],
    queryFn: () => adminApi.getTeachers().then(res => res.data),
  });

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['teacherAttendance', selectedDate],
    queryFn: () => adminApi.getTeacherAttendance(selectedDate).then(res => res.data),
  });

  const { data: monthlyReport } = useQuery({
    queryKey: ['teacherAttendanceReport', selectedDate.substring(0, 7)],
    queryFn: () => {
      const [year, month] = selectedDate.split('-');
      return adminApi.getTeacherAttendanceReport(month, year).then(res => res.data);
    },
  });

  const markMutation = useMutation({
    mutationFn: (data) => adminApi.markTeacherAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacherAttendance', selectedDate]);
      toast.success('Attendance updated');
    },
    onError: () => toast.error('Failed to update attendance')
  });

  const attendanceMap = {};
  attendanceData?.forEach(record => {
    attendanceMap[record.teacherEmail] = record;
  });

  const { data: teacherHistory } = useQuery({
    queryKey: ['teacherHistory', selectedTeacher?.email, selectedDate.substring(0, 7)],
    queryFn: () => {
      const [year, month] = selectedDate.split('-');
      return adminApi.getTeacherAttendanceReport(month, year, selectedTeacher.email).then(res => res.data);
    },
    enabled: !!selectedTeacher,
  });

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  const roster = teachers?.map(t => {
    const record = attendanceMap[t.email];
    return {
      ...t,
      checkIn: record?.checkIn || '--:--',
      status: record?.status || 'Pending',
      statusClass: record?.status === 'Present' ? 'status-present' : record?.status === 'Absent' ? 'status-absent' : record?.status === 'Late' ? 'status-late' : 'status-unpaid'
    };
  }) || [];

  const handleMark = (email, status) => {
    const checkIn = status === 'Present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    markMutation.mutate({
      teacherEmail: email,
      status,
      date: selectedDate,
      checkIn
    });
  };

  if (selectedTeacher) {
    const history = Array.isArray(teacherHistory) ? teacherHistory : [];
    return (
      <div className="dashboard-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn-icon" onClick={() => setSelectedTeacher(null)}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1>Detailed Attendance Log</h1>
              <p>Individual attendance records for the current academic month.</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => window.print()}>
            <i className="fas fa-print"></i> Print Log
          </button>
        </div>

        <div className="panel" style={{ marginBottom: '24px' }}>
          <div className="panel-body" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="teacher-info">
              <div className="teacher-avatar" style={{ width: '60px', height: '60px', fontSize: '20px' }}>{getInitials(selectedTeacher.name)}</div>
              <div className="teacher-details">
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedTeacher.name}</h2>
                <p style={{ fontSize: '14px' }}>{selectedTeacher.email} • Faculty</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{selectedTeacher.present}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Present</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{selectedTeacher.absent}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Absent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{selectedTeacher.late}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Late</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>{selectedTeacher.percentage}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Overall</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Attendance History ({selectedDate.substring(0, 7)})</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-In</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No records found for this month.</td></tr>
              ) : history.map((log, idx) => (
                <tr key={idx}>
                  <td><strong>{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong></td>
                  <td>{log.checkIn}</td>
                  <td>
                    <span className={`status-badge ${log.status === 'Present' ? 'status-present' : log.status === 'Absent' ? 'status-absent' : 'status-late'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.remarks || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Teacher Attendance Report</h1>
          <p>Monitor and manage daily attendance records for all faculty members.</p>
        </div>
        <button className="btn-outline">
          <i className="fas fa-download"></i> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Faculty</span>
          <span style={{ fontSize: '28px', fontWeight: 700 }}>{teachers?.length || 0}</span>
        </div>
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Present Today</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{attendanceData?.filter(a => a.status === 'Present').length || 0}</span>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs" style={{ marginBottom: '20px' }}>
        <button className={`tab-btn ${view === 'daily' ? 'active' : ''}`} onClick={() => setView('daily')}>
          <i className="fas fa-calendar-day"></i> Daily Roster
        </button>
        <button className={`tab-btn ${view === 'monthly' ? 'active' : ''}`} onClick={() => setView('monthly')}>
          <i className="fas fa-chart-line"></i> Monthly Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            background: '#f3f4f6', border: '1px solid transparent', padding: '10px 16px',
            borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter', color: 'var(--text-main)', outline: 'none'
          }} 
        />
      </div>

      {/* Daily Roster */}
      {view === 'daily' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Daily Attendance Roster</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing records for {selectedDate}</span>
          </div>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teacher Details</th>
                  <th>Department</th>
                  <th>Check-In</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((t, idx) => (
                  <tr key={t._id || idx}>
                    <td>
                      <div className="teacher-info">
                        <div className="teacher-details">
                          <h4>{t.name}</h4>
                          <p>{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><strong>{t.department}</strong></td>
                    <td>{t.checkIn}</td>
                    <td><span className={`status-badge ${t.statusClass}`}>{t.status}</span></td>
                    <td>
                      <div className="attendance-actions">
                        <button className="btn-action btn-present" title="Mark Present" onClick={() => handleMark(t.email, 'Present')}>P</button>
                        <button className="btn-action btn-absent" title="Mark Absent" onClick={() => handleMark(t.email, 'Absent')}>A</button>
                        <button className="btn-action" title="Mark Late" onClick={() => handleMark(t.email, 'Late')}>L</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Monthly Report */}
      {view === 'monthly' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Monthly Attendance Summary</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Staff Performance · {selectedDate.substring(0, 7)}</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher Details</th>
                <th>Working Days</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Percentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {monthlyReport?.map((row, idx) => (
                <tr key={row._id || idx}>
                  <td>
                    <div className="teacher-info">
                      <div className="teacher-details">
                        <h4>{row.name}</h4>
                        <p>{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{row.total}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>{row.present}</td>
                  <td style={{ color: '#ef4444', fontWeight: 600 }}>{row.absent}</td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>{row.late}</td>
                  <td><strong>{row.percentage}</strong></td>
                  <td>
                    <button className="btn-sm" onClick={() => setSelectedTeacher(row)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-eye"></i> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherAttendance;
