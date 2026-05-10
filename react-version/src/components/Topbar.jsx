import React from 'react';

const Topbar = ({ user }) => {
  const isStudentPortal = window.location.pathname.includes('/student') || user?.role === 'student';

  return (
    <header className="topbar">
      {!isStudentPortal ? (
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search students, staff, or leads..." />
        </div>
      ) : (
        <div></div>
      )}
      <div className="topbar-right">
        <button className="icon-btn">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">{user.initials}</div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
