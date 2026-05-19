import React, { useState } from 'react';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [activeReport, setActiveReport] = useState(null); // 'admission' | 'fees' | 'attendance' | 'teacher-attendance' | 'academic'
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reports = [
    { 
      type: "admission",
      title: "Admission Conversion Report", 
      desc: "Track inquiry-to-enrollment ratios and lead sources.", 
      icon: "fas fa-chart-pie",
      color: "#3b82f6",
      bgLight: "#eff6ff"
    },
    { 
      type: "fees",
      title: "Fee Defaulters Report", 
      desc: "List of all students with outstanding fee dues.", 
      icon: "fas fa-file-invoice-dollar",
      color: "#ef4444",
      bgLight: "#fef2f2"
    },
    { 
      type: "attendance",
      title: "Attendance Defaulters", 
      desc: "Students with attendance below 75% threshold.", 
      icon: "fas fa-user-check",
      color: "#f59e0b",
      bgLight: "#fffbeb"
    },
    { 
      type: "teacher-attendance",
      title: "Teacher Attendance Report", 
      desc: "Detailed tracking of staff check-in/out and leaves.", 
      icon: "fas fa-user-clock",
      color: "#10b981",
      bgLight: "#ecfdf5"
    },
    { 
      type: "academic",
      title: "Academic Performance", 
      desc: "Class-wise results and average grading analysis.", 
      icon: "fas fa-poll",
      color: "#8b5cf6",
      bgLight: "#f5f3ff"
    },
  ];

  const handleReportClick = async (type) => {
    setActiveReport(type);
    setIsLoading(true);
    setReportData(null);
    try {
      const res = await adminApi.getReports(type);
      if (res.data?.success) {
        setReportData(res.data);
      } else {
        toast.error('Failed to load report data');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      toast.error('Error loading report');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reportData) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `${activeReport}_report_${Date.now()}.csv`;

    if (activeReport === 'admission') {
      csvContent += "Metric,Value\n";
      csvContent += `Total Leads,${reportData.conversionStats.totalLeads}\n`;
      csvContent += `Admitted,${reportData.conversionStats.admitted}\n`;
      csvContent += `In Progress,${reportData.conversionStats.inProgress}\n`;
      csvContent += `Lost/Inactive,${reportData.conversionStats.lost}\n\n`;
      
      csvContent += "Lead Source,Count\n";
      Object.entries(reportData.sources).forEach(([src, val]) => {
        csvContent += `"${src}",${val}\n`;
      });
    } else if (activeReport === 'fees') {
      csvContent += "Invoice ID,Student Name,Student Email,Fee Type,Total Amount,Paid,Outstanding\n";
      reportData.defaulters.forEach(d => {
        const outstanding = d.amount - (d.amountPaid || 0);
        csvContent += `"${d.invoiceId}","${d.studentName}","${d.studentEmail}","${d.feeType}",${d.amount},${d.amountPaid || 0},${outstanding}\n`;
      });
    } else if (activeReport === 'attendance') {
      csvContent += "Student Name,Email,Program,Year,Total Classes,Present,Attendance Rate (%)\n";
      reportData.defaulters.forEach(d => {
        csvContent += `"${d.name}","${d.email}","${d.program}","${d.year}",${d.totalClasses},${d.presentClasses},${d.attendanceRate}\n`;
      });
    } else if (activeReport === 'teacher-attendance') {
      csvContent += "Teacher ID,Name,Email,Present days,Absent days,Late days,Attendance Rate (%)\n";
      reportData.report.forEach(t => {
        csvContent += `"${t.teacherId}","${t.name}","${t.email}",${t.present},${t.absent},${t.late},${t.percentage}\n`;
      });
    } else if (activeReport === 'academic') {
      csvContent += "Program/Class,Total Exams Taken,Average Marks Score (%)\n";
      reportData.report.forEach(p => {
        csvContent += `"${p.program}",${p.totalExams},${p.averageScore}\n`;
        p.subjects.forEach(s => {
          csvContent += ` - Subject: "${s.subjectName}",,Average Score: ${s.averageScore}\n`;
        });
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded successfully!');
  };

  const activeInfo = reports.find(r => r.type === activeReport);

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Compile and view dynamic real-time reports across all institutional divisions.</p>
        </div>
      </div>

      <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {reports.map((report) => (
          <div 
            className="report-card animate-hover" 
            key={report.type} 
            onClick={() => handleReportClick(report.type)}
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <div 
              className="report-icon" 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '12px', 
                background: report.bgLight, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: report.color,
                fontSize: '22px'
              }}
            >
              <i className={report.icon}></i>
            </div>
            <div className="report-info" style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{report.title}</h3>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{report.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {activeReport && (
        <div 
          className="modal-overlay" 
          onClick={() => setActiveReport(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="report-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
          >
            <div 
              className="modal-header" 
              style={{ 
                padding: '20px 28px', 
                borderBottom: '1px solid var(--border)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: activeInfo?.bgLight 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', color: activeInfo?.color }}><i className={activeInfo?.icon}></i></span>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{activeInfo?.title}</h2>
              </div>
              <button 
                onClick={() => setActiveReport(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)',
                  padding: 0,
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body" style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '16px' }}>
                  <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '36px', color: 'var(--primary)' }}></i>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Compiling database records...</span>
                </div>
              ) : reportData ? (
                <div>
                  {activeReport === 'admission' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Leads</span>
                          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px', display: 'block' }}>{reportData.conversionStats.totalLeads}</span>
                        </div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#10b981', textTransform: 'uppercase', fontWeight: 600 }}>Admitted</span>
                          <span style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '6px', display: 'block' }}>{reportData.conversionStats.admitted}</span>
                        </div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
                          <span style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6', marginTop: '6px', display: 'block' }}>{reportData.conversionStats.inProgress}</span>
                        </div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#ef4444', textTransform: 'uppercase', fontWeight: 600 }}>Lost / Rejected</span>
                          <span style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '6px', display: 'block' }}>{reportData.conversionStats.lost}</span>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Lead Generation Sources</h4>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Source</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Leads count</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>% Share</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(reportData.sources).map(([src, val]) => (
                              <tr key={src} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>{src}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>{val}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>
                                  {reportData.conversionStats.totalLeads > 0 ? ((val / reportData.conversionStats.totalLeads) * 100).toFixed(1) + '%' : '0%'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeReport === 'fees' && (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Outstanding Fee Balances ({reportData.defaulters.length} Invoices)</h4>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px', maxHeight: '350px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 1 }}>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Student Name & Email</th>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Fee Type</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Paid</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Outstanding</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.defaulters.map((d, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                  <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>{d.studentName}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.studentEmail}</span>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-main)' }}>{d.feeType}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: 'var(--text-main)' }}>${d.amount}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#10b981', fontWeight: 500 }}>${d.amountPaid || 0}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>${d.amount - (d.amountPaid || 0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeReport === 'attendance' && (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Defaulters List (Attendance &lt; 75%)</h4>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px', maxHeight: '350px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 1 }}>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Student Details</th>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Program</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Classes</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Present</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.defaulters.map((d, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                  <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>{d.name}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.email}</span>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-main)' }}>{d.program} ({d.year})</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>{d.totalClasses}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>{d.presentClasses}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px' }}>
                                  <span style={{ 
                                    fontWeight: 600, fontSize: '11px', 
                                    color: '#ef4444', background: '#fee2e2',
                                    padding: '4px 10px', borderRadius: '20px'
                                  }}>{d.attendanceRate}%</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeReport === 'teacher-attendance' && (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Staff Attendance Compilation</h4>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px', maxHeight: '350px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 1 }}>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Teacher Info</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Present</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Absent</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Late</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.report.map((t, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                  <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>{t.name}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.email} - ID: {t.teacherId}</span>
                                </td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#10b981', fontWeight: 500 }}>{t.present}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#ef4444' }}>{t.absent}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', color: '#f59e0b' }}>{t.late}</td>
                                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: parseFloat(t.percentage) >= 85 ? '#10b981' : '#f59e0b' }}>{t.percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeReport === 'academic' && (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Class-Wise Examination Score Averages</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {reportData.report.map((p, i) => (
                          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{p.program}</h5>
                              <span style={{ 
                                fontWeight: 700, fontSize: '13px', 
                                color: '#fff', background: 'var(--primary)',
                                padding: '4px 12px', borderRadius: '20px'
                              }}>{p.averageScore}% Avg</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                              {p.subjects.map((s, idx) => (
                                <div key={idx} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-main)' }}>{s.subjectName}</span>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{s.averageScore}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No data compiled.</div>
              )}
            </div>

            <div 
              className="modal-footer" 
              style={{ 
                padding: '16px 28px', 
                borderTop: '1px solid var(--border)', 
                display: 'flex', 
                justifyContent: 'flex-end',
                background: '#f8fafc',
                gap: '12px'
              }}
            >
              <button 
                onClick={() => setActiveReport(null)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                Close
              </button>
              {reportData && (
                <button 
                  onClick={downloadCSV}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-download"></i> Download CSV
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
