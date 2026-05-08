import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const TeacherViewSubmissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, subject, teacherName } = location.state || {};
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showGrade, setShowGrade] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!title) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/teachers/submissions/${encodeURIComponent(title)}/${encodeURIComponent(subject)}/${encodeURIComponent(teacherName)}`);
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [title, subject, teacherName]);

  const handleGrade = async () => {
    if (!selectedSubmission) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers/grade/${selectedSubmission._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, feedback, showGrade })
      });
      if (response.ok) {
        toast.success('Graded successfully!');
        setSubmissions(submissions.map(s => s._id === selectedSubmission._id ? { ...s, status: 'Graded', grade, feedback, showGrade } : s));
        setSelectedSubmission(null);
      } else {
        toast.error('Failed to save grade');
      }
    } catch (err) {
      console.error('Error grading:', err);
      toast.error('Connection error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!title) return <TeacherLayout><div style={{ padding: '50px', textAlign: 'center' }}>No assignment selected.</div></TeacherLayout>;

  return (
    <TeacherLayout>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/teacher/assignments')} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', background: '#fff', cursor: 'pointer' }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Submissions: {title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{subject}</p>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Email</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={idx}>
                  <td><strong>{sub.studentEmail}</strong></td>
                  <td>
                    <span className="status-badge" style={{ 
                      background: sub.status === 'Pending' ? '#fef3c7' : sub.status === 'Submitted' ? '#dcfce7' : (sub.showGrade ? '#dcfce7' : '#dbeafe'),
                      color: sub.status === 'Pending' ? '#d97706' : sub.status === 'Submitted' ? '#166534' : (sub.showGrade ? '#15803d' : '#1e40af'),
                      border: '1px solid currentColor',
                      opacity: 0.8
                    }}>
                      {sub.status === 'Graded' ? (sub.showGrade ? 'Published' : 'Graded (Private)') : sub.status}
                    </span>
                  </td>
                  <td>{sub.status !== 'Pending' ? 'Received' : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {sub.submissionFile && (
                        <a href={`${API_BASE_URL}${sub.submissionFile}`} target="_blank" rel="noopener noreferrer" className="btn-sm" style={{ textDecoration: 'none', background: '#f3f4f6', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fas fa-download"></i> View File
                        </a>
                      )}
                      <button className="btn-sm" onClick={() => { 
                        setSelectedSubmission(sub); 
                        setGrade(sub.grade || ''); 
                        setFeedback(sub.feedback || ''); 
                        setShowGrade(sub.showGrade || false);
                      }} style={{ background: '#1a1a1a', color: '#fff', border: 'none' }}>
                        {sub.status === 'Graded' ? 'Edit Grade' : 'Grade'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedSubmission && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '500px', maxWidth: '90%' }}>
            <h2 style={{ marginBottom: '20px' }}>Grade Submission</h2>
            <p style={{ marginBottom: '20px', color: '#6b7280' }}>Student: {selectedSubmission.studentEmail}</p>
            
            {selectedSubmission.submissionNotes && (
              <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px' }}>
                <strong>Notes:</strong> {selectedSubmission.submissionNotes}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Grade (e.g. A, 85/100)</label>
              <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Feedback</label>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="form-control" style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', minHeight: '100px' }}></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="showGrade" 
                checked={showGrade} 
                onChange={(e) => setShowGrade(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="showGrade" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Publish Grade (Student can view grade and feedback)</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setSelectedSubmission(null)} className="btn-outline" style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: '8px' }}>Cancel</button>
              <button onClick={handleGrade} disabled={isSaving} className="btn-primary" style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px' }}>
                {isSaving ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherViewSubmissions;
