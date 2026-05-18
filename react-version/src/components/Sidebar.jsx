import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role, items, notifications = [] }) => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className={role.icon}></i>
        <h2>{role.title}</h2>
      </div>
      <div className="nav-menu">
        {items.map((section, idx) => (
          <div className="nav-section" key={idx}>
            {section.title && <div className="nav-section-title">{section.title}</div>}
            {section.links.map((link, lIdx) => {
              // Calculate unread notifications for this specific link path
              // To handle nested paths, we can check if n.link starts with link.path
              // But to avoid /student/assignments matching /student/assign, we use startsWith(link.path) with a trailing slash check, or exact match.
              const linkUnreadCount = (notifications || []).filter(n => {
                if (n.isRead || !n.link) return false;
                if (n.link === link.path) return true;
                // If it's a sub-path like /student/assignments/123
                if (n.link.startsWith(link.path + '/')) return true;
                return false;
              }).length;

              return (
                <Link
                  key={lIdx}
                  to={link.path}
                  className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <i className={link.icon}></i> {link.label}
                  </div>
                  {linkUnreadCount > 0 && (
                    <span style={{
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {linkUnreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
