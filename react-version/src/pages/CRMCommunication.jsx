import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const CRMCommunication = () => {
  const [leads, setLeads] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Email Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`);
      const data = await response.json();
      setLeads(data);
      if (data.length > 0) setActiveContactId(data[0]._id);
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const activeContact = leads.find(l => l._id === activeContactId);

  const filteredLeads = leads.filter(l => 
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!activeContact) {
      toast.error('Please select a contact first');
      return;
    }
    if (!subject || !message) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: [{ email: activeContact.email, name: `${activeContact.firstName} ${activeContact.lastName}` }],
          subject,
          message
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Email sent successfully!');
        setSubject('');
        setMessage('');
      } else {
        toast.error(data.msg || 'Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      toast.error('Connection error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Communication Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Send professional emails directly to your leads.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>

        {/* ── Left: Contacts Sidebar ── */}
        <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '600px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Recent Leads</span>
          </div>

          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px' }}>
              <i className="fas fa-search" style={{ fontSize: '12px', color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: 'var(--text-main)', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i></div>
            ) : filteredLeads.map((lead) => (
              <div
                key={lead._id}
                onClick={() => setActiveContactId(lead._id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: activeContactId === lead._id ? '#f0f4ff' : '#fff',
                  borderLeft: activeContactId === lead._id ? '3px solid var(--primary)' : '3px solid transparent',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {lead.firstName} {lead.lastName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.program}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(lead.added).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Compose Panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#fff' }}>
            <button
              style={{
                padding: '14px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--primary)',
                borderBottom: '2px solid var(--primary)',
                marginBottom: '-1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <i className="fas fa-envelope"></i> Email
            </button>
          </div>

          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>To</label>
              <input
                type="text"
                value={activeContact ? `${activeContact.firstName} ${activeContact.lastName} <${activeContact.email}>` : 'Select a contact'}
                readOnly
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '13px', color: 'var(--text-main)',
                  background: '#fafafa', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Subject</label>
              <input
                type="text"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '13px', color: 'var(--text-main)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Message Content</label>
              <textarea
                placeholder="Type your email here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: 1, minHeight: '250px', width: '100%', padding: '10px 12px',
                  border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px',
                  color: 'var(--text-main)', outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid var(--border)', background: '#fff' }}>
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px', border: 'none', borderRadius: '8px',
                background: 'var(--text-main)', color: '#fff', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer',
                opacity: isSending ? 0.7 : 1
              }}
            >
              {isSending ? (
                <><i className="fas fa-spinner fa-spin"></i> Sending...</>
              ) : (
                <><i className="fas fa-paper-plane"></i> Send Email</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMCommunication;