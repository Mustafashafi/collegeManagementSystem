import React from 'react';
import TeacherLayout from '../components/TeacherLayout';

const TeacherAttendance = () => {
  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h1>Mark Attendance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Record daily attendance for your assigned classes.</p>
        </div>
        <button className="btn-primary">
          <i className="fas fa-save" style={{ marginRight: '8px' }}></i> Save Attendance
        </button>
      </div>

      <div className="controls-bar" style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="select-group" style={{ display: 'flex', gap: '16px' }}>
          <div className="select-wrapper" style={{ position: 'relative' }}>
            <select style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }}>
              <option>Data Structures (B.Sc CS)</option>
              <option>Database Management (B.Sc CS)</option>
              <option>Software Eng (B.Sc CS)</option>
            </select>
            <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '12px' }}></i>
          </div>
          <div className="select-wrapper" style={{ position: 'relative' }}>
            <select style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }}>
              <option>Lecture: 09:00 AM</option>
              <option>Lab: 02:00 PM</option>
            </select>
            <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '12px' }}></i>
          </div>
        </div>
        <input type="date" className="date-picker" defaultValue="2026-10-24" style={{ background: '#f3f4f6', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
      </div>

      <div className="panel">
        <div className="panel-header" style={{ background: '#f9fafb' }}>
          <h3>Class Roster (30 Students)</h3>
          <button className="btn-sm"><i className="fas fa-check-double" style={{ marginRight: '6px' }}></i> Mark All Present</button>
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
            <tr>
              <td><strong>01</strong></td>
              <td>
                <div className="student-info">
                  <div className="student-avatar">MC</div>
                  <div className="student-details">
                    <h4>Michael Chen</h4>
                    <p>S-2024-001</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="attendance-radios">
                  <label className="radio-label present-active">
                    <input type="radio" name="att_1" value="present" defaultChecked /> P
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="att_1" value="absent" /> A
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="att_1" value="late" /> L
                  </label>
                </div>
              </td>
              <td><input type="text" style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', fontSize: '12px', outline: 'none' }} placeholder="Optional remark..." /></td>
            </tr>
            <tr>
              <td><strong>02</strong></td>
              <td>
                <div className="student-info">
                  <div className="student-avatar">SW</div>
                  <div className="student-details">
                    <h4>Sarah Williams</h4>
                    <p>S-2024-002</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="attendance-radios">
                  <label className="radio-label">
                    <input type="radio" name="att_2" value="present" /> P
                  </label>
                  <label className="radio-label absent-active">
                    <input type="radio" name="att_2" value="absent" defaultChecked /> A
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="att_2" value="late" /> L
                  </label>
                </div>
              </td>
              <td><input type="text" style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', fontSize: '12px', outline: 'none' }} defaultValue="Medical leave" /></td>
            </tr>
            <tr>
              <td><strong>03</strong></td>
              <td>
                <div className="student-info">
                  <div className="student-avatar">DJ</div>
                  <div className="student-details">
                    <h4>David Johnson</h4>
                    <p>S-2024-003</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="attendance-radios">
                  <label className="radio-label">
                    <input type="radio" name="att_3" value="present" /> P
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="att_3" value="absent" /> A
                  </label>
                  <label className="radio-label late-active">
                    <input type="radio" name="att_3" value="late" defaultChecked /> L
                  </label>
                </div>
              </td>
              <td><input type="text" style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', fontSize: '12px', outline: 'none' }} placeholder="Optional remark..." /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAttendance;
