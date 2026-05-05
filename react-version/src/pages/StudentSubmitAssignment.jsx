import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentSubmitAssignment = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/student/assignments')} 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            border: '1px solid #e5e7eb', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#111827', 
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Submit Assignment</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px', maxWidth: '800px' }}>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Assignment Title</label>
          <input 
            type="text" 
            className="form-control" 
            value="Design & Analysis of Algorithms - Research Paper" 
            readOnly 
            style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Comments / Submission Notes</label>
          <textarea 
            className="form-control" 
            style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', minHeight: '100px' }} 
            placeholder="Add any notes for the teacher..."
          ></textarea>
        </div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Upload Work (PDF, DOCX, ZIP)</label>
          <div className="upload-area" style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '40px', textAlign: 'center', background: '#fafafa', cursor: 'pointer', transition: '0.2s' }}>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '40px', color: '#6b7280', marginBottom: '15px' }}></i>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Click to upload or drag and drop</h4>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Maximum file size 50MB</p>
          </div>
        </div>
        <div className="form-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <button 
            className="btn-cancel" 
            onClick={() => navigate('/student/assignments')}
            style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            className="btn-submit"
            style={{ padding: '12px 24px', background: '#1a1a1a', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmitAssignment;
