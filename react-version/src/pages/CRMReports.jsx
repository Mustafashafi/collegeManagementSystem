import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '../services/api';
import toast from 'react-hot-toast';

const CRMReports = () => {
  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ['crmReports'],
    queryFn: () => leadsApi.getReports().then(res => res.data),
    onError: () => toast.error('Failed to load real-time CRM reports')
  });

  const staffPerformance = reports?.staffPerformance || [];
  const sourceData = reports?.sourceData || [];
  const trendData = reports?.trendData || [];

  const handleExportCSV = () => {
    if (!staffPerformance.length) {
      toast.error('No staff performance data available to export');
      return;
    }
    const headers = ['Staff Name', 'Leads Handled', 'Admissions (Submitted)', 'Conversion Rate'];
    const rows = staffPerformance.map(s => [s.name, s.leads, s.admissions, s.rate]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crm_performance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CRM Performance data exported successfully');
  };

  if (isLoading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>Loading real-time CRM analytics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', marginBottom: '16px' }}></i>
          <p style={{ fontSize: '16px', fontWeight: 600 }}>Failed to load reports. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Analyze CRM performance and admission trends.</p>
        </div>
        <button className="btn-outline" onClick={handleExportCSV} style={{ cursor: 'pointer', borderRadius: '10px', padding: '10px 20px', fontWeight: 600 }}>
          <i className="fas fa-download"></i> Export Data
        </button>
      </div>

      <div className="grid-2">
        {/* Chart 1: Lead Source */}
        <div className="panel" style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Lead Source Analysis</h3>
          </div>
          <div className="panel-body" style={{ padding: '24px' }}>
            <div 
              className="chart-container" 
              style={{ 
                height: '260px', 
                background: '#f8fafc', 
                backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px)', 
                backgroundSize: '100% 40px',
                borderRadius: '12px', 
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'flex-end', 
                justifyContent: 'space-around', 
                padding: '24px 20px 10px 20px', 
                gap: '15px',
                position: 'relative'
              }}
            >
              {sourceData.map((data, idx) => (
                <div className="bar-col" key={idx} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '60px' }}>
                  <div 
                    className="bar-wrapper"
                    style={{ 
                      height: '80%', // Limit height space for labels
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'flex-end', 
                      justifyContent: 'center' 
                    }}
                  >
                    <div 
                      className="bar-graphic" 
                      style={{ 
                        height: data.height, 
                        width: '32px', 
                        background: 'linear-gradient(180deg, var(--primary) 0%, #4b5563 100%)', 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                      title={`${data.label}: ${data.count} leads`}
                    ></div>
                  </div>
                  <div className="bar-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {data.label}
                    <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '12px', marginTop: '2px' }}>({data.count})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Staff Performance */}
        <div className="panel" style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Staff Conversion Performance</h3>
          </div>
          <div className="panel-body" style={{ padding: '24px' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Staff Name</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Leads Handled</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Admissions</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No performance stats found</td>
                  </tr>
                ) : (
                  staffPerformance.map((staff, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600 }}>{staff.name}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'center' }}>{staff.leads}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'center' }}>{staff.admissions}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', textAlign: 'center' }}>
                        <span style={{ background: parseFloat(staff.rate) > 0 ? '#ecfdf5' : '#f3f4f6', color: parseFloat(staff.rate) > 0 ? '#047857' : '#4b5563', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          {staff.rate}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Wide Panel: Enrollment Trend */}
      <div className="panel" style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', marginTop: '24px' }}>
        <div className="panel-header" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Enrollment Trends (Current vs Previous Intake)</h3>
        </div>
        <div className="panel-body" style={{ padding: '24px' }}>
          <div 
            className="chart-container" 
            style={{ 
              height: '220px', 
              background: '#f8fafc', 
              backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px)', 
              backgroundSize: '100% 40px',
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'flex-start', 
              gap: '60px', 
              padding: '24px 40px 15px 40px' 
            }}
          >
            {trendData.map((item, idx) => (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '100%' }} key={idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80%' }}>
                    <div 
                      className="bar-graphic secondary" 
                      style={{ 
                        height: item.prev, 
                        width: '32px', 
                        background: 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%)', 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                      }} 
                      title={`Previous: ${item.prev}`}
                    ></div>
                    <div 
                      className="bar-graphic" 
                      style={{ 
                        height: item.curr, 
                        width: '32px', 
                        background: 'linear-gradient(180deg, var(--primary) 0%, #4b5563 100%)', 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                      title={`Current: ${item.curr}`}
                    ></div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '8px' }}>
                    Period {idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', background: 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%)', borderRadius: '4px' }}></div> Previous Intake
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', background: 'linear-gradient(180deg, var(--primary) 0%, #4b5563 100%)', borderRadius: '4px' }}></div> Current Intake
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMReports;
