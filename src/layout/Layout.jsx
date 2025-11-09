
import React, { useState, useEffect } from 'react';
import TopBar from './Topbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggled(!sidebarToggled);
  };

  const closeSidebar = () => {
    setSidebarToggled(false);
  };

  const handleOverlayClick = () => {
    closeSidebar();
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && sidebarToggled) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [sidebarToggled]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarToggled) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarToggled]);

  useEffect(() => {
    const body = document.body;
    
    if (sidebarToggled) {
      body.classList.add('sb-sidenav-toggled');
    } else {
      body.classList.remove('sb-sidenav-toggled');
    }

    return () => {
      body.classList.remove('sb-sidenav-toggled');
    };
  }, [sidebarToggled]);

  return (
    <div className="sb-nav-fixed">
      <TopBar onToggleSidebar={toggleSidebar} />
      
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar onCloseSidebar={closeSidebar} /> 
        </div>
        
        <div id="layoutSidenav_content">
          {sidebarToggled && window.innerWidth < 768 && (
            <div 
              className="mobile-sidebar-overlay"
              onClick={handleOverlayClick}
            />
          )}
          
          <main>
            <div className="container-fluid px-4">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;