import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CRMLeadProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const lead = state?.lead;

  if (!lead) {
    return (
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-user-slash" style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px' }}></i>
          <h2 style={{ marginBottom: '8px' }}>No Lead Data Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Please go back and select a lead from the list.</p>
          <button className="btn-primary" onClick={() => navigate('/crm/leads')}>
            <i className="fas fa-arrow-left"></i> Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/crm/leads')}
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Lead Profile: {lead.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline" style={{ padding: '8px 16px', background: '#fff', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-envelope"></i> Send Email
          </button>
          <button className="btn-outline" style={{ padding: '8px 16px', background: '#fff', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-calendar-plus"></i> Add Task
          </button>
        </div>
      </div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        {/* Left Panel - Basic Info */}
        <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Basic Information</h3>

          {[
            { label: 'Full Name', value: lead.name },
            { label: 'Email', value: lead.email },
            { label: 'Phone', value: lead.phone },
            { label: 'Program of Interest', value: lead.program },
            { label: 'Lead Source', value: lead.source },
            { label: 'Assigned Staff', value: lead.assigned },
            { label: 'Added', value: lead.added },
          ].map(({ label, value }) => (
            <div key={label} className="info-row" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>{label}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Current Status</span>
            <span className={`status-badge ${lead.statusClass}`}>{lead.status}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <select
              defaultValue={lead.status}
              style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            >
              <option value="New Inquiry">New Inquiry</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Application Submitted">Application Submitted</option>
              <option value="Lost">Lost</option>
            </select>
            <button style={{ padding: '8px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Update
            </button>
          </div>
        </div>

        {/* Right Panel - Activity */}
        <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Activity & Follow-up History</h3>
          <div style={{ position: 'relative', paddingLeft: '20px', marginTop: '10px', borderLeft: '2px solid var(--border)' }}>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid #fff' }}></div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Today, 10:30 AM</div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                  <strong>Status Changed:</strong> Moved to "{lead.status}" by {lead.assigned}.
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid #fff' }}></div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Today, 10:15 AM</div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                  <strong>Call Logged:</strong> Spoke with {lead.name}. Interested in {lead.program}. Emailed brochure.
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: '#6b7280', border: '2px solid #fff' }}></div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Added: {lead.added}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                  <strong>Lead Created:</strong> {lead.name} submitted inquiry via {lead.source}.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMLeadProfile;