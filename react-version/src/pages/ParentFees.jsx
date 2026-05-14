import React, { useState, useEffect } from 'react';
import { parentApi } from '../services/api';
import toast from 'react-hot-toast';

const ParentFees = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showRecModal, setShowRecModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentApi.getChildren(user.email);
        const students = response.data.students || [];
        setChildren(students);
        if (students.length > 0) setSelectedChild(students[0]);
      } catch (err) {
        toast.error("Failed to fetch children");
      } finally {
        setLoading(false);
      }
    };
    if (user.email) fetchChildren();
  }, [user.email]);

  useEffect(() => {
    const fetchFees = async () => {
      if (!selectedChild) return;
      try {
        const response = await parentApi.getStudent360(selectedChild.studentId);
        setFees(response.data.fees || []);
      } catch (err) {
        toast.error("Failed to load fee records");
      }
    };
    fetchFees();
  }, [selectedChild]);

  const handlePayClick = (item) => {
    setActiveItem(item);
    setShowPayModal(true);
  };

  const handleRecClick = (item) => {
    setActiveItem(item);
    setShowRecModal(true);
  };

  const processPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success('Payment Successful! Your receipt is now available in Payment History.');
      setIsProcessing(false);
      setShowPayModal(false);
      // In a real app, we would refresh the fee list here
    }, 2000);
  };

  if (loading) return <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}><i className="fas fa-spinner fa-spin"></i></div>;

  const pendingInvoices = fees.filter(f => f.status !== 'Paid');
  const paymentHistory = fees.filter(f => f.status === 'Paid');

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Fee Management</h1>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>Monitor and pay educational invoices for your children.</p>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        {children.map(child => (
          <button 
            key={child._id} 
            onClick={() => setSelectedChild(child)}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              background: selectedChild?._id === child._id ? 'var(--primary)' : '#fff',
              color: selectedChild?._id === child._id ? '#fff' : '#1a1a1a',
              border: '1px solid #e5e7eb',
              cursor: 'pointer'
            }}
          >
            {child.firstName}
          </button>
        ))}
      </div>

      {/* Pending Invoices */}
      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pending Invoices</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingInvoices.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No pending invoices.</td></tr>
              ) : pendingInvoices.map((fee, idx) => (
                <tr key={idx}>
                  <td><strong>{fee.feeType}</strong></td>
                  <td>${fee.amount}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>{fee.status}</span></td>
                  <td>
                    <button onClick={() => handlePayClick(fee)} style={{ padding: '6px 12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Payment History</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fee Type</th>
                <th>Amount Paid</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No payment history found.</td></tr>
              ) : paymentHistory.map((fee, idx) => (
                <tr key={idx}>
                  <td><strong>{fee.feeType}</strong></td>
                  <td>${fee.amountPaid || fee.amount}</td>
                  <td>{new Date(fee.updatedAt || fee.dueDate).toLocaleDateString()}</td>
                  <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Paid</span></td>
                  <td>
                    <button onClick={() => handleRecClick(fee)} style={{ padding: '6px 12px', background: '#fff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal (Simplified) */}
      {showPayModal && activeItem && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ marginBottom: '20px' }}>Pay {activeItem.feeType}</h2>
            <p style={{ marginBottom: '10px' }}>Amount: <strong>${activeItem.amount}</strong></p>
            <button className="btn-confirm" onClick={processPayment} style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal (Simplified) */}
      {showRecModal && activeItem && (
        <div className="modal-overlay" onClick={() => setShowRecModal(false)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '90%' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: 'var(--primary)' }}>OFFICIAL RECEIPT</h2>
              <p>EduSystem College</p>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <p><strong>Student:</strong> {selectedChild?.firstName} {selectedChild?.lastName}</p>
              <p><strong>Fee Type:</strong> {activeItem.feeType}</p>
              <p><strong>Amount:</strong> ${activeItem.amountPaid || activeItem.amount}</p>
              <p><strong>Status:</strong> <span style={{ color: '#166534', fontWeight: 700 }}>PAID</span></p>
            </div>
            <button onClick={() => window.print()} style={{ marginTop: '30px', width: '100%', padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Download Receipt</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentFees;
