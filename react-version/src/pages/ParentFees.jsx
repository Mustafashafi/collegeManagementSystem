import React, { useState } from 'react';

const ParentFees = () => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [showRecModal, setShowRecModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      alert('Payment Successful! Your receipt is now available in Payment History.');
      setIsProcessing(false);
      setShowPayModal(false);
    }, 2000);
  };

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Fee Management: Michael Chen</h1>
      </div>

      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pending Invoices</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Invoice ID</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Due Date</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>#INV-2026-11</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Term 2 Tuition Fee</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>$1,200.00</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Nov 15, 2026</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}><span className="badge-status status-unpaid" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' }}>Pending</span></td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>
                  <button className="btn-pay" onClick={() => handlePayClick({ id: 'INV-2026-11', desc: 'Term 2 Tuition Fee', amount: '$1,200.00' })} style={{ padding: '6px 12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '24px' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Payment History</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Invoice ID</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Paid Date</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ background: '#f9fafb', padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>#INV-2026-04</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Term 1 Tuition Fee</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>$1,200.00</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Aug 10, 2026</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}><span className="badge-status status-paid" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Paid</span></td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>
                  <button className="btn-receipt" onClick={() => handleRecClick({ id: 'INV-2026-04', desc: 'Term 1 Tuition Fee', amount: '$1,200.00', date: 'Aug 10, 2026' })} style={{ padding: '6px 12px', background: '#fff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Receipt</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>#INV-2026-05</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Library Fine</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>$15.00</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>Sep 05, 2026</td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}><span className="badge-status status-paid" style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>Paid</span></td>
                <td style={{ padding: '14px 20px', fontSize: '13px', borderBottom: '1px solid #e5e7eb' }}>
                  <button className="btn-receipt" onClick={() => handleRecClick({ id: 'INV-2026-05', desc: 'Library Fine', amount: '$15.00', date: 'Sep 05, 2026' })} style={{ padding: '6px 12px', background: '#fff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Receipt</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showPayModal && activeItem && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-header">
              <h2>Complete Payment</h2>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div className="pay-body">
              <div className="summary-card">
                <div className="summary-row">
                  <span>Description:</span>
                  <span style={{ fontWeight: 600 }}>{activeItem.desc}</span>
                </div>
                <div className="summary-row">
                  <span>Invoice ID:</span>
                  <span>{activeItem.id}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>{activeItem.amount}</span>
                </div>
              </div>

              <div className="payment-methods">
                <div className="method-card active">
                  <i className="fas fa-credit-card"></i>
                  <span>Card</span>
                </div>
                <div className="method-card">
                  <i className="fas fa-university"></i>
                  <span>Bank</span>
                </div>
              </div>

              <div className="input-group">
                <label>Card Number</label>
                <input type="text" placeholder="**** **** **** ****" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>CVV</label>
                  <input type="password" placeholder="***" />
                </div>
              </div>

              <button className="btn-confirm" onClick={processPayment} disabled={isProcessing} style={{ opacity: isProcessing ? 0.7 : 1 }}>
                {isProcessing ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-lock"></i> Pay Securely</>}
              </button>

              <div className="secure-tag">
                <i className="fas fa-shield-alt"></i> 256-bit SSL Secure Encryption
              </div>
            </div>
          </div>
        </div>
      )}

      {showRecModal && activeItem && (
        <div className="modal-overlay" onClick={() => setShowRecModal(false)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowRecModal(false)}>&times;</button>
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
                <div className="info-item">
                  <label>Receipt No</label>
                  <span>{activeItem.id}</span>
                </div>
                <div className="info-item">
                  <label>Date Issued</label>
                  <span>{activeItem.date}</span>
                </div>
                <div className="info-item">
                  <label>Student Name</label>
                  <span>Michael Chen</span>
                </div>
                <div className="info-item">
                  <label>Student ID</label>
                  <span>S-2024-001</span>
                </div>
              </div>

              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{activeItem.desc}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{activeItem.amount}</td>
                  </tr>
                  <tr>
                    <td>Service Charge</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>$0.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="receipt-total">
                <div className="total-item">
                  <label>Total Paid: </label>
                  <span>{activeItem.amount}</span>
                </div>
              </div>

              <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Payment Method</p>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}><i className="fas fa-credit-card" style={{ marginRight: '6px' }}></i>Online Payment</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '120px', borderBottom: '1px solid #333', marginBottom: '5px' }}></div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Digital Signature</p>
                </div>
              </div>
            </div>

            <div className="receipt-footer">
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thank you for your payment.</p>
              <button className="btn-primary" onClick={() => window.print()}><i className="fas fa-download"></i> Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentFees;
