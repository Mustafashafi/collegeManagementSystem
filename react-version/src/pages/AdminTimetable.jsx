import React from 'react';

const AdminTimetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    { time: "09:00 AM", subTime: "10:00 AM", slots: [
      { subject: "Data Structures", teacher: "Prof. R. Smith", room: "Room 101" },
      { subject: "Computer Networks", teacher: "Dr. E. Davis", room: "Lab 4" },
      { subject: "Data Structures", teacher: "Prof. R. Smith", room: "Room 101" },
      { subject: "Mathematics III", teacher: "Prof. A. Johnson", room: "Room 205" },
      { empty: true }
    ]},
    { time: "10:00 AM", subTime: "11:00 AM", slots: [
      { subject: "Operating Systems", teacher: "Dr. M. Lee", room: "Room 102" },
      { empty: true },
      { subject: "Operating Systems", teacher: "Dr. M. Lee", room: "Room 102" },
      { subject: "Computer Networks", teacher: "Dr. E. Davis", room: "Room 104" },
      { subject: "Mathematics III", teacher: "Prof. A. Johnson", room: "Room 205" }
    ]},
    { break: true, time: "11:00 AM", subTime: "11:30 AM", label: "Break" },
    { time: "11:30 AM", subTime: "01:30 PM", slots: [
      { subject: "Data Structures Lab", teacher: "Prof. R. Smith", room: "Lab 2", span: 2 },
      { empty: true },
      { subject: "Operating Systems Lab", teacher: "Dr. M. Lee", room: "Lab 3", span: 2 }
    ]}
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Timetable Management</h1>
          <p>View and configure the weekly schedule for all classes.</p>
        </div>
        <button className="btn-primary"><i className="fas fa-print"></i> Print Schedule</button>
      </div>

      <div className="controls-bar">
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="select-wrapper">
            <select className="form-control">
              <option>B.Sc Computer Science</option>
              <option>B.B.A Management</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className="select-wrapper">
            <select className="form-control">
              <option>2nd Year (Semester 3)</option>
              <option>1st Year (Semester 1)</option>
            </select>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
        <button className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', border: '1px solid var(--border)' }}><i className="fas fa-plus"></i> Add Time Slot</button>
      </div>

      <div className="panel">
        <table className="timetable">
          <thead>
            <tr>
              <th className="time-col">Time</th>
              {days.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((row, idx) => (
              <tr key={idx}>
                <td className="time-col" style={row.break ? { background: '#fef3c7' } : {}}>
                  {row.time}<br /><span style={{ fontSize: '10px', fontWeight: 400 }}>{row.subTime}</span>
                </td>
                {row.break ? (
                  <td colSpan="5" style={{ background: '#fef3c7', color: '#b45309', fontWeight: 600, fontSize: '14px', verticalAlign: 'middle', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {row.label}
                  </td>
                ) : (
                  row.slots.map((slot, sIdx) => (
                    <td key={sIdx} colSpan={slot.span || 1}>
                      {slot.empty ? (
                        <div className="slot empty">
                          <i className="fas fa-plus" style={{ marginBottom: '4px', fontSize: '16px' }}></i><br />Add Subject
                        </div>
                      ) : (
                        <div className="slot" style={slot.span > 1 ? { background: '#e0f2fe', border: '1px solid #bae6fd' } : {}}>
                          <i className="fas fa-edit edit-icon"></i>
                          <div className="subject-title">{slot.subject}</div>
                          <div className="teacher-name">{slot.teacher}</div>
                          <div className="room-no" style={slot.span > 1 ? { borderColor: '#bae6fd' } : {}}>{slot.room}</div>
                        </div>
                      )}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTimetable;
