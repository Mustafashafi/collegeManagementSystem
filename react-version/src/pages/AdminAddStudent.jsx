import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminAddStudent = () => {
  const navigate = useNavigate();
  const { data: filters } = useQuery({
    queryKey: ['adminFilters'],
    queryFn: () => adminApi.getFilters().then(res => res.data),
  });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: 'Male',
    email: '', phone: '', studentId: '', program: '',
    year: '1st Year', fatherName: '', parentEmail: ''
  });

  // Set default program once filters are loaded
  React.useEffect(() => {
    if (filters?.programs?.length > 0 && !formData.program) {
      setFormData(prev => ({ ...prev, program: filters.programs[0] }));
    }
  }, [filters]);

  const mutation = useMutation({
    mutationFn: (data) => adminApi.addStudent(data),
    onSuccess: () => {
      toast.success('Student registered successfully!');
      navigate('/admin/students');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to register student');
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normalize phone number: replace +92 with 0
    const normalizedData = {
      ...formData,
      phone: formData.phone.startsWith('+92') ? formData.phone.replace('+92', '0') : formData.phone
    };
    mutation.mutate(normalizedData);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/students" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Add New Student</h1>
      </div>

      <div className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <h4 className="section-subtitle">Personal Information</h4>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
          </div>

          <h4 className="section-subtitle">Academic Details</h4>
          <div className="form-group">
            <label>Student ID / Roll No</label>
            <input type="text" name="studentId" className="form-control" value={formData.studentId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Course / Program</label>
            <select name="program" className="form-control" value={formData.program} onChange={handleChange}>
              {filters?.programs?.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
              {!filters?.programs?.length && <option value="">Loading programs...</option>}
            </select>
          </div>
          <div className="form-group">
            <label>Academic Year / Level</label>
            <select name="year" className="form-control" value={formData.year} onChange={handleChange}>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <h4 className="section-subtitle">Parent / Guardian Details</h4>
          <div className="form-group">
            <label>Father's / Guardian Name</label>
            <input type="text" name="fatherName" className="form-control" value={formData.fatherName} onChange={handleChange} placeholder="Full Name" />
          </div>
          <div className="form-group">
            <label>Parent Email (For Portal Access)</label>
            <input type="email" name="parentEmail" className="form-control" value={formData.parentEmail} onChange={handleChange} placeholder="guardian@example.com" />
          </div>

          <div className="form-footer" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
            <Link to="/admin/students" className="btn-cancel">Cancel</Link>
            <button className="btn-submit" type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddStudent;
