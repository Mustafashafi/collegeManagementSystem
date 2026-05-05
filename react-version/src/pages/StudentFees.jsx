import React from 'react';

const StudentFees = () => {
  const summaryItems = [
    { label: "Total Fees", value: "$3,600.00", icon: "fas fa-file-invoice", iconClass: "icon-total", bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Total Paid", value: "$2,400.00", icon: "fas fa-check-circle", iconClass: "icon-paid", bg: "#f0fdf4", color: "#15803d" },
    { label: "Total Pending", value: "$1,200.00", icon: "fas fa-clock", iconClass: "icon-pending", bg: "#fff7ed", color: "#c2410c" },
  ];

  const currentFees = [
    { id: "#INV-2026-11", desc: "Term 2 Tuition Fee", amount: "$1,200.00", due: "Nov 15, 2026", status: "Pending" },
    { id: "#INV-2026-04", desc: "Term 1 Tuition Fee", amount: "$1,200.00", due: "Aug 10, 2026", status: "Paid" },
    { id: "#INV-2026-05", desc: "Library Fine", amount: "$15.00", due: "Sep 05, 2026", status: "Paid" },
    { id: "#INV-2026-02", desc: "Annual Sports Fee", amount: "$50.00", due: "Mar 15, 2026", status: "Paid" },
  ];

  const transactions = [
    { date: "Aug 10, 2026", id: "TXN-982341", desc: "Term 1 Tuition Fee", amount: "$1,200.00", method: "Online Payment" },
    { date: "Sep 05, 2026", id: "TXN-982567", desc: "Library Fine", amount: "$15.00", method: "Campus Desk" },
  ];

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
              {currentFees.map((fee, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{fee.id}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{fee.desc}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{fee.amount}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{fee.due}</td>
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

      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Transactions</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Transaction ID</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', background: '#f9fafb', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{txn.date}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{txn.id}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{txn.desc}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{txn.amount}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>{txn.method}</td>
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
