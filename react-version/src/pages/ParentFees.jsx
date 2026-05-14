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

  const [paymentMode, setPaymentMode] = useState('Bank Transfer (HBL)');

  const processPayment = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('receipt-upload');
    if (!fileInput.files || fileInput.files.length === 0) {
      toast.error('Please select a receipt file to upload.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('receipt', fileInput.files[0]);
      formData.append('paymentMode', paymentMode);
      
      const response = await parentApi.uploadFeeReceipt(activeItem._id, formData);
      toast.success(response.data.msg || 'Receipt uploaded successfully!');
      
      // Update local state
      setFees(fees.map(f => f._id === activeItem._id ? response.data.fee : f));
      setShowPayModal(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to upload receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}><i className="fas fa-spinner fa-spin"></i></div>;

  const pendingInvoices = fees.filter(f => f.status !== 'Paid');
  const paymentHistory = fees.filter(f => f.status === 'Paid');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>Pending</span>;
      case 'Under Review': return <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>Under Review</span>;
      case 'Rejected': return <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>Rejected</span>;
      default: return <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#f3f4f6', color: '#374151' }}>{status}</span>;
    }
  };

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
                  <td>
                    <strong>{fee.feeType}</strong>
                    {fee.status === 'Rejected' && fee.rejectionReason && (
                      <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>Reason: {fee.rejectionReason}</div>
                    )}
                  </td>
                  <td>${fee.amount}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(fee.status)}</td>
                  <td>
                    {fee.status === 'Under Review' ? (
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Processing...</span>
                    ) : (
                      <button onClick={() => handlePayClick(fee)} style={{ padding: '6px 12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        {fee.status === 'Rejected' ? 'Re-upload Receipt' : 'Pay / Upload Receipt'}
                      </button>
                    )}
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

      {/* Payment Modal */}
      {showPayModal && activeItem && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ marginBottom: '20px' }}>Upload Payment Receipt</h2>
            <p style={{ marginBottom: '10px' }}>Fee Type: <strong>{activeItem.feeType}</strong></p>
            <p style={{ marginBottom: '20px' }}>Amount Due: <strong style={{ color: '#b91c1c' }}>${activeItem.amount}</strong></p>
            
            <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#111827' }}>Payment Instructions</h4>
              <p style={{ marginBottom: '8px', color: '#4b5563' }}>Please transfer the exact amount to any of the accounts below, then upload the receipt/screenshot here.</p>
              <div style={{ marginBottom: '10px' }}>
                <p><strong>🏦 Bank Transfer (HBL)</strong></p>
                <p>Title: EduSystem College</p>
                <p>A/C: 1234-5678901-23</p>
              </div>
              <div>
                <p><strong>📱 EasyPaisa / JazzCash</strong></p>
                <p>Title: EduSystem Admin</p>
                <p>Phone: 0300-1234567</p>
              </div>
            </div>

            <form onSubmit={processPayment}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Payment Method Used</label>
                <select 
                  value={paymentMode} 
                  onChange={(e) => setPaymentMode(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff' }}
                >
                  <option value="Bank Transfer (HBL)">Bank Transfer (HBL)</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Other Online Transfer">Other Online Transfer</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>Select Receipt Image/PDF</label>
                <input 
                  type="file" 
                  id="receipt-upload" 
                  accept="image/*,.pdf" 
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
              <button type="submit" disabled={isProcessing} style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 }}>
                {isProcessing ? 'Uploading...' : 'Submit Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal (Premium Design) */}
      {showRecModal && activeItem && (
        <div className="modal-overlay" onClick={() => setShowRecModal(false)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', maxWidth: '600px', width: '95%', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Watermark */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '120px', fontWeight: 900, color: 'rgba(34, 197, 94, 0.05)', zIndex: 0, pointerEvents: 'none', letterSpacing: '10px' }}>
              PAID
            </div>

            <div style={{ padding: '40px', position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #e5e7eb', paddingBottom: '24px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', margin: 0, letterSpacing: '-0.5px' }}>EDUSYSTEM</h2>
                  <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>College of Excellence</p>
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>123 Education Ave, NY 10001</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i> OFFICIAL RECEIPT
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}><strong>Receipt No:</strong> {activeItem.invoiceId || `REC-${activeItem._id.substring(0,6).toUpperCase()}`}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}><strong>Date:</strong> {new Date(activeItem.updatedAt || activeItem.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Student & Payment Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>Billed To</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedChild?.firstName} {selectedChild?.lastName}</p>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>ID: {selectedChild?.studentId}</p>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>{selectedChild?.program || 'Academic Program'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>Payment Details</p>
                  <p style={{ fontSize: '13px', color: '#0f172a', margin: 0 }}><strong>Method:</strong> {activeItem.paymentHistory?.[activeItem.paymentHistory.length - 1]?.mode || 'Online Transfer'}</p>
                  <p style={{ fontSize: '13px', color: '#0f172a', marginTop: '4px' }}><strong>Status:</strong> Completed Successfully</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{activeItem.feeType}</td>
                    <td style={{ padding: '16px 8px', fontSize: '14px', color: '#1e293b', textAlign: 'right', fontWeight: 600 }}>${activeItem.amount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Total Section */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #e2e8f0', paddingTop: '20px', marginBottom: '40px' }}>
                <div style={{ width: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#475569' }}>
                    <span>Subtotal</span>
                    <span>${activeItem.amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#475569' }}>
                    <span>Amount Paid</span>
                    <span style={{ color: '#166534', fontWeight: 600 }}>-${activeItem.amountPaid || activeItem.amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    <span>Balance Due</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => window.print()} style={{ flex: 1, padding: '14px', background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <i className="fas fa-print" style={{ marginRight: '8px' }}></i> Print / Save PDF
                </button>
                <button onClick={() => setShowRecModal(false)} style={{ padding: '14px 24px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#94a3b8' }}>
                This is a computer-generated receipt and does not require a physical signature.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentFees;
