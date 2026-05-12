import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminAddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: 'Male',
    email: '', phone: '', studentId: '', program: 'B.Sc Computer Science',
    year: '1st Year'
  });

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
    mutation.mutate(formData);
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
              <option>B.Sc Computer Science</option>
              <option>B.A English</option>
              <option>B.B.A Management</option>
              <option>M.Sc Physics</option>
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
