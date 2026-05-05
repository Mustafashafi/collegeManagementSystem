import React from 'react';
import TeacherLayout from '../components/TeacherLayout';

const TeacherResults = () => {
  return (
    <TeacherLayout>
      <div className="page-header">
        <div>
          <h1>Manage Results & Grades</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Enter exam scores and generate result sheets.</p>
        </div>
        <button className="btn-primary">
          <i className="fas fa-save" style={{ marginRight: '8px' }}></i> Publish Grades
        </button>
      </div>

      <div className="controls-bar" style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div className="select-wrapper" style={{ position: 'relative' }}>
          <select style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }}>
            <option>Data Structures (B.Sc CS)</option>
          </select>
          <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '12px' }}></i>
        </div>
        <div className="select-wrapper" style={{ position: 'relative' }}>
          <select style={{ appearance: 'none', background: '#f3f4f6', border: 'none', padding: '10px 36px 10px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '180px' }}>
            <option>Mid-Term Exam (Oct 2026)</option>
            <option>Final Exam</option>
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
              <td>100</td>
              <td><input type="number" className="grade-input" defaultValue="88" style={{ width: '80px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', textAlign: 'center', outline: 'none' }} /></td>
              <td><strong>A</strong></td>
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
              <td>100</td>
              <td><input type="number" className="grade-input" defaultValue="92" style={{ width: '80px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', textAlign: 'center', outline: 'none' }} /></td>
              <td><strong>A+</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default TeacherResults;
