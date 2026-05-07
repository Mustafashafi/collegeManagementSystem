import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const CRMPipeline = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Email Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedLeadForEmail, setSelectedLeadForEmail] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`);
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchLeads(); // Refresh data
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      toast.error('Please fill in both subject and message.');
      return;
    }

    setIsSending(true);
    const recipients = [{ email: selectedLeadForEmail.email, name: `${selectedLeadForEmail.firstName} ${selectedLeadForEmail.lastName}` }];

    try {
      const response = await fetch(`${API_BASE_URL}/api/email/send`, {
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
        toast.success(`Email sent successfully!`);
        setIsEmailModalOpen(false);
        setEmailSubject('');
        setEmailMessage('');
        
        // Auto-update status to Contacted if it was New Inquiry
        if (selectedLeadForEmail.status === 'New Inquiry') {
          await handleUpdateStatus(selectedLeadForEmail._id, 'Contacted');
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

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status).map(lead => ({
      ...lead,
      id: lead._id,
      name: `${lead.firstName} ${lead.lastName}`,
      contact: lead.email,
      staff: lead.assigned?.substring(0, 2).toUpperCase() || 'UN',
      staffTitle: lead.assigned || 'Unassigned'
    }));
  };

  const columns = [
    { title: "New Inquiry", cards: getLeadsByStatus("New Inquiry") },
    { title: "Contacted", titleColor: "#92400e", cards: getLeadsByStatus("Contacted") },
    { title: "Interested", titleColor: "#166534", cards: getLeadsByStatus("Interested") },
    { title: "Application Submitted", titleColor: "#1e40af", cards: getLeadsByStatus("Application Submitted") },
    { title: "Lost / Rejected", titleColor: "#b91c1c", cards: getLeadsByStatus("Lost") }
  ];

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <p>Loading Pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ height: 'calc(100vh - 70px)' }}>
      <div className="page-header">
        <div>
          <h1>Admission Pipeline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Visual overview of lead progression.</p>
        </div>
        <Link className="btn-primary" to={"/crm/leads/add"}><i className="fas fa-plus"></i> Add Lead</Link>
      </div>

      <div className="kanban-board">
        {columns.map((col, idx) => (
          <div className="kanban-column" key={idx}>
            <div className="column-header">
              <span className="column-title" style={col.titleColor ? { color: col.titleColor } : {}}>{col.title}</span>
              <span className="column-count">{col.cards.length}</span>
            </div>
            <div className="column-body" style={!col.cards?.length ? { justifyContent: 'center', alignItems: 'center' } : {}}>
              {col.cards?.length ? (
                col.cards.map((card) => (
                  <div 
                    className="kanban-card" 
                    key={card.id} 
                    onClick={() => navigate('/crm/leads/profile', { state: { lead: card } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-title">{card.name}</div>
                    <div className="card-program">{card.program}</div>
                    <div className="card-meta">
                      <div className="card-contact">
                        <i className={card.contact.includes('@') ? "fas fa-envelope" : "fas fa-phone"}></i> {card.contact}
                      </div>
                      <div className="card-staff" title={card.staffTitle}>{card.staff}</div>
                    </div>
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="card-action-btn"
                        onClick={() => {
                          setSelectedLeadForEmail(card);
                          setIsEmailModalOpen(true);
                        }}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <i className="fas fa-envelope"></i> Send Email
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drop cards here</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Email Modal ── */}
      {isEmailModalOpen && selectedLeadForEmail && (
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
                {selectedLeadForEmail.name} ({selectedLeadForEmail.email})
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

export default CRMPipeline;
