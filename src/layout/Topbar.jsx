import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { showAlert, showToast } from "../services/notificationService";
import logo from "../assets/images/logo.png";

const TopBar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Get avatar URL based on user type
  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    
    const baseUrl = import.meta.env.VITE_LARAVEL_API || 'http://localhost:8000';
    
    // Clean the filename
    let cleanFilename = filename;
    if (filename.includes('avatars/')) {
      cleanFilename = filename.replace('avatars/', '');
    }
    if (filename.includes('avatar_')) {
      cleanFilename = filename.replace('avatar_', '');
    }
    
    return `${baseUrl}/avatar/${cleanFilename}`;
  };

  // Set avatar URL when user changes
  useEffect(() => {
    if (isStaff && user?.avatar) {
      const url = getAvatarUrl(user.avatar);
      setAvatarUrl(url);
      console.log('🔄 TopBar Avatar Debug:', {
        original: user?.avatar,
        cleaned: url,
        user: user?.full_name,
        userType: isAdmin ? 'admin' : 'staff'
      });
    } else {
      setAvatarUrl(null);
    }
    // Reset loading states when user changes
    setAvatarLoading(true);
    setAvatarError(false);
  }, [user, isAdmin, isStaff]);

  const handleLogout = async () => {
    const result = await showAlert.confirm(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      "Yes, Logout",
      "Cancel"
    );

    if (result.isConfirmed) {
      showAlert.loading("Logging out...", "Please wait while we securely log you out");

      setTimeout(async () => {
        try {
          await logout();
          showAlert.close();
          showToast.success("You have been logged out successfully");
        } catch (error) {
          showAlert.close();
          showAlert.error("Logout Error", "There was a problem logging out. Please try again.");
          console.error("Logout error:", error);
        }
      }, 1500);
    }
  };

  const handleImageLoad = () => {
    setAvatarLoading(false);
    setAvatarError(false);
  };

  const handleImageError = () => {
    console.log('❌ TopBar Avatar failed to load:', avatarUrl);
    setAvatarLoading(false);
    setAvatarError(true);
    setAvatarUrl(null); // Fallback to placeholder
  };

  // Render avatar based on user type and state
  const renderAvatar = () => {
    // Show loading skeleton
    if (avatarLoading && (isStaff && avatarUrl && !avatarError)) {
      return (
        <div
          className="rounded-circle skeleton"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }}
        ></div>
      );
    }

    // Admin: Always show placeholder
    if (isAdmin) {
      return (
        <div
          className="bg-light rounded-circle d-flex align-items-center justify-content-center"
          style={{ 
            width: "32px", 
            height: "32px",
          }}
        >
          <i
            className="fas fa-user-cog text-dark"
            style={{ fontSize: "14px" }}
          ></i>
        </div>
      );
    }

    // Staff: Show avatar from database if available, otherwise placeholder
    if (isStaff) {
      if (avatarUrl && !avatarError) {
        return (
          <img
            src={avatarUrl}
            alt={user?.full_name || 'Staff Avatar'}
            className="rounded-circle"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        );
      } else {
        return (
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: "32px", 
              height: "32px",
            }}
          >
            <i
              className="fas fa-user text-dark"
              style={{ fontSize: "14px" }}
            ></i>
          </div>
        );
      }
    }

    // Fallback for any other user type
    return (
      <div
        className="bg-light rounded-circle d-flex align-items-center justify-content-center"
        style={{ 
          width: "32px", 
          height: "32px",
        }}
      >
        <i
          className="fas fa-user text-dark"
          style={{ fontSize: "14px" }}
        ></i>
      </div>
    );
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark" id="topbar-nav">
      {/* Navbar Brand - Keep full text but hide subtitle on mobile */}
      <a className="navbar-brand ps-3 ps-sm-4 me-1 d-flex align-items-center" href="#!">
        <div className="d-flex align-items-center" style={{ gap: "12px" }}>
          {/* Logo */}
          <div className="d-flex align-items-center justify-content-center flex-shrink-0">
            <img
              src={logo}
              alt="Civil Records Logo"
              style={{
                width: "35px",
                height: "35px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* System Title - Full text on desktop, simplified on mobile */}
          <div className="d-flex flex-column justify-content-center">
            <span 
              className="fw-bold" 
              style={{ 
                fontSize: "1.1rem",
                color: "white",
                lineHeight: "1.2",
                whiteSpace: "nowrap"
              }}
            >
              Civil Records
            </span>
            <small 
              className="d-none d-md-block" // Hide on mobile, show on desktop
              style={{ 
                fontSize: "0.75rem", 
                opacity: "0.9",
                color: "white",
                lineHeight: "1.1",
                whiteSpace: "nowrap"
              }}
            >
              Automated Management & Certification System
            </small>
            <small 
              className="d-md-none" // Show only on mobile
              style={{ 
                fontSize: "0.7rem", 
                opacity: "0.9",
                color: "white",
                lineHeight: "1.1",
                whiteSpace: "nowrap"
              }}
            >
              Management System
            </small>
          </div>
        </div>
      </a>

      {/* Sidebar Toggle */}
      <button
        className="btn btn-link btn-sm order-1 order-lg-0 me-2 me-lg-5 flex-shrink-0"
        id="sidebarToggle"
        onClick={onToggleSidebar}
        style={{ color: "var(--background-white)" }}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Navbar Items - Right aligned */}
      <ul className="navbar-nav ms-auto me-2 me-lg-3">
        {/* User Dropdown */}
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle d-flex align-items-center"
            id="navbarDropdown"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ gap: "8px" }}
          >
            {/* Single avatar rendering - no duplicate */}
            <div className="position-relative flex-shrink-0">
              {renderAvatar()}
            </div>
            
            {/* User name - hidden on smallest screens */}
            <span className="d-none d-lg-inline">
              {user?.full_name || user?.username}
            </span>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li>
              <div className="dropdown-header">
                <strong>{user?.full_name || user?.username}</strong>
                <div className="small text-muted">
                  {isAdmin ? 'Administrator' : 'Staff'} • {user?.position || "User"}
                </div>
              </div>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button 
                className="dropdown-item custom-dropdown-item" 
                onClick={() => navigate("/profile")}
              >
                <i className="fas fa-user me-2"></i>Profile
              </button>
            </li>
            <li>
              <button 
                className="dropdown-item custom-dropdown-item" 
                onClick={() => navigate("/settings")}
              >
                <i className="fas fa-cog me-2"></i>Settings
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item custom-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </li>
          </ul>
        </li>
      </ul>

      {/* Inline styles to override gradient */}
      <style>{`
        #topbar-nav {
          background-color: #018181 !important;
          background-image: none !important;
          min-height: 56px;
        }
        
        #topbar-nav.navbar-dark {
          background-color: #018181 !important;
        }
        
        .sb-topnav.navbar-dark {
          background-color: #018181 !important;
          background-image: none !important;
        }
        
        .navbar-dark {
          background-color: #018181 !important;
        }

        /* Ensure proper spacing and alignment */
        .navbar-brand {
          margin-right: auto;
        }

        .navbar-nav {
          flex-shrink: 0;
        }

        /* Mobile responsiveness */
        @media (max-width: 576px) {
          .navbar-brand {
            padding-left: 1rem;
          }
          
          .navbar-nav .nav-link {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }

        /* Prevent text overflow */
        .text-nowrap {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
      `}</style>
    </nav>
  );
};

export default TopBar;