import React from 'react';

const ParentCommunication = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>School Communications</h1>
      </div>

      <div className="messaging-container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', height: 'calc(100vh - 120px)', minHeight: '600px', overflow: 'hidden' }}>
        
        {/* Contacts Sidebar */}
        <div className="contacts-list" style={{ borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <div className="contacts-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', fontWeight: 700, fontSize: '13px', color: '#111827' }}>
            Contacts
          </div>
          
          <div className="contact-item active" style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', borderLeft: '3px solid #111827' }}>
            <div className="c-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <i className="fas fa-user" style={{ fontSize: '14px' }}></i>
            </div>
            <div className="c-info">
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Prof. Robert Smith</h4>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>Academic Mentor</p>
            </div>
          </div>
          
          <div className="contact-item" style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '3px solid transparent' }}>
            <div className="c-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              <i className="fas fa-building" style={{ fontSize: '14px' }}></i>
            </div>
            <div className="c-info">
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>Admin Office</h4>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>General Inquiries</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
          
          <div className="chat-header" style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="c-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <i className="fas fa-user" style={{ fontSize: '14px' }}></i>
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Prof. Robert Smith</h4>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>Academic Mentor</p>
            </div>
          </div>
          
          <div className="chat-messages" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="message received" style={{ maxWidth: '65%', alignSelf: 'flex-start' }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', borderBottomLeftRadius: '2px', fontSize: '12px', lineHeight: 1.6, background: '#fff', border: '1px solid #e5e7eb', color: '#374151' }}>
                Dear Mr. Chen, I wanted to discuss Michael's recent performance in the mid-term exams. He did quite well but could use some extra focus on the practical labs.
              </div>
              <span className="msg-time" style={{ fontSize: '9px', color: '#9ca3af', marginTop: '6px', display: 'block', marginLeft: '4px' }}>Yesterday, 2:30 PM</span>
            </div>
            
            <div className="message sent" style={{ maxWidth: '65%', alignSelf: 'flex-end' }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', borderBottomRightRadius: '2px', fontSize: '12px', lineHeight: 1.6, background: '#111827', color: '#f9fafb' }}>
                Thank you for the update, Professor. I will make sure he spends more time on his lab assignments. Are there any specific resources he should look into?
              </div>
              <span className="msg-time" style={{ fontSize: '9px', color: '#9ca3af', marginTop: '6px', display: 'block', textAlign: 'right', marginRight: '4px' }}>Yesterday, 4:15 PM</span>
            </div>

          </div>
          
          <div className="chat-input" style={{ padding: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="text" placeholder="Type your message..." style={{ flex: 1, padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', outline: 'none', color: '#111827' }} />
            <button className="btn-send" style={{ width: '46px', height: '46px', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-paper-plane" style={{ fontSize: '14px' }}></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParentCommunication;
