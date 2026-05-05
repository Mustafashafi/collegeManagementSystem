import React from 'react';
import { Link } from 'react-router-dom';

const CRMDashboard = () => {
  const stats = [
    { label: "Total Inquiries", value: "1,248", icon: "fas fa-users", trend: "12%", trendUp: true },
    { label: "Active Leads", value: "342", icon: "fas fa-user-clock", desc: "Currently in pipeline" },
    { label: "Applications", value: "156", icon: "fas fa-file-alt", desc: "In progress" },
    { label: "Admissions Completed", value: "89", icon: "fas fa-user-graduate", color: "#10b981", desc: "This intake season" },
  ];

  const activities = [
    { type: "New Inquiry", desc: "from Website: John Doe", time: "10 mins ago", icon: "fas fa-user-plus" },
    { type: "Application Submitted", desc: "by Emily Smith", time: "1 hour ago", icon: "fas fa-file-signature", bg: "#dcfce7", color: "#166534" },
    { type: "Follow-up call", desc: "completed with Mark Johnson", time: "3 hours ago", icon: "fas fa-phone-alt" },
    { type: "Admission Approved", desc: "for Sarah Williams", time: "Yesterday", icon: "fas fa-user-graduate", bg: "#dbeafe", color: "#1e40af" },
  ];

  const funnelData = [
    { label: "Inquiry", value: "1,248", height: "100%", opacity: 0.2 },
    { label: "Contacted", value: "750", height: "60%", opacity: 0.4 },
    { label: "Interested", value: "500", height: "40%", opacity: 0.6 },
    { label: "Applied", value: "156", height: "15%", opacity: 0.8 },
    { label: "Enrolled", value: "89", height: "8%", opacity: 1 },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>CRM Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Overview of admissions and lead pipeline.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>

          <Link to="/crm/leads/add" className="btn-primary"><i className="fas fa-plus"></i> Add Lead</Link>
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
              {stat.trend && <span style={{ color: stat.trendUp ? '#10b981' : '#ef4444' }}><i className={`fas fa-arrow-${stat.trendUp ? 'up' : 'down'}`}></i> {stat.trend}</span>}
              {stat.trend ? ` vs last month` : stat.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>Conversion Funnel</h3>
            <select style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}><option>This Month</option></select>
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
              {activities.map((activity, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-icon" style={{ backgroundColor: activity.bg, color: activity.color }}>
                    <i className={activity.icon}></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>{activity.type}</strong> {activity.desc}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
