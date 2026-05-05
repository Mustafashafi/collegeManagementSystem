import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { NavLink } from 'react-router-dom';

const TeacherAddAssignment = () => {
  return (
    <TeacherLayout>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <NavLink to="/teacher/assignments" className="btn-back" style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}>
          <i className="fas fa-arrow-left"></i>
        </NavLink>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Create New Assignment</h1>
        </div>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Assignment Title</label>
            <input type="text" className="form-control" placeholder="e.g. Introduction to Neural Networks" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Select Class</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
              <option>Data Structures (B.Sc CS - 2nd Year)</option>
              <option>Database Management (B.Sc CS - 3rd Year)</option>
              <option>Software Engineering (B.Sc CS - 4th Year)</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Due Date</label>
            <input type="date" className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Total Marks</label>
            <input type="number" className="form-control" placeholder="100" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Assignment Type</label>
            <select className="form-control" style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
              <option>Individual Project</option>
              <option>Group Project</option>
              <option>Weekly Homework</option>
              <option>Lab Report</option>
            </select>
          </div>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Instructions / Description</label>
            <textarea className="form-control" placeholder="Write detailed instructions for the students..." style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', minHeight: '120px', resize: 'vertical' }}></textarea>
          </div>
          <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Attachment (Optional)</label>
            <div className="file-upload" style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: '24px', color: 'var(--text-muted)', marginBottom: '10px' }}></i>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong>Click to upload</strong> or drag and drop</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, DOCX, or ZIP (Max 10MB)</p>
            </div>
          </div>
        </div>
        <div className="form-footer" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <NavLink to="/teacher/assignments" className="btn-outline" style={{ padding: '12px 24px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', textAlign: 'center' }}>Cancel</NavLink>
          <button className="btn-primary" style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}>Create & Notify Students</button>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAddAssignment;
