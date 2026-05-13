import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminFees = () => {
  const queryClient = useQueryClient();
  const [showReceipt, setShowReceipt] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [programFilter, setProgramFilter] = useState('All Programs');

  const { data: fees, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminFees', statusFilter, programFilter],
    queryFn: () => adminApi.getFees({ status: statusFilter, program: programFilter }).then(res => res.data),
  });

  const { data: programs } = useQuery({
    queryKey: ['adminPrograms'],
    queryFn: () => adminApi.getPrograms().then(res => res.data),
  });

  const recordMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFees']);
      queryClient.invalidateQueries(['adminStats']);
      toast.success('Payment recorded successfully!');
      setShowRecord(false);
      setPaymentAmount('');
    },
    onError: () => {
      toast.error('Failed to record payment.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFees']);
      toast.success('Invoice deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete invoice.');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteMutation.mutate(id);
    }
  };

  const totalExpected = fees?.reduce((acc, f) => acc + f.amount, 0) || 0;
  const totalCollected = fees?.reduce((acc, f) => acc + (f.amountPaid || 0), 0) || 0;
  const totalOutstanding = totalExpected - totalCollected;

  const stats = [
    { label: "Total Expected", value: `$${totalExpected.toLocaleString()}`, icon: "fas fa-money-check-alt" },
    { label: "Collected (This Term)", value: `$${totalCollected.toLocaleString()}`, icon: "fas fa-chart-line", color: "#10b981" },
    { label: "Outstanding Dues", value: `$${totalOutstanding.toLocaleString()}`, icon: "fas fa-exclamation-circle", color: "#ef4444" },
  ];

  const handleRecordPayment = () => {
    if (!paymentAmount || isNaN(paymentAmount)) return toast.error('Please enter a valid amount');
    recordMutation.mutate({
      id: selectedInvoice._id,
      data: { amountPaid: paymentAmount, mode: paymentMode }
    });
  };

  const openReceipt = (inv) => {
    setSelectedInvoice(inv);
    setShowReceipt(true);
  };

  const openRecord = (inv) => {
    setSelectedInvoice(inv);
    setShowRecord(true);
  };

  const handleFilter = () => {
    refetch();
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
          <select 
            className="form-control" 
            style={{ padding: '9px', fontSize: '13px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Paid (Full)</option>
            <option>Unpaid / Overdue</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Academic Program</label>
          <select 
            className="form-control" 
            style={{ padding: '9px', fontSize: '13px' }}
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
          >
            <option>All Programs</option>
            {[...new Set(programs?.map(p => p.name))].map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleFilter}><i className="fas fa-filter"></i> Filter</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent Transactions & Invoices</h3>
        </div>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--primary)' }}></i>
            <p>Loading fee records...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Student Name & Email</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees?.map((inv, idx) => (
                <tr key={inv._id || idx}>
                  <td><strong>{inv.invoiceId || `INV-${idx + 1}`}</strong></td>
                  <td>{inv.studentName || 'Student'}<br /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.studentEmail}</span></td>
                  <td>{inv.feeType}</td>
                  <td>${inv.amount.toLocaleString()}</td>
                  <td>${(inv.amountPaid || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${inv.status === 'Paid' ? 'status-paid' : inv.status === 'Partial' ? 'status-partial' : 'status-unpaid'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {inv.status === 'Paid' ? (
                        <>
                          <button className="btn-sm" onClick={() => openReceipt(inv)}><i className="fas fa-print"></i> Receipt</button>
                          <button className="btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(inv._id)} title="Delete"><i className="fas fa-trash"></i></button>
                        </>
                      ) : (
                        <>
                          <button className="btn-sm" onClick={() => openRecord(inv)}>Record Payment</button>
                          <button className="btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(inv._id)} title="Delete"><i className="fas fa-trash"></i></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
            </div>
            <div className="receipt-body">
              <div className="receipt-watermark">PAID</div>
              <div className="receipt-info-grid">
                <div className="info-item"><label>Receipt No</label><span>{selectedInvoice.invoiceId}</span></div>
                <div className="info-item"><label>Date Issued</label><span>{new Date().toLocaleDateString()}</span></div>
                <div className="info-item"><label>Student Email</label><span>{selectedInvoice.studentEmail}</span></div>
              </div>
              <table className="receipt-table">
                <thead><tr><th>Description</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                <tbody>
                  <tr><td>{selectedInvoice.feeType}</td><td style={{ textAlign: 'right', fontWeight: 600 }}>${selectedInvoice.amount}</td></tr>
                </tbody>
              </table>
              <div className="receipt-total">
                <div className="total-item"><label>Grand Total: </label><span>${selectedInvoice.amount}</span></div>
              </div>
            </div>
            <div className="receipt-footer">
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
                <p><strong>Student:</strong> {selectedInvoice.studentEmail}</p>
                <p><strong>Amount Due:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>${selectedInvoice.amount - (selectedInvoice.amountPaid || 0)}</span></p>
              </div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select className="form-control" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online Transfer</option>
                  <option value="Cheque">Cheque / DD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount Received</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter amount" 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <button 
                className="btn-submit-payment" 
                onClick={handleRecordPayment}
                disabled={recordMutation.isLoading}
              >
                {recordMutation.isLoading ? 'Recording...' : 'Confirm & Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
