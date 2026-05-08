import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const StudentSubmitAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  
  const assignment = location.state?.assignment;

  if (!assignment) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}>
        <p>No assignment selected.</p>
        <button className="btn-primary" onClick={() => navigate('/student/assignments')}>Go Back</button>
      </div>
    );
  }

  const handleSubmit = async () => {
    console.log("Submit clicked. Assignment:", assignment);
    if (!file && !notes) {
      toast.error('Please upload a file or add some notes.');
      return;
    }

    const url = `${API_BASE_URL}/api/students/assignments/submit/${assignment._id}`;
    console.log("Submission URL:", url);

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('notes', notes);
    if (file) formData.append('file', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error(`Server error (${response.status}): Unexpected response format.`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Assignment submitted successfully!');
        navigate('/student/assignments');
      } else {
        toast.error(data.msg || 'Failed to submit assignment');
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      toast.error(`Connection error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            value={assignment.title} 
            readOnly 
            style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Comments / Submission Notes</label>
          <textarea 
            className="form-control" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', minHeight: '100px' }} 
            placeholder="Add any notes for the teacher..."
          ></textarea>
        </div>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Upload Work (PDF, DOCX, ZIP)</label>
          <div 
            className="upload-area" 
            onClick={() => document.getElementById('file-input').click()}
            style={{ border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '40px', textAlign: 'center', background: '#fafafa', cursor: 'pointer', transition: '0.2s', borderColor: file ? '#10b981' : '#e5e7eb' }}
          >
            <input 
              id="file-input"
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }} 
            />
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '40px', color: file ? '#10b981' : '#6b7280', marginBottom: '15px' }}></i>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{file ? file.name : 'Click to upload or drag and drop'}</h4>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Maximum file size 50MB'}</p>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ padding: '12px 24px', background: '#1a1a1a', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmitAssignment;
