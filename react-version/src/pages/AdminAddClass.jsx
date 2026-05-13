import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminAddClass = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: teachersData } = useQuery({
    queryKey: ['adminTeachers'],
    queryFn: () => adminApi.getTeachers().then(res => res.data),
  });

  const [formData, setFormData] = useState({
    name: '',
    year: '1st Year',
    subjects: [{ name: '', teacher: '', teacherEmail: '', isNewTeacher: false, teacherPhone: '', teacherId: '' }]
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
      subjects: [...formData.subjects, { name: '', teacher: '', teacherEmail: '', isNewTeacher: false, teacherPhone: '', teacherId: '' }]
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    
    if (field === 'teacherSelect') {
      if (value === 'NEW') {
        newSubjects[index].isNewTeacher = true;
        newSubjects[index].teacher = '';
        newSubjects[index].teacherEmail = '';
      } else {
        const selectedTeacher = teachersData?.find(t => t.email === value);
        newSubjects[index].isNewTeacher = false;
        newSubjects[index].teacher = selectedTeacher?.name || '';
        newSubjects[index].teacherEmail = value;
      }
    } else {
      newSubjects[index][field] = value;
    }
    
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
    if (formData.subjects.some(s => s.isNewTeacher && (!s.teacher || !s.teacherEmail || !s.teacherPhone))) {
      return toast.error('Please fill in all details for the new teacher');
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
              <div key={idx} style={{ marginBottom: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '14px' }}>Subject #{idx + 1}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSubject(idx)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <i className="fas fa-times"></i> Remove
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Subject Name</label>
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
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Assign Teacher</label>
                    <select 
                      className="form-control"
                      value={subject.isNewTeacher ? 'NEW' : subject.teacherEmail}
                      onChange={(e) => handleSubjectChange(idx, 'teacherSelect', e.target.value)}
                      required
                    >
                      <option value="">Select Existing Teacher</option>
                      {teachersData?.map(t => (
                        <option key={t.email} value={t.email}>{t.name} ({t.department})</option>
                      ))}
                      <option value="NEW" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Add New Teacher</option>
                    </select>
                  </div>

                  {subject.isNewTeacher && (
                    <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>Full Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Teacher Name"
                          value={subject.teacher}
                          onChange={(e) => handleSubjectChange(idx, 'teacher', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>Email (Login ID)</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="email@college.edu"
                          value={subject.teacherEmail}
                          onChange={(e) => handleSubjectChange(idx, 'teacherEmail', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>Phone (Password)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Phone number"
                          value={subject.teacherPhone}
                          onChange={(e) => handleSubjectChange(idx, 'teacherPhone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
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
