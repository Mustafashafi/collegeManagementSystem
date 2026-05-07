import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CRMDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, appsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/leads`),
          fetch(`${API_BASE_URL}/api/applications`)
        ]);
        
        const leadsData = await leadsRes.json();
        const appsData = await appsRes.json();
        
        setLeads(leadsData);
        setApplicationsList(appsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare Chart Data (Group by date)
  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    return last7Days.map(date => {
      const inquiryCount = leads.filter(l => new Date(l.added).toLocaleDateString() === date).length;
      const appCount = applicationsList.filter(a => new Date(a.appliedDate).toLocaleDateString() === date).length;
      return { name: date.split('/')[1] + '/' + date.split('/')[0], inquiries: inquiryCount, applications: appCount };
    });
  };

  const chartData = getChartData();

  // Calculate dynamic stats
  const totalInquiries = leads.length;
  const activeLeads = leads.filter(l => l.status !== 'Lost').length;
  const totalApps = applicationsList.length; 
  const contactedLeads = leads.filter(l => l.status === 'Contacted' || l.status === 'Interested' || l.status === 'Application Submitted').length;
  const interestedLeads = leads.filter(l => l.status === 'Interested' || l.status === 'Application Submitted').length;

  const stats = [
    { label: "Total Inquiries", value: totalInquiries, icon: "fas fa-users", desc: "Total leads captured" },
    { label: "Active Leads", value: activeLeads, icon: "fas fa-user-clock", desc: "Currently in pipeline" },
    { label: "Applications", value: totalApps, icon: "fas fa-file-alt", desc: "Total submitted & enrolled" },
    { label: "Conversion Progress", value: contactedLeads, icon: "fas fa-chart-line", color: "#10b981", desc: "Leads contacted/processed" },
  ];

  // Recent Activity merged
  const recentLeads = leads.slice(0, 3).map(lead => ({
    type: lead.status === 'New Inquiry' ? 'New Inquiry' : 'Status Updated',
    desc: `${lead.firstName} ${lead.lastName} - ${lead.program}`,
    time: new Date(lead.added).toLocaleDateString(),
    icon: lead.status === 'New Inquiry' ? "fas fa-user-plus" : "fas fa-sync-alt",
    bg: "#f1f5f9",
    color: "var(--primary)"
  }));

  const recentApps = applicationsList.slice(0, 2).map(app => ({
    type: app.status === 'Enrolled' ? 'Student Enrolled' : 'New Application',
    desc: `${app.firstName} ${app.lastName} - ${app.program}`,
    time: new Date(app.appliedDate).toLocaleDateString(),
    icon: app.status === 'Enrolled' ? "fas fa-user-check" : "fas fa-file-invoice",
    bg: app.status === 'Enrolled' ? "#dcfce7" : "#eff6ff",
    color: app.status === 'Enrolled' ? "#166534" : "#2563eb"
  }));

  const activities = [...recentApps, ...recentLeads].sort((a, b) => new Date(b.time) - new Date(a.time));

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
            <h3>Enrollment Trends</h3>
          </div>
          <div className="panel-body" style={{ padding: '20px', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="inquiries" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorInq)" />
                <Area type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
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
