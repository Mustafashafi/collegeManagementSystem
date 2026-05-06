import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CRMDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leads');
        const data = await response.json();
        setLeads(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Calculate dynamic stats
  const totalInquiries = leads.length;
  const activeLeads = leads.filter(l => l.status !== 'Lost').length;
  const applications = leads.filter(l => l.status === 'Application Submitted').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted' || l.status === 'Interested' || l.status === 'Application Submitted').length;
  const interestedLeads = leads.filter(l => l.status === 'Interested' || l.status === 'Application Submitted').length;

  const stats = [
    { label: "Total Inquiries", value: totalInquiries, icon: "fas fa-users", desc: "Total leads captured" },
    { label: "Active Leads", value: activeLeads, icon: "fas fa-user-clock", desc: "Currently in pipeline" },
    { label: "Applications", value: applications, icon: "fas fa-file-alt", desc: "Submitted applications" },
    { label: "Conversion Progress", value: contactedLeads, icon: "fas fa-chart-line", color: "#10b981", desc: "Leads contacted/processed" },
  ];

  // Dynamic Funnel Data
  const funnelData = [
    { label: "Total Inquiries", value: totalInquiries, height: totalInquiries > 0 ? "100%" : "0%", opacity: 0.2 },
    { label: "Contacted", value: contactedLeads, height: totalInquiries > 0 ? `${(contactedLeads / totalInquiries) * 100}%` : "0%", opacity: 0.4 },
    { label: "Interested", value: interestedLeads, height: totalInquiries > 0 ? `${(interestedLeads / totalInquiries) * 100}%` : "0%", opacity: 0.6 },
    { label: "Applied", value: applications, height: totalInquiries > 0 ? `${(applications / totalInquiries) * 100}%` : "0%", opacity: 1.0 },
  ];

  // Recent Activity from real leads
  const activities = leads.slice(0, 4).map(lead => ({
    type: lead.status === 'New Inquiry' ? 'New Inquiry' : 'Status Updated',
    desc: `${lead.firstName} ${lead.lastName} - ${lead.program}`,
    time: new Date(lead.added).toLocaleDateString(),
    icon: lead.status === 'New Inquiry' ? "fas fa-user-plus" : "fas fa-sync-alt",
    bg: lead.status === 'Application Submitted' ? "#dcfce7" : "#f1f5f9",
    color: lead.status === 'Application Submitted' ? "#166534" : "var(--primary)"
  }));

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)' }}></i>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>CRM Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Overview of admissions and lead pipeline.</p>
        </div>

      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</span>
              <i className={stat.icon} style={{ fontSize: '20px', color: stat.color || 'var(--primary)' }}></i>
            </div>
            <div className="stat-val" style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px', color: stat.color }}>{stat.value}</div>
            <div className="stat-desc" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>Conversion Funnel</h3>
          </div>
          <div className="panel-body" style={{ padding: '20px' }}>
            <div className="chart-container">
              {funnelData.map((item, idx) => (
                <div className="bar-col" key={idx}>
                  <div className="bar" style={{ height: item.height, opacity: item.opacity }}></div>
                  <div className="bar-label" dangerouslySetInnerHTML={{ __html: `${item.label}<br>(${item.value})` }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="panel-body" style={{ padding: '20px' }}>
            <div className="activity-list" style={{ padding: 0 }}>
              {activities.length > 0 ? activities.map((activity, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-icon" style={{ backgroundColor: activity.bg, color: activity.color }}>
                    <i className={activity.icon}></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>{activity.type}</strong> {activity.desc}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No recent activity found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
