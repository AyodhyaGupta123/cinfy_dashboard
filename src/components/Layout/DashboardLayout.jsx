import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { theme } from '../../theme/constants';

const EXPANDED_W = 256;
const COLLAPSED_W = 72;

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(2px)',
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      <Sidebar
        collapsed={isMobile ? false : sidebarCollapsed}
        onToggle={() => {
          if (isMobile) setMobileOpen(!mobileOpen);
          else setSidebarCollapsed(!sidebarCollapsed);
        }}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Right column: scrolls the entire page vertically */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? COLLAPSED_W : EXPANDED_W),
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100vh',
        overflowY: 'auto',   /* ← page scrolls here, vertically */
        overflowX: 'hidden', /* ← no page-level horizontal scroll */
        background: theme.pageBg,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <Topbar onMenuToggle={() => setMobileOpen(true)} isMobile={isMobile} />
        {/* main: no overflow set — grows with content, table's own overflow-x:auto handles table scroll */}
        <main style={{ flex: 1, padding: isMobile ? 12 : 16 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
