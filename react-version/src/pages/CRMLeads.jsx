import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CRMLeads = () => {
  const navigate = useNavigate();
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const leads = [
    { id: 1, name: "John Doe", added: "Today", program: "B.Sc Computer Science", email: "johndoe@email.com", phone: "+1 234 567 890", source: "Website", status: "New Inquiry", statusClass: "status-new", assigned: "Sarah Jenkins" },
    { id: 2, name: "Emma Watson", added: "2 days ago", program: "Business Administration", email: "emma.w@email.com", phone: "+1 987 654 321", source: "Social Media", status: "Contacted", statusClass: "status-contacted", assigned: "Mike Ross" },
    { id: 3, name: "David Smith", added: "1 week ago", program: "Engineering (Mechanical)", email: "d.smith99@email.com", phone: "+1 555 123 456", source: "Walk-in", status: "Interested", statusClass: "status-interested", assigned: "Sarah Jenkins" },
  ];

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
                  checked={selectedLeads.length === leads.length}
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
            {leads.map((lead) => (
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
                      whiteSpace: 'nowrap',  // ✅ Prevent line break
                      
                    }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td>{lead.assigned}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn-icon"
                      title="Call"
                      onClick={(e) => handleActionClick(e, () => { })}
                    >
                      <i className="fas fa-phone"></i>
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
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Send Bulk Email</h3>
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
                style={{
                  padding: '10px 24px', border: '1px solid var(--border)', borderRadius: '8px',
                  background: '#fff', color: 'var(--text-main)', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Emails sent!');
                  setIsEmailModalOpen(false);
                  setSelectedLeads([]);
                }}
                style={{
                  padding: '10px 24px', border: 'none', borderRadius: '8px',
                  background: 'var(--text-main)', color: '#fff', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '8px',
                }}
              >
                <i className="fas fa-paper-plane"></i> Send to All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMLeads;