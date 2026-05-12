import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminAddTeacher = () => {
  const navigate = useNavigate();
  const { data: filters } = useQuery({
    queryKey: ['adminFilters'],
    queryFn: () => adminApi.getFilters().then(res => res.data),
  });

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', teacherId: '',
    department: '', designation: 'Professor'
  });

  // Set default department once filters are loaded
  React.useEffect(() => {
    if (filters?.departments?.length > 0 && !formData.department) {
      setFormData(prev => ({ ...prev, department: filters.departments[0] }));
    }
  }, [filters]);

  const mutation = useMutation({
    mutationFn: (data) => adminApi.addTeacher(data),
    onSuccess: () => {
      toast.success('Teacher registered successfully!');
      navigate('/admin/teachers');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to register teacher');
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
        <Link to="/admin/teachers" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Add New Teacher</h1>
      </div>

      <div className="form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <h4 className="section-subtitle">Professional Information</h4>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Teacher ID</label>
            <input type="text" name="teacherId" className="form-control" value={formData.teacherId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select name="department" className="form-control" value={formData.department} onChange={handleChange}>
              {filters?.departments?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
              {!filters?.departments?.length && <option value="">Loading departments...</option>}
            </select>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <select name="designation" className="form-control" value={formData.designation} onChange={handleChange}>
              <option>Professor</option>
              <option>Assistant Professor</option>
              <option>Lecturer</option>
            </select>
          </div>

          <h4 className="section-subtitle">Contact Details</h4>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-footer" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
            <Link to="/admin/teachers" className="btn-cancel">Cancel</Link>
            <button className="btn-submit" type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Registering...' : 'Register Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddTeacher;
