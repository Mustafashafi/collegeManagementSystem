import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CRMLeadProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentLead, setCurrentLead] = useState(state?.lead);
  const [status, setStatus] = useState(currentLead?.status || 'New Inquiry');
  const [updating, setUpdating] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!currentLead) {
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

  const fetchUpdatedLead = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads`);
      const data = await response.json();
      const leadData = data.find(l => l._id === currentLead.id);
      if (leadData) {
        const formattedLead = {
          ...leadData,
          id: leadData._id,
          name: `${leadData.firstName} ${leadData.lastName}`,
          added: new Date(leadData.added).toLocaleDateString()
        };
        setCurrentLead(formattedLead);
        setStatus(formattedLead.status);
      }
    } catch (err) {
      console.error('Error fetching updated lead:', err);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    const statusToUpdate = newStatus || status;
    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${currentLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusToUpdate })
      });

      if (response.ok) {
        await fetchUpdatedLead();
        toast.success('Status updated successfully!');
      } else {
        toast.error('Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Error connecting to server.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      toast.error('Please fill in both subject and message.');
      return;
    }

    setIsSending(true);
    const recipients = [{ email: currentLead.email, name: currentLead.name }];

    try {
      const response = await fetch('http://localhost:5000/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: emailSubject,
          message: emailMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Email sent successfully to ${currentLead.name}!`);
        setIsEmailModalOpen(false);
        setEmailSubject('');
        setEmailMessage('');
        
        // Auto-update status to Contacted if it was New Inquiry
        if (currentLead.status === 'New Inquiry') {
          await handleUpdateStatus('Contacted');
        }
      } else {
        toast.error(data.msg || 'Failed to send email.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      toast.error('Error connecting to email server.');
    } finally {
      setIsSending(false);
    }
  };

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
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Lead Profile: {currentLead.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-outline" 
            onClick={() => setIsEmailModalOpen(true)}
            style={{ padding: '8px 16px', background: '#fff', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fas fa-envelope"></i> Send Email
          </button>
        </div>
      </div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        {/* Left Panel - Basic Info */}
        <div className="panel" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Basic Information</h3>

          {[
            { label: 'Full Name', value: currentLead.name },
            { label: 'Email', value: currentLead.email },
            { label: 'Phone', value: currentLead.phone },
            { label: 'Program of Interest', value: currentLead.program },
            { label: 'Lead Source', value: currentLead.source },
            { label: 'Assigned Staff', value: currentLead.assigned },
            { label: 'Added', value: currentLead.added },
          ].map(({ label, value }) => (
            <div key={label} className="info-row" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>{label}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Current Status</span>
            <span className={`status-badge ${currentLead.statusClass}`}>{currentLead.status}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            >
              <option value="New Inquiry">New Inquiry</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Application Submitted">Application Submitted</option>
              <option value="Lost">Lost</option>
            </select>
            <button
              onClick={() => handleUpdateStatus()}
              disabled={updating}
              style={{ padding: '8px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: updating ? 0.7 : 1 }}
            >
              {updating ? '...' : 'Update'}
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
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Status Updated</div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                  <strong>Status:</strong> {currentLead.status}
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: '#6b7280', border: '2px solid #fff' }}></div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Added: {currentLead.added}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                  <strong>Lead Created:</strong> {currentLead.name} submitted inquiry via {currentLead.source}.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Email Modal ── */}
      {isEmailModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px',
              padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Send Email</h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1 }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>To</label>
              <div style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fafafa', fontSize: '14px', color: 'var(--text-main)' }}>
                {currentLead.name} ({currentLead.email})
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Subject</label>
              <input
                type="text"
                placeholder="Enter email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Message</label>
              <textarea
                rows={7}
                placeholder="Write your message here..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', color: 'var(--text-main)', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                disabled={isSending}
                style={{ padding: '10px 24px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                style={{ padding: '10px 24px', border: 'none', borderRadius: '8px', background: 'var(--text-main)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: isSending ? 0.7 : 1 }}
              >
                {isSending ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : <><i className="fas fa-paper-plane"></i> Send Email</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMLeadProfile;