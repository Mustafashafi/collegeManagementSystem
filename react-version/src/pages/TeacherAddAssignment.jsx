import React, { useState, useEffect } from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { NavLink, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const TeacherAddAssignment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    program: '',
    year: '',
    dueDate: '',
    subject: '',
    description: ''
  });
  const [teacher, setTeacher] = useState(null);
  const [fullSchedule, setFullSchedule] = useState([]);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard/${user.email}`);
        const data = await response.json();
        if (response.ok) {
          setTeacher(data.teacher);
          setFullSchedule(data.fullSchedule || []);
          if (data.fullSchedule && data.fullSchedule.length > 0) {
            setFormData(prev => ({ 
              ...prev, 
              program: data.fullSchedule[0].program,
              year: data.fullSchedule[0].year,
              subject: data.fullSchedule[0].subject
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching teacher:', err);
      }
    };
    if (user.email) fetchTeacher();
  }, [user.email]);

  const handleClassChange = (e) => {
    const selectedClass = fullSchedule.find(c => c._id === e.target.value);
    if (selectedClass) {
      setFormData({
        ...formData,
        program: selectedClass.program,
        year: selectedClass.year,
        subject: selectedClass.subject
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.program || !formData.dueDate || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('program', formData.program);
    formDataObj.append('year', formData.year);
    formDataObj.append('dueDate', formData.dueDate);
    formDataObj.append('subject', formData.subject);
    formDataObj.append('description', formData.description);
    formDataObj.append('teacherName', teacher.name);
    if (assignmentFile) formDataObj.append('assignmentFile', assignmentFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers/assignments`, {
        method: 'POST',
        body: formDataObj
      });

      if (response.ok) {
        toast.success(`Assignment for ${formData.subject} broadcasted!`);
        navigate('/teacher/assignments');
      } else {
        const error = await response.json();
        toast.error(error.msg || 'Failed to create assignment');
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      toast.error('Connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Assignment Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-control" 
                placeholder="e.g. Introduction to Neural Networks" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Select Class (Subject + Program)</label>
              <select 
                className="form-control" 
                onChange={handleClassChange}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
              >
                {fullSchedule.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.subject} ({cls.program})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Due Date</label>
              <input 
                type="date" 
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="form-control" 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>
            <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Instructions / Description</label>
              <textarea 
                className="form-control" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Write detailed instructions for the students..." 
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              ></textarea>
            </div>
            <div className="form-group full" style={{ gridColumn: 'span 2', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Attachment (Assignment File / Questions PDF)</label>
              <div 
                className="upload-area" 
                onClick={() => document.getElementById('assignment-file').click()}
                style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '30px', textAlign: 'center', background: '#f9fafb', cursor: 'pointer', transition: '0.2s' }}
              >
                <input 
                  type="file" 
                  id="assignment-file"
                  onChange={(e) => setAssignmentFile(e.target.files[0])}
                  style={{ display: 'none' }} 
                />
                <i className="fas fa-file-upload" style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '12px' }}></i>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{assignmentFile ? assignmentFile.name : 'Click to upload assignment file'}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF, DOCX, or Image (Max 50MB)</p>
              </div>
            </div>
          </div>
          <div className="form-footer" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <NavLink to="/teacher/assignments" className="btn-outline" style={{ padding: '12px 24px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', textAlign: 'center' }}>Cancel</NavLink>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Creating...' : 'Create & Notify Students'}
            </button>
          </div>
        </form>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAddAssignment;
