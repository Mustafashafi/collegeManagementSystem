import React from 'react';

const StudentTimetable = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Weekly Academic Timetable</h1>
        <div style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}><i className="fas fa-print"></i> Print</div>
      </div>

      <div className="timetable-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '100px repeat(5, 1fr)', 
        gap: '1px', 
        background: '#e5e7eb', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px', 
        overflow: 'hidden' 
      }}>
        <div className="grid-header" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Time</div>
        <div className="grid-header" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Monday</div>
        <div className="grid-header" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Tuesday</div>
        <div className="grid-header" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Wednesday</div>
        <div className="grid-header" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Thursday</div>
        <div className="grid-header" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Friday</div>

        <div className="time-col" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>09:00 AM</div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="class-box" style={{ background: '#f1f5f9', borderLeft: '4px solid #1a1a1a', padding: '10px', borderRadius: '4px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Algorithms</h4>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>Room 102</p>
          </div>
        </div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}></div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="class-box" style={{ background: '#f1f5f9', borderLeft: '4px solid #1a1a1a', padding: '10px', borderRadius: '4px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Algorithms</h4>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>Room 102</p>
          </div>
        </div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}></div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="class-box" style={{ background: '#f1f5f9', borderLeft: '4px solid #1a1a1a', padding: '10px', borderRadius: '4px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>CS Lab</h4>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>Lab 4</p>
          </div>
        </div>

        <div className="time-col" style={{ background: '#f9fafb', padding: '15px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>11:00 AM</div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}></div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="class-box" style={{ background: '#f1f5f9', borderLeft: '4px solid #1a1a1a', padding: '10px', borderRadius: '4px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Discrete Math</h4>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>Room 204</p>
          </div>
        </div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}></div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="class-box" style={{ background: '#f1f5f9', borderLeft: '4px solid #1a1a1a', padding: '10px', borderRadius: '4px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Discrete Math</h4>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>Room 204</p>
          </div>
        </div>
        <div className="slot" style={{ background: '#fff', padding: '15px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}></div>
      </div>
    </div>
  );
};

export default StudentTimetable;
