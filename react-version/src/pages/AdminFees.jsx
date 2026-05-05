import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminFees = () => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const stats = [
    { label: "Total Expected", value: "$125,000", icon: "fas fa-money-check-alt" },
    { label: "Collected (This Term)", value: "$98,450", icon: "fas fa-chart-line", color: "#10b981" },
    { label: "Outstanding Dues", value: "$26,550", icon: "fas fa-exclamation-circle", color: "#ef4444" },
  ];

  const invoices = [
    { id: "INV-2026-1042", student: "Michael Chen", sid: "S-2024-001", type: "Term 2 Tuition Fee", amount: "$1,200.00", due: "Nov 15, 2026", status: "Unpaid", statusClass: "status-unpaid" },
    { id: "INV-2026-1041", student: "Sarah Williams", sid: "S-2023-042", type: "Term 2 Tuition Fee", amount: "$1,200.00", due: "Nov 15, 2026", status: "Paid", statusClass: "status-paid" },
    { id: "INV-2026-0988", student: "James Rodriguez", sid: "S-2025-112", type: "Admission Fee", amount: "$500.00", due: "Oct 01, 2026", status: "Partial ($250)", statusClass: "status-partial" },
  ];

  const openReceipt = (inv) => {
    setSelectedInvoice(inv);
    setShowReceipt(true);
  };

  const openRecord = (inv) => {
    setSelectedInvoice(inv);
    setShowRecord(true);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Fee Management</h1>
          <p>Monitor fee collections, outstanding dues, and generate invoices.</p>
        </div>
        <Link to="/admin/generate-invoice" className="btn-primary"><i className="fas fa-file-invoice"></i> Generate Invoice</Link>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</span>
              <i className={stat.icon} style={{ fontSize: '20px', color: stat.color || 'var(--primary)' }}></i>
            </div>
            <div className="stat-val" style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Payment Status</label>
          <select className="form-control" style={{ padding: '9px', fontSize: '13px' }}>
            <option>All Status</option>
            <option>Paid (Full)</option>
            <option>Unpaid / Overdue</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Academic Program</label>
          <select className="form-control" style={{ padding: '9px', fontSize: '13px' }}>
            <option>All Programs</option>
            <option>B.Sc Computer Science</option>
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button className="btn-primary" style={{ padding: '10px 24px' }}><i className="fas fa-filter"></i> Filter</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent Transactions & Invoices</h3>
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search by student or invoice #" />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Student Name & ID</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={idx}>
                <td><strong>{inv.id}</strong></td>
                <td>{inv.student}<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.sid}</span></td>
                <td>{inv.type}</td>
                <td>{inv.amount}</td>
                <td>{inv.due}</td>
                <td><span className={`status-badge ${inv.statusClass}`}>{inv.status}</span></td>
                <td>
                  <div className="action-btns">
                    {inv.status === 'Paid' ? (
                      <button className="btn-sm" onClick={() => openReceipt(inv)}><i className="fas fa-print"></i> Receipt</button>
                    ) : (
                      <>
                        <button className="btn-sm" onClick={() => openRecord(inv)}>Record Payment</button>
                        <button className="btn-sm"><i className="fas fa-bell"></i></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowReceipt(false)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowReceipt(false)}>&times;</button>
            <div className="receipt-header">
              <div>
                <h2>Official Fee Receipt</h2>
                <p>EduSystem College of Excellence</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <i className="fas fa-graduation-cap" style={{ fontSize: '32px', opacity: 0.5 }}></i>
              </div>
            </div>
            <div className="receipt-body">
              <div className="receipt-watermark">PAID</div>
              <div className="receipt-info-grid">
                <div className="info-item"><label>Receipt No</label><span>{selectedInvoice.id}</span></div>
                <div className="info-item"><label>Date Issued</label><span>October 30, 2026</span></div>
                <div className="info-item"><label>Student Name</label><span>{selectedInvoice.student}</span></div>
                <div className="info-item"><label>Student ID</label><span>{selectedInvoice.sid}</span></div>
              </div>
              <table className="receipt-table">
                <thead><tr><th>Description</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>
                  <tr><td>{selectedInvoice.type}</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{selectedInvoice.amount}</td></tr>
                </tbody>
              </table>
              <div className="receipt-total">
                <div className="total-item"><label>Grand Total: </label><span>{selectedInvoice.amount}</span></div>
              </div>
            </div>
            <div className="receipt-footer">
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>This is a computer-generated receipt.</p>
              <button className="btn-primary" onClick={() => window.print()}><i className="fas fa-print"></i> Print Receipt</button>
            </div>
          </div>
        </div>
      )}

      {/* Record Modal */}
      {showRecord && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowRecord(false)}>
          <div className="record-modal" onClick={(e) => e.stopPropagation()}>
            <div className="record-header">
              <h2>Record Offline Payment</h2>
              <button onClick={() => setShowRecord(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div className="record-body">
              <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <p><strong>Student:</strong> {selectedInvoice.student}</p>
                <p><strong>Invoice:</strong> #{selectedInvoice.id}</p>
                <p><strong>Amount Due:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>{selectedInvoice.amount}</span></p>
              </div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select className="form-control"><option>Cash</option><option>Cheque / DD</option></select>
              </div>
              <div className="form-group">
                <label>Amount Received</label>
                <input type="text" className="form-control" placeholder="Enter amount" />
              </div>
              <button className="btn-submit-payment" onClick={() => setShowRecord(false)}>Confirm & Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
