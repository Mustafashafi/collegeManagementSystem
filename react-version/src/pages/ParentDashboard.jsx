import React from 'react';

const ParentDashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Parent Overview</h1>
          <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Monitor your child's academic progress, attendance, and fee status.</p>
        </div>
      </div>

      <div className="child-selector" style={{ background: '#fff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}>
        <div className="child-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-user-graduate" style={{ color: '#9ca3af', fontSize: '14px' }}></i>
        </div>
        <div className="child-info">
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Michael Chen</h4>
          <p style={{ fontSize: '11px', color: '#6b7280' }}>B.Sc Computer Science • 2nd Year</p>
        </div>
        <i className="fas fa-chevron-down" style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '16px' }}></i>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attendance</span>
          </div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>85%</div>
          <div className="stat-desc" style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>Good Standing</div>
          <i className="fas fa-user-check" style={{ fontSize: '16px', color: '#111827', position: 'absolute', top: '24px', right: '24px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Latest Grade</span>
          </div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>A-</div>
          <div className="stat-desc" style={{ fontSize: '12px', color: '#6b7280' }}>Data Structures Exam</div>
          <i className="fas fa-award" style={{ fontSize: '16px', color: '#111827', position: 'absolute', top: '24px', right: '24px' }}></i>
        </div>
        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Fees</span>
          </div>
          <div className="stat-val" style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>$0.00</div>
          <div className="stat-desc" style={{ fontSize: '12px', color: '#6b7280' }}>All dues cleared</div>
          <i className="fas fa-file-invoice" style={{ fontSize: '16px', color: '#111827', position: 'absolute', top: '24px', right: '24px' }}></i>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="panel" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Fee Invoices</h3>
            <button className="btn-sm" style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>View History</button>
          </div>
          <div className="list-content" style={{ padding: '20px' }}>
            <div className="item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div className="item-info">
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Term 2 Tuition Fee</h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Due: Nov 15, 2026</p>
              </div>
              <div className="item-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span className="badge-status" style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#fee2e2', color: '#ef4444' }}>Pending: $1,200</span>
                <button className="btn-pay" style={{ background: '#111827', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
              </div>
            </div>
            <div className="item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <div className="item-info">
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Term 1 Tuition Fee</h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Paid on: Aug 10, 2026</p>
              </div>
              <div className="item-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="badge-status" style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#dcfce7', color: '#10b981' }}>Paid: $1,200</span>
              </div>
            </div>
            <div className="item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="item-info">
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Library Fine</h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Paid on: Sep 05, 2026</p>
              </div>
              <div className="item-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="badge-status" style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: '#dcfce7', color: '#10b981' }}>Paid: $15</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Recent Communications</h3>
            <button className="btn-sm" style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Contact School</button>
          </div>
          <div className="list-content" style={{ padding: '20px' }}>
            <div className="notice-item" style={{ padding: '16px', borderRadius: '6px', border: '1px solid #f3f4f6', marginBottom: '16px' }}>
              <div className="notice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Parent-Teacher Meeting</h4>
                <span className="notice-date" style={{ fontSize: '10px', color: '#9ca3af' }}>Oct 20, 2026</span>
              </div>
              <div className="notice-body" style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
                Dear Parents, the termly Parent-Teacher meeting is scheduled for next Friday, Oct 30th. Please book your slots through the portal.
              </div>
            </div>
            <div className="notice-item" style={{ padding: '16px', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
              <div className="notice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Holiday Notice</h4>
                <span className="notice-date" style={{ fontSize: '10px', color: '#9ca3af' }}>Oct 15, 2026</span>
              </div>
              <div className="notice-body" style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>
                The college will remain closed on Monday, Oct 19th due to the public holiday. Classes will resume normally from Tuesday.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ParentDashboard;
