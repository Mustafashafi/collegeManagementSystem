import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CRMApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApps, setSelectedApps] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/applications');
      const data = await response.json();

      const formattedApps = data.map(app => ({
        ...app,
        id: app._id,
        name: `${app.firstName} ${app.lastName}`,
        date: new Date(app.appliedDate).toLocaleDateString(),
        enrollable: app.status === 'Approved'
      }));
      setApplications(formattedApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getSelectedApplicants = () => {
    return applications.filter(a => selectedApps.includes(a.id));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this application from the database?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Application deleted from database.");
        setApplications(prev => prev.filter(app => app.id !== id));
      } else {
        toast.error(data.msg || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Admission Applications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Review and process submitted applications.</p>
        </div>

      </div>

      {selectedApps.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info"><span>{selectedApps.length}</span> candidates selected</div>
          <div className="bulk-btns">
            <button className="btn-bulk" onClick={() => setSelectedApps([])}>Clear Selection</button>
            <button className="btn-bulk-primary btn-bulk" onClick={() => setIsEmailModalOpen(true)}>
              <i className="fas fa-envelope"></i> Send Bulk Email
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <div className="search-input"><i className="fas fa-search"></i><input type="text" placeholder="Search by name, ID..." /></div>
          <select className="filter-select">
            <option>All Statuses</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Approved</option>
          </select>
          <select className="filter-select">
            <option>All Programs</option>
            <option>B.Sc CS</option>
            <option>BBA</option>
          </select>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input type="checkbox" onChange={(e) => e.target.checked ? setSelectedApps(applications.map(a => a.id)) : setSelectedApps([])} checked={selectedApps.length === applications.length && applications.length > 0} />
              </th>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Program</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No applications found.
                </td>
              </tr>
            ) : applications.map((app) => (
              <tr key={app.id}>
                <td className="checkbox-col">
                  <input type="checkbox" checked={selectedApps.includes(app.id)} onChange={() => toggleSelection(app.id)} />
                </td>
                <td><strong>{app.appId}</strong></td>
                <td>{app.name}</td>
                <td>{app.program}</td>
                <td>{app.date}</td>
                <td><span style={{ display: 'inline-block', textAlign: 'center', whiteSpace: 'nowrap' }} className={`status-badge ${app.statusClass}`}>{app.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {app.enrollable ? (
                      <button className="btn-sm" style={{ background: '#1a1a1a', color: '#fff', borderColor: '#1a1a1a' }}>Enroll Student</button>
                    ) : (
                      <button className="btn-sm" onClick={() => navigate('/crm/applications/review', { state: { application: app } })}>Review</button>
                    )}
                    <button
                      onClick={() => handleDelete(app.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', fontSize: '16px' }}
                      title="Delete Application"
                    >
                      <i className="fas fa-trash-alt"></i>
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
                To ({selectedApps.length} {selectedApps.length === 1 ? 'Recipient' : 'Recipients'})
              </label>
              <div
                style={{
                  display: 'flex', flexWrap: 'wrap', gap: '8px',
                  padding: '10px 12px', border: '1px solid var(--border)',
                  borderRadius: '8px', minHeight: '44px', background: '#fafafa',
                }}
              >
                {getSelectedApplicants().map((app) => (
                  <span
                    key={app.id}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#fff', border: '1px solid var(--border)',
                      borderRadius: '20px', padding: '3px 10px',
                      fontSize: '13px', fontWeight: 500, color: 'var(--text-main)',
                    }}
                  >
                    {app.name}
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
                  toast.success('Emails sent successfully!');
                  setIsEmailModalOpen(false);
                  setSelectedApps([]);
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

export default CRMApplications;