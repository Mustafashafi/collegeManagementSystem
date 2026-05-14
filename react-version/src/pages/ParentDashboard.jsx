import React, { useState, useEffect } from 'react';
import { parentApi } from '../services/api';
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentApi.getChildren(user.email);
        // The API now returns { students, applications }
        // We only care about enrolled students for the portal access now
        const students = response.data.students || [];
        setChildren(students);
        
        if (students.length > 0) {
          setSelectedChild(students[0]);
        }
      } catch (err) {
        toast.error("Failed to fetch children data");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchChildren();
  }, [user.email]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!selectedChild) return;
      try {
        const response = await parentApi.getStudent360(selectedChild.studentId);
        setAcademicData(response.data);
      } catch (err) {
        toast.error("Failed to load student profile");
      }
    };
    fetchStudentDetails();
  }, [selectedChild]);

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', padding: '100px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ width: '80px', height: '80px', background: '#f3f4f6', color: '#9ca3af', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>
            <i className="fas fa-user-slash"></i>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>No Children Linked</h2>
          <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
            Your account is not currently linked to any active student records. Please contact the college administration to link your email to your child's profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Parent Portal</h1>
          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Monitor your child's academic progress and institutional records.</p>
        </div>
      </div>

      {/* Child Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Select Student</label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {children.map(child => (
            <div 
              key={child._id}
              onClick={() => setSelectedChild(child)}
              style={{ 
                background: selectedChild?._id === child._id ? 'var(--primary)' : '#fff', 
                color: selectedChild?._id === child._id ? '#fff' : '#1a1a1a',
                padding: '12px 20px', 
                borderRadius: '12px', 
                border: '1px solid #e5e7eb', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer',
                transition: '0.2s',
                boxShadow: selectedChild?._id === child._id ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user-graduate"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{child.firstName} {child.lastName}</h4>
                <p style={{ fontSize: '10px', opacity: 0.8 }}>{child.studentId} • {child.program}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {academicData && (
        <>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', position: 'relative' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Attendance Rate</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '8px' }}>{academicData.stats.attendanceRate}%</div>
              <div style={{ fontSize: '12px', color: academicData.stats.attendanceRate > 75 ? '#10b981' : '#f59e0b', marginTop: '4px', fontWeight: 600 }}>
                {academicData.stats.attendanceRate > 75 ? 'Excellent Presence' : 'Attention Required'}
              </div>
              <i className="fas fa-calendar-check" style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.1, fontSize: '24px' }}></i>
            </div>

            <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', position: 'relative' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Pending Fees</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: academicData.stats.pendingFees > 0 ? '#ef4444' : '#111827', marginTop: '8px' }}>
                {academicData.stats.pendingFees}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Unpaid Invoices</div>
              <i className="fas fa-file-invoice-dollar" style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.1, fontSize: '24px' }}></i>
            </div>

            <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', position: 'relative' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Active Assignments</span>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '8px' }}>{academicData.stats.activeAssignments}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Due this month</div>
              <i className="fas fa-tasks" style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.1, fontSize: '24px' }}></i>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Recent Results */}
            <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Academic Performance</h3>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Latest Results</span>
              </div>
              <div style={{ padding: '20px' }}>
                {academicData.results.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No results published yet.</p>
                ) : (
                  academicData.results.slice(0, 5).map((res, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx === 4 ? 'none' : '1px solid #f9fafb' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{res.subject}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>{res.examType}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>{res.grade}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>{res.marksObtained}/{res.totalMarks}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Fees */}
            <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Fee Status</h3>
              </div>
              <div style={{ padding: '20px' }}>
                {academicData.fees.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No fee records found.</p>
                ) : (
                  academicData.fees.slice(0, 5).map((fee, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx === 4 ? 'none' : '1px solid #f9fafb' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{fee.feeType}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>Due: {new Date(fee.dueDate).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          padding: '4px 8px', 
                          borderRadius: '6px',
                          background: fee.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                          color: fee.status === 'Paid' ? '#166534' : '#991b1b'
                        }}>
                          {fee.status === 'Paid' ? 'PAID' : `PENDING $${fee.amount - (fee.amountPaid || 0)}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentDashboard;
