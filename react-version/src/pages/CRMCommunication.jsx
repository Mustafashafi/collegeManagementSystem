import React, { useState } from 'react';

const CRMCommunication = () => {
  const [activeTab, setActiveTab] = useState('Email');
  const [activeContact, setActiveContact] = useState(1);

  const contacts = [
    { id: 1, name: "John Doe", program: "B.Sc Computer Science", time: "Today", email: "johndoe@email.com" },
    { id: 2, name: "Emma Watson", program: "Business Admin", time: "Yesterday", email: "emma.w@email.com" },
    { id: 3, name: "David Smith", program: "Engineering", time: "Oct 20", email: "d.smith@email.com" },
  ];

  const currentContact = contacts.find(c => c.id === activeContact);

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Communication Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Send emails, SMS, and manage messaging templates.
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>

        {/* ── Left: Contacts Sidebar ── */}
        <div style={{ width: '260px', flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>

          {/* Sidebar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Recent Contacts</span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Bulk Select</span>
          </div>

          {/* Search */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px' }}>
              <i className="fas fa-search" style={{ fontSize: '12px', color: 'var(--text-muted)' }}></i>
              <input
                type="text"
                placeholder="Search leads..."
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: 'var(--text-main)', width: '100%' }}
              />
            </div>
          </div>

          {/* Contact List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActiveContact(contact.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: activeContact === contact.id ? '#f0f4ff' : '#fff',
                  borderLeft: activeContact === contact.id ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {contact.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{contact.program}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{contact.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Compose Panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#fff' }}>
            {[
              { key: 'Email', icon: 'fas fa-envelope', color: null },
              { key: 'SMS', icon: 'fas fa-comment', color: null },
              { key: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
            ].map(({ key, icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '14px 24px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeTab === key ? 600 : 500,
                  color: activeTab === key ? 'var(--primary)' : (color || 'var(--text-muted)'),
                  borderBottom: activeTab === key ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s',
                }}
              >
                <i className={icon} style={{ color: key === 'WhatsApp' ? '#25D366' : 'inherit' }}></i>
                {key}
              </button>
            ))}
          </div>

          {/* Compose Body */}
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Template Select */}
            <select
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)',
                outline: 'none', background: '#fff', cursor: 'pointer',
              }}
            >
              <option>Select a Template (Optional)</option>
              <option>Inquiry Response</option>
              <option>Application Follow-up</option>
              <option>Admission Confirmation</option>
              <option>Fee Reminder</option>
            </select>

            {/* To */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>To</label>
              <input
                type="text"
                value={currentContact?.email || ''}
                readOnly
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '13px', color: 'var(--text-main)',
                  background: '#fafafa', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Subject */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Subject</label>
              <input
                type="text"
                placeholder="Enter message subject..."
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '13px', color: 'var(--text-main)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Message Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Message Content</label>
              <textarea
                placeholder="Type your message here... Use [Name] to insert lead's name."
                style={{
                  flex: 1, minHeight: '200px', width: '100%', padding: '10px 12px',
                  border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px',
                  color: 'var(--text-main)', outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Compose Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border)', background: '#fff' }}>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 16px', border: '1px solid var(--border)', borderRadius: '8px',
                background: '#fff', color: 'var(--text-main)', fontSize: '13px',
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              <i className="fas fa-paperclip"></i> Attach File
            </button>
            <button
              onClick={() => alert('Message Sent!')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '9px 20px', border: 'none', borderRadius: '8px',
                background: 'var(--text-main)', color: '#fff', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMCommunication;