import React from 'react';

const CRMReports = () => {
  const staffPerformance = [
    { name: "Sarah Jenkins", leads: 350, admissions: 42, rate: "12%" },
    { name: "Mike Ross", leads: 280, admissions: 31, rate: "11%" },
    { name: "David Lee", leads: 150, admissions: 16, rate: "10.6%" },
  ];

  const sourceData = [
    { label: "Website", height: "80%" },
    { label: "Social", height: "60%" },
    { label: "Referral", height: "40%" },
    { label: "Walk-in", height: "25%" },
    { label: "Call", height: "15%" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Analyze CRM performance and admission trends.</p>
        </div>
        <button className="btn-outline"><i className="fas fa-download"></i> Export Data</button>
      </div>

      <div className="grid-2">
        {/* Chart 1: Lead Source */}
        <div className="panel">
          <div className="panel-header">
            <h3>Lead Source Analysis</h3>
          </div>
          <div className="panel-body">
            <div className="chart-container">
              {sourceData.map((data, idx) => (
                <div className="bar-col" key={idx}>
                  <div className="bar" style={{ height: data.height }}></div>
                  <div className="bar-label">{data.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Staff Performance */}
        <div className="panel">
          <div className="panel-header">
            <h3>Staff Conversion Performance</h3>
          </div>
          <div className="panel-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Leads Handled</th>
                  <th>Admissions</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, idx) => (
                  <tr key={idx}>
                    <td>{staff.name}</td>
                    <td>{staff.leads}</td>
                    <td>{staff.admissions}</td>
                    <td><strong>{staff.rate}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Wide Panel: Enrollment Trend */}
      <div className="panel">
        <div className="panel-header">
          <h3>Enrollment Trends (Current vs Previous Intake)</h3>
        </div>
        <div className="panel-body">
          <div className="chart-container" style={{ height: '200px', justifyContent: 'flex-start', gap: '40px', paddingLeft: '40px' }}>
            {/* Mock Trend Bars */}
            {[ { prev: "30%", curr: "40%" }, { prev: "50%", curr: "60%" }, { prev: "80%", curr: "95%" } ].map((item, idx) => (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }} key={idx}>
                <div className="bar secondary" style={{ height: item.prev }} title={`Previous: ${item.prev}`}></div>
                <div className="bar" style={{ height: item.curr }} title={`Current: ${item.curr}`}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#cbd5e1', borderRadius: '2px' }}></div> Previous Intake
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div> Current Intake
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMReports;
