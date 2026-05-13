import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminGenerateInvoice = () => {
  const navigate = useNavigate();
  const [targetType, setTargetType] = useState('individual'); // 'individual' or 'bulk'
  const [formData, setFormData] = useState({
    studentEmail: '',
    studentName: '',
    program: '',
    year: '',
    feeType: 'Tuition Fee',
    amount: '',
    dueDate: '',
    description: ''
  });

  const { data: studentData } = useQuery({
    queryKey: ['adminStudents'],
    queryFn: () => adminApi.getStudents({ limit: 1000 }).then(res => res.data),
  });

  const { data: programData } = useQuery({
    queryKey: ['adminPrograms'],
    queryFn: () => adminApi.getPrograms().then(res => res.data),
  });

  const students = studentData?.students || [];
  const programs = programData || [];

  const mutation = useMutation({
    mutationFn: (data) => adminApi.generateInvoice(data),
    onSuccess: (res) => {
      toast.success(res.data.msg || 'Invoice(s) generated successfully!');
      navigate('/admin/fees');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Failed to generate invoice');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'studentEmail') {
      const student = students.find(s => s.email === value);
      setFormData(prev => ({
        ...prev,
        studentEmail: value,
        studentName: student ? `${student.firstName} ${student.lastName}` : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetType === 'individual') {
      if (!formData.studentEmail || !formData.amount || !formData.dueDate) {
        return toast.error('Please fill all required fields');
      }
      const { program, year, ...submitData } = formData;
      mutation.mutate(submitData);
    } else {
      if (!formData.program || !formData.year || !formData.amount || !formData.dueDate) {
        return toast.error('Please fill all required fields');
      }
      const { studentEmail, studentName, ...submitData } = formData;
      mutation.mutate(submitData);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/fees" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Generate Fee Invoice</h1>
      </div>

      <div className="form-card">
        <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
          <button 
            className={`btn-sm ${targetType === 'individual' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTargetType('individual')}
          >
            Individual Student
          </button>
          <button 
            className={`btn-sm ${targetType === 'bulk' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTargetType('bulk')}
          >
            Whole Program / Year
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {targetType === 'individual' ? (
            <div className="form-group">
              <label>Select Student *</label>
              <select 
                className="form-control" 
                name="studentEmail" 
                value={formData.studentEmail} 
                onChange={handleChange}
                required
              >
                <option value="">Select a student...</option>
                {students.map(s => (
                  <option key={s._id} value={s.email}>
                    {s.firstName} {s.lastName} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Select Program *</label>
                <select 
                  className="form-control" 
                  name="program" 
                  value={formData.program} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a program...</option>
                  {[...new Set(programs.map(p => p.name))].map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Year *</label>
                <select 
                  className="form-control" 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select year...</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Fee Category *</label>
            <select 
              className="form-control" 
              name="feeType"
              value={formData.feeType}
              onChange={handleChange}
            >
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Examination Fee">Examination Fee</option>
              <option value="Hostel Fee">Hostel Fee</option>
              <option value="Library Fine">Library Fine</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date *</label>
            <input 
              type="date" 
              className="form-control" 
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount ($) *</label>
            <input 
              type="number" 
              className="form-control" 
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group full">
            <label>Description / Notes</label>
            <textarea 
              className="form-control" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ minHeight: '80px' }} 
              placeholder="Brief description of the fee..."
            ></textarea>
          </div>
          
          <div className="form-footer" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
            <Link to="/admin/fees" className="btn-cancel">Cancel</Link>
            <button 
              className="btn-submit" 
              type="submit"
              disabled={mutation.isLoading}
            >
              <i className="fas fa-file-invoice"></i> 
              {mutation.isLoading ? ' Generating...' : targetType === 'bulk' ? ' Generate Bulk Invoices' : ' Generate & Send Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminGenerateInvoice;
