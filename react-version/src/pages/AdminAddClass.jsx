import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminAddClass = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    year: '1st Year',
    subjects: [{ name: '', teacher: '', teacherEmail: '' }]
  });

  const addProgramMutation = useMutation({
    mutationFn: (data) => adminApi.addProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminClasses']);
      toast.success('Program & Subjects added successfully!');
      navigate('/admin/classes');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to create program');
    }
  });

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', teacher: '' }]
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subjects.some(s => !s.name)) {
      return toast.error('Please fill in all subject names');
    }
    addProgramMutation.mutate(formData);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <Link to="/admin/classes" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Create New Program / Class</h1>
      </div>

      <div className="form-card" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Program Name (e.g. B.Sc Computer Science)</label>
              <input 
                type="text" 
                required
                className="form-control" 
                placeholder="e.g. B.Sc Computer Science" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Academic Year</label>
              <select 
                className="form-control"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Curriculum / Subjects</h3>
              <button type="button" onClick={handleAddSubject} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                <i className="fas fa-plus"></i> Add Subject
              </button>
            </div>

            {formData.subjects.map((subject, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr 40px', gap: '12px', marginBottom: '16px', alignItems: 'end', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Subject Name</label>
                  <input 
                    type="text" 
                    required
                    className="form-control" 
                    placeholder="e.g. Data Structures" 
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Teacher Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Prof. Smith" 
                    value={subject.teacher}
                    onChange={(e) => handleSubjectChange(idx, 'teacher', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Teacher Email (For Portal)</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="teacher@college.edu" 
                    value={subject.teacherEmail}
                    onChange={(e) => handleSubjectChange(idx, 'teacherEmail', e.target.value)}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveSubject(idx)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="form-footer" style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to="/admin/classes" className="btn-cancel">Cancel</Link>
            <button 
              type="submit" 
              disabled={addProgramMutation.isLoading}
              className="btn-submit"
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              {addProgramMutation.isLoading ? 'Saving...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddClass;
