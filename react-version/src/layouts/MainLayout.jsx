import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = ({ sidebarProps, user: initialUser }) => {
  // Always get fresh user from localStorage on render
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="main-layout">
      <Sidebar {...sidebarProps} />
      <main className="main-content">
        <Topbar user={user} />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
