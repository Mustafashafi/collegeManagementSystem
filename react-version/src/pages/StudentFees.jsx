import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/fees/${user.email}`);
        const data = await response.json();
        setFees(data);
      } catch (err) {
        console.error('Error fetching fees:', err);
        toast.error("Failed to load fee records.");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchFees();
  }, [user.email]);

  const totalAmount = fees.reduce((acc, fee) => acc + fee.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((acc, fee) => acc + fee.amount, 0);
  const totalPending = totalAmount - totalPaid;

  const summaryItems = [
    { label: "Total Fees", value: `$${totalAmount.toLocaleString()}`, icon: "fas fa-file-invoice", iconClass: "icon-total", bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Total Paid", value: `$${totalPaid.toLocaleString()}`, icon: "fas fa-check-circle", iconClass: "icon-paid", bg: "#f0fdf4", color: "#15803d" },
    { label: "Total Pending", value: `$${totalPending.toLocaleString()}`, icon: "fas fa-clock", iconClass: "icon-pending", bg: "#fff7ed", color: "#c2410c" },
  ];

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '30px' }}></i>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>My Fee Records</h1>
      </div>

      <div className="fee-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {summaryItems.map((item, idx) => (
          <div key={idx} className="summary-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className={`summary-icon ${item.iconClass}`} style={{ width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: item.bg, color: item.color }}>
              <i className={item.icon}></i>
            </div>
            <div className="summary-info">
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</p>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Current Fee Status</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Invoice ID</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Due Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>No fee records found.</td>
                </tr>
              ) : fees.map((fee, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{fee.invoiceId}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{fee.description}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>${fee.amount.toLocaleString()}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>
                    <span className={`badge-status ${fee.status === 'Paid' ? 'status-paid' : 'status-pending'}`} style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      background: fee.status === 'Paid' ? '#dcfce7' : '#fff7ed',
                      color: fee.status === 'Paid' ? '#166534' : '#9a3412'
                    }}>
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
