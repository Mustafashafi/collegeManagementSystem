import React from 'react';
import { useNavigate } from 'react-router-dom';

const CRMMarketing = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Campaigns", val: "3" },
    { label: "Total Leads Generated", val: "845" },
    { label: "Total Spend (YTD)", val: "$12,400" },
    { label: "Avg. Cost Per Lead", val: "$14.67" },
  ];

  const campaigns = [
    { name: "Fall Intake 2026 Promo", source: "Facebook Ads", duration: "Sep 1 - Oct 31", spend: "$2,500", leads: 320, conversions: "45 (14%)", status: "Active", statusClass: "status-active" },
    { name: "Engineering Scholarship Ad", source: "Google Search", duration: "Oct 1 - Nov 15", spend: "$1,200", leads: 150, conversions: "12 (8%)", status: "Active", statusClass: "status-active" },
    { name: "Open House Event Registration", source: "Email Marketing", duration: "Aug 15 - Aug 30", spend: "$300", leads: 180, conversions: "30 (16%)", status: "Ended", statusClass: "status-ended" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Marketing & Campaigns</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Track performance of admission campaigns.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/crm/marketing/add-campaign')}>
          <i className="fas fa-plus"></i> Create Campaign
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-val">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Campaign Performance</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Source / Platform</th>
              <th>Duration</th>
              <th>Budget Spent</th>
              <th>Leads</th>
              <th>Conversions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, idx) => (
              <tr key={idx}>
                <td><strong>{c.name}</strong></td>
                <td>{c.source}</td>
                <td>{c.duration}</td>
                <td>{c.spend}</td>
                <td>{c.leads}</td>
                <td>{c.conversions}</td>
                <td><span className={`status-badge ${c.statusClass}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRMMarketing;
