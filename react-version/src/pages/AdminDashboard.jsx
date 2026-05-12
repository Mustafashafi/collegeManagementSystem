import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, applicationApi } from '../services/api';

const AdminDashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats().then(res => res.data),
  });

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['recentApplications'],
    queryFn: () => applicationApi.getAll().then(res => res.data),
  });

  const stats = statsLoading ? [] : [
    { label: "Total Students", value: statsData?.totalStudents || 0, icon: "fas fa-user-graduate", bgColor: "#eff6ff", iconColor: "#3b82f6" },
    { label: "Total Teachers", value: statsData?.totalTeachers || 0, icon: "fas fa-chalkboard-teacher", bgColor: "#ecfdf5", iconColor: "#10b981" },
    { label: "New Inquiries (This Month)", value: statsData?.newInquiries || 0, icon: "fas fa-user-plus", bgColor: "#f5f3ff", iconColor: "#8b5cf6" },
    { label: "Fees Collected", value: `$${(statsData?.feesCollected / 1000).toFixed(1)}k`, icon: "fas fa-file-invoice-dollar", bgColor: "#fff7ed", iconColor: "#f97316" },
  ];

  const recentAdmissions = appsLoading ? [] : (applicationsData?.slice(0, 5).map(app => ({
    name: `${app.firstName} ${app.lastName}`,
    program: app.program,
    date: new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: app.status,
    statusClass: app.statusClass || 'status-pending'
  })) || []);

  const activities = [
    { title: "System Ready", desc: "Backend connected and live", time: "Just now", icon: "fas fa-check-circle" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening across the institution today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.iconColor }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Admissions / Applications</h3>
            <button className="btn-sm">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Program</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAdmissions.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.program}</td>
                  <td>{item.date}</td>
                  <td><span className={`status-badge ${item.statusClass}`} style={{ textTransform: 'none' }}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent Activities</h3>
          </div>
          <div className="activity-list">
            {activities.map((activity, idx) => (
              <div className="activity-item" key={idx}>
                <div className="activity-icon"><i className={activity.icon}></i></div>
                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{activity.desc}</p>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
