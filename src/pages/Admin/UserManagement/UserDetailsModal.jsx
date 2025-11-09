// components/admin/UserDetailsModal.jsx
import React from "react";
import Portal from "../../../components/Portal";

// Updated Avatar component with EXACT SAME logic as UserManagement
const UserAvatar = ({ user, size = 80 }) => {
  // EXACT SAME getAvatarUrl function as UserManagement
  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    
    const baseUrl = import.meta.env.VITE_LARAVEL_API || 'http://localhost:8000';
    
    // Clean the filename - EXACT SAME logic
    let cleanFilename = filename;
    if (filename.includes('avatars/')) {
      cleanFilename = filename.replace('avatars/', '');
    }
    if (filename.includes('avatar_')) {
      cleanFilename = filename.replace('avatar_', '');
    }
    
    // CORRECT URL: http://localhost:8000/avatar/1762566900_690ea2f4d8d0b.jpg
    return `${baseUrl}/avatar/${cleanFilename}`;
  };

  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  console.log('🔍 UserDetailsModal Avatar Debug:', {
    original: user?.avatar,
    cleaned: avatarUrl,
    user: user?.name
  });

  if (avatarUrl) {
    return (
      <div
        className="rounded-circle overflow-hidden border position-relative"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          backgroundColor: '#f8f9fa',
          flexShrink: 0,
          borderRadius: '50%' // Ensure it's always circle
        }}
      >
        <img
          src={avatarUrl}
          alt={`${user?.name || "Staff"} avatar`}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            borderRadius: '50%' // Ensure image is also circle
          }}
          onLoad={() => console.log('✅ Avatar loaded in modal for:', user?.name)}
          onError={(e) => {
            console.log('❌ Avatar failed in modal for:', user?.name, 'URL:', avatarUrl);
            // Show fallback immediately
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Fallback - initials avatar (CIRCLE)
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center text-white border"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#336b31',
        fontSize: `${size * 0.35}px`,
        fontWeight: 'bold',
        flexShrink: 0,
        borderRadius: '50%' // Ensure fallback is also circle
      }}
    >
      {getInitials(user?.name)}
    </div>
  );
};

const UserDetailsModal = ({ user, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    document.body.classList.add("modal-open");
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.classList.remove("modal-open");
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getActivityInfo = (user) => {
    if (user.is_active) {
      return { label: "Active", color: "success", icon: "fa-check-circle" };
    } else {
      return { label: "Inactive", color: "danger", icon: "fa-times-circle" };
    }
  };

  const activityInfo = getActivityInfo(user);

  return (
    <Portal>
      <div 
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg mx-3 mx-sm-auto">
          <div 
            className="modal-content border-0"
            style={{ 
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header - Updated with solid color */}
            <div 
              id="user-details-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-user me-2"></i>
                Staff Details
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            
            <div className="modal-body bg-light" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* User Summary Card */}
              <div className="card border-0 bg-white mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <UserAvatar user={user} size={80} />
                    </div>
                    <div className="col">
                      <h4 className="mb-1 text-dark">{user.name}</h4>
                      <p className="text-muted mb-2">{user.email}</p>
                      <div className="d-flex flex-wrap gap-2">
                        <span className={`badge bg-${activityInfo.color} fs-6`}>
                          <i className={`fas ${activityInfo.icon} me-1`}></i>
                          {activityInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                {/* Basic Information */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        Basic Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                        <p className="mb-0 fw-semibold text-dark">{user.name}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted mb-1">Email Address</label>
                        <p className="mb-0 fw-semibold text-dark">{user.email}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted mb-1">Contact Number</label>
                        <p className="mb-0 fw-semibold text-dark">{user.contact || "N/A"}</p>
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-muted mb-1">Address</label>
                        <p className="mb-0 fw-semibold text-dark">{user.address || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-user-shield me-2 text-success"></i>
                        Account Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted mb-1">Account Status</label>
                        <div>
                          <span className={`badge bg-${activityInfo.color}`}>
                            <i className={`fas ${activityInfo.icon} me-1`}></i>
                            {activityInfo.label}
                          </span>
                        </div>
                      </div>
                      {user.deactivate_reason && (
                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Deactivation Reason</label>
                          <p className="mb-0 fw-semibold text-dark text-danger">{user.deactivate_reason}</p>
                        </div>
                      )}
                      {user.deactivated_at && (
                        <div>
                          <label className="form-label small fw-semibold text-muted mb-1">Deactivated On</label>
                          <p className="mb-0 fw-semibold text-dark">{formatDate(user.deactivated_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Timeline */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div className="card-header bg-transparent border-bottom-0">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-history me-2 text-info"></i>
                        Account Timeline
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-md-6 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Registration Date</label>
                          <p className="mb-0 fw-semibold text-dark">{formatDate(user.created_at)}</p>
                        </div>
                        {user.last_login_at && (
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label small fw-semibold text-muted mb-1">Last Login</label>
                            <p className="mb-0 fw-semibold text-dark">
                              {formatDate(user.last_login_at)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="modal-footer border-top bg-white">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Solid header background using ID and !important */
        #user-details-header {
          background: #018181 !important;
          background-color: #018181 !important;
          background-image: none !important;
        }
      `}</style>
    </Portal>
  );
};

export default UserDetailsModal;