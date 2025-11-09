// Sidebar.jsx - Updated with grouped staff menu items
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";

const Sidebar = ({ onCloseSidebar }) => {
  const { user, isAdmin, isStaff } = useAuth();
  const location = useLocation();

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768 && onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const handleLinkClick = () => {
    closeSidebarOnMobile();
  };

  // Civil Registry System Menu Items
  const adminMenuItems = [
    {
      heading: "Dashboard",
      items: [
        {
          icon: "fas fa-tachometer-alt",
          label: "Dashboard",
          href: "/dashboard",
        },
      ],
    },
    {
      heading: "Records Management",
      items: [
        {
          icon: "fas fa-birthday-cake",
          label: "Birth Records",
          href: "/birth-records",
        },
        {
          icon: "fas fa-heart",
          label: "Marriage Records",
          href: "/marriage-records",
        },
        {
          icon: "fas fa-cross",
          label: "Death Records",
          href: "/death-records",
        },
        {
          icon: "fas fa-search",
          label: "Search Records",
          href: "/search-records",
        },
      ],
    },
    {
      heading: "Certificate Management",
      items: [
        {
          icon: "fas fa-certificate",
          label: "Generate Certificates",
          href: "/generate-certificates",
        },
        {
          icon: "fas fa-history",
          label: "Issuance History",
          href: "/issuance-history",
        },
      ],
    },
    {
      heading: "System Administration",
      items: [
        {
          icon: "fas fa-users-cog",
          label: "User Management",
          href: "/user-management",
        },
        {
          icon: "fas fa-chart-bar",
          label: "Reports & Analytics",
          href: "/reports",
        },
        {
          icon: "fas fa-database",
          label: "Data Backup",
          href: "/backup",
        },
      ],
    },
  ];

  const staffMenuItems = [
    {
      heading: "Dashboard",
      items: [
        {
          icon: "fas fa-tachometer-alt",
          label: "Dashboard",
          href: "/dashboard",
        },
      ],
    },
    {
      heading: "Records Management",
      items: [
        {
          icon: "fas fa-birthday-cake",
          label: "Birth Records",
          href: "/birth-records",
        },
        {
          icon: "fas fa-heart",
          label: "Marriage Records",
          href: "/marriage-records",
        },
        {
          icon: "fas fa-cross",
          label: "Death Records",
          href: "/death-records",
        },
        {
          icon: "fas fa-search",
          label: "Search Records",
          href: "/search-records",
        },
      ],
    },
    {
      heading: "Certificate Management",
      items: [
        {
          icon: "fas fa-certificate",
          label: "Generate Certificates",
          href: "/generate-certificates",
        },
        {
          icon: "fas fa-history",
          label: "Issuance History",
          href: "/issuance-history",
        },
      ],
    },
  ];

  let menuItems = [];

  if (isAdmin) {
    menuItems = adminMenuItems;
  } else if (isStaff) {
    menuItems = staffMenuItems;
  }

  const renderMenuSection = (section, index) => (
    <React.Fragment key={index}>
      <div className="sb-sidenav-menu-heading">{section.heading}</div>
      {section.items.map((item, itemIndex) => {
        const isActive = isActiveLink(item.href);
        return (
          <Link
            key={itemIndex}
            className={`nav-link ${isActive ? "active" : ""}`}
            to={item.href}
            onClick={handleLinkClick}
          >
            <div className="sb-nav-link-icon">
              <i className={item.icon}></i>
            </div>
            {item.label}
            {isActive && (
              <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                <i className="fas fa-chevron-right small"></i>
              </span>
            )}
          </Link>
        );
      })}
    </React.Fragment>
  );

  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          {menuItems.map(renderMenuSection)}

          {/* Common Settings for All Roles */}
          <div className="sb-sidenav-menu-heading">Settings</div>

          <Link
            className={`nav-link ${isActiveLink("/profile") ? "active" : ""}`}
            to="/profile"
            onClick={handleLinkClick}
          >
            <div className="sb-nav-link-icon">
              <i className="fas fa-user"></i>
            </div>
            Profile
            {isActiveLink("/profile") && (
              <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                <i className="fas fa-chevron-right small"></i>
              </span>
            )}
          </Link>

          {/* Show Settings only for Admin */}
          {isAdmin && (
            <Link
              className={`nav-link ${isActiveLink("/settings") ? "active" : ""}`}
              to="/settings"
              onClick={handleLinkClick}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-cog"></i>
              </div>
              Settings
              {isActiveLink("/settings") && (
                <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                  <i className="fas fa-chevron-right small"></i>
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      <div className="sb-sidenav-footer">
        <div className="small">Logged in as:</div>
        <span className="user-name">{user?.full_name || "User"}</span>
        <div className="small text-muted">
          {isAdmin ? "System Administrator" : "Registry Staff"}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;