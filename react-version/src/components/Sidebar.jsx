import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role, items }) => {
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
            {section.links.map((link, lIdx) => (
              <Link
                key={lIdx}
                to={link.path}
                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              >
                <i className={link.icon}></i> {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
