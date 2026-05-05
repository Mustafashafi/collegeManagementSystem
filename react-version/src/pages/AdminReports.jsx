import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminReports = () => {
  const navigate = useNavigate();
  
  const reports = [
    { title: "Admission Conversion Report", desc: "Track inquiry-to-enrollment ratios and lead sources.", icon: "fas fa-chart-pie" },
    { title: "Fee Defaulters Report", desc: "List of all students with outstanding fee dues.", icon: "fas fa-file-invoice-dollar" },
    { title: "Attendance Defaulters", desc: "Students with attendance below 75% threshold.", icon: "fas fa-user-check" },
    { title: "Teacher Attendance Report", desc: "Detailed tracking of staff check-in/out and leaves.", icon: "fas fa-user-clock", path: "/admin/teacher-attendance" },
    { title: "Academic Performance", desc: "Class-wise results and average grading analysis.", icon: "fas fa-poll" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Generate downloadable reports for all institution activities.</p>
        </div>
      </div>

      <div className="report-grid">
        {reports.map((report, idx) => (
          <div 
            className="report-card" 
            key={idx} 
            onClick={() => report.path && navigate(report.path)}
          >
            <div className="report-icon"><i className={report.icon}></i></div>
            <div className="report-info">
              <h3>{report.title}</h3>
              <p>{report.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
