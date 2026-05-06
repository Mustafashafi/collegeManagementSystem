import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CRMLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const data = await response.json();
      
      const formattedLeads = data.map(lead => ({
        ...lead,
        id: lead._id,
        name: `${lead.firstName} ${lead.lastName}`,
        added: new Date(lead.added).toLocaleDateString()
      }));
      setLeads(formattedLeads);
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast.error('Failed to fetch leads.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLeadSelection = (id) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(leads.map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const getSelectedLeads = () => {
    return leads.filter(l => selectedLeads.includes(l.id));
  };

  const handleRowClick = (lead) => {
    navigate('/crm/leads/profile', { state: { lead } });
  };

  const handleCheckboxClick = (e, id) => {
    e.stopPropagation();
    toggleLeadSelection(id);
  };

  const handleActionClick = (e, callback) => {
    e.stopPropagation();
    callback();
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      toast.error('Please fill in both subject and message.');
      return;
    }

    setIsSending(true);
    const recipients = getSelectedLeads().map(l => ({ email: l.email, name: l.name }));

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
        toast.success(`Emails sent successfully to ${data.sent} leads!`);
        
        // Update status for all recipients
        const updatePromises = selectedLeads.map(id => 
          fetch(`http://localhost:5000/api/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Contacted' })
          })
        );
        
        await Promise.all(updatePromises);
        
        setIsEmailModalOpen(false);
        setSelectedLeads([]);
        setEmailSubject('');
        setEmailMessage('');
        fetchLeads(); // Refresh list to show new status
      } else {
        toast.error(data.msg || 'Failed to send emails.');
      }
    } catch (err) {
      console.error('Error sending emails:', err);
      toast.error('Error connecting to email server.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteLead = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Lead deleted successfully');
        fetchLeads(); // Refresh list
      } else {
        toast.error(data.msg || 'Failed to delete lead');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error('Error connecting to server');
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Leads & Inquiries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage all prospective student inquiries.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/crm/leads/add')}>
          <i className="fas fa-plus"></i> Add New Lead
        </button>
      </div>

      {selectedLeads.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info"><span>{selectedLeads.length}</span> leads selected</div>
          <div className="bulk-btns">
            <button className="btn-bulk" onClick={() => setSelectedLeads([])}>Clear Selection</button>
            <button className="btn-bulk-primary btn-bulk" onClick={() => setIsEmailModalOpen(true)}>
              <i className="fas fa-envelope"></i> Send Bulk Email
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search by name, email or phone..." />
          </div>
          <select className="filter-select">
            <option>All Statuses</option>
            <option>New Inquiry</option>
            <option>Contacted</option>
            <option>Interested</option>
          </select>
          <select className="filter-select">
            <option>All Sources</option>
            <option>Website</option>
            <option>Social Media</option>
            <option>Walk-in</option>
          </select>
          <select className="filter-select">
            <option>Dated by Any</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                />
              </th>
              <th>Student Name</th>
              <th>Program of Interest</th>
              <th>Contact Details</th>
              <th>Source</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                  Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No leads found. Submissions from the public admission page will appear here.
                </td>
              </tr>
            ) : leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => handleRowClick(lead)}
                style={{ cursor: 'pointer' }}
              >
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleLeadSelection(lead.id)}
                    onClick={(e) => handleCheckboxClick(e, lead.id)}
                  />
                </td>
                <td>
                  <strong>{lead.name}</strong><br />
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Added: {lead.added}</span>
                </td>
                <td>{lead.program}</td>
                <td>{lead.email}<br />{lead.phone}</td>
                <td>{lead.source}</td>
                <td>
                  <span
                    className={`status-badge ${lead.statusClass}`}
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td>{lead.assigned || 'Unassigned'}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn-icon"
                      title="Delete"
                      onClick={(e) => handleDeleteLead(e, lead.id)}
                      style={{ color: '#ef4444' }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      className="btn-icon"
                      title="Email"
                      onClick={(e) => handleActionClick(e, () => {
                        setSelectedLeads([lead.id]);
                        setIsEmailModalOpen(true);
                      })}
                    >
                      <i className="fas fa-envelope"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Send Email</h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1 }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* To — recipients */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                To ({selectedLeads.length} {selectedLeads.length === 1 ? 'Recipient' : 'Recipients'})
              </label>
              <div
                style={{
                  display: 'flex', flexWrap: 'wrap', gap: '8px',
                  padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', minHeight: '44px', background: '#fafafa',
                  maxHeight: '120px', overflowY: 'auto'
                }}
              >
                {getSelectedLeads().map((lead) => (
                  <span
                    key={lead.id}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#fff', border: '1px solid var(--border)',
                      borderRadius: '20px', padding: '3px 10px',
                      fontSize: '13px', fontWeight: 500, color: 'var(--text-main)',
                    }}
                  >
                    {lead.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                  color: 'var(--text-main)', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email Message */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Email Message
              </label>
              <textarea
                rows={7}
                placeholder="Write your message here..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical',
                  color: 'var(--text-main)', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                disabled={isSending}
                style={{
                  padding: '10px 24px', border: '1px solid var(--border)', borderRadius: '8px',
                  background: '#fff', color: 'var(--text-main)', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                style={{
                  padding: '10px 24px', border: 'none', borderRadius: '8px',
                  background: 'var(--text-main)', color: '#fff', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '8px',
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
      )}
    </div>
  );
};

export default CRMLeads;