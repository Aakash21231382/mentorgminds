import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";

import "../assets/css/admin-layout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Route change pe sidebar band kar do
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">

      {/* Mobile overlay — sidebar ke peeche dark background */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Area */}
      <div className="admin-main">

        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="admin-content">

          <Breadcrumb />

          {/* Current Route Page */}
          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
