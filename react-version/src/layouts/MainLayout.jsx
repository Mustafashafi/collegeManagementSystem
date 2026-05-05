import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = ({ sidebarProps, user }) => {
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
