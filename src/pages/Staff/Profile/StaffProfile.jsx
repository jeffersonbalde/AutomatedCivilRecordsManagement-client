import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert } from '../../../services/notificationService';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserTie,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

const StaffProfile = () => {
  const { user } = useAuth();

  const handleContactAdmin = () => {
    showAlert.info(
      "Contact Administrator",
      `<div style="text-align: left;">
        <p><strong>For profile updates and assistance:</strong></p>
        <p>📧 Email: <strong>admin@civilregistry.gov.ph</strong></p>
        <p>📞 Phone: <strong>+639123456789</strong></p>
        <p><br>Office Hours: <strong>8:00 AM - 5:00 PM (Monday-Friday)</strong></p>
        <p><small>Please contact the system administrator for any profile changes or technical issues.</small></p>
      </div>`,
      "Got it"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // CORRECT Avatar URL construction - same as UserManagement component
  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    
    const baseUrl = import.meta.env.VITE_LARAVEL_API || 'http://localhost:8000';
    
    // Clean the filename - same logic as UserManagement
    let cleanFilename = filename;
    if (filename.includes('avatars/')) {
      cleanFilename = filename.replace('avatars/', '');
    }
    if (filename.includes('avatar_')) {
      cleanFilename = filename.replace('avatar_', '');
    }
    
    // CORRECT URL format: http://localhost:8000/api/avatar/1762566900_690ea2f4d8d0b.jpg
    return `${baseUrl}/avatar/${cleanFilename}`;
  };

  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  console.log('🔄 Staff Profile Avatar Debug:', {
    original: user?.avatar,
    cleaned: avatarUrl,
    user: user?.full_name
  });

  return (
    <div className="container-fluid px-1 py-4 fadeIn">
      {/* Header Section */}
      <div className="text-center mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-3">
          {/* Avatar Profile - View Only */}
          <div className="position-relative mb-3 mb-md-0 me-md-4">
            <div
              className="rounded-circle overflow-hidden"
              style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #018181 0%, #016767 100%)",
                boxShadow: "0 8px 25px rgba(1, 129, 129, 0.4)",
                border: "4px solid white",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${user?.full_name || 'Staff'} Avatar`}
                  className="w-100 h-100 object-fit-cover"
                  onLoad={() => console.log('✅ Avatar loaded for staff:', user?.full_name)}
                  onError={(e) => {
                    console.log('❌ Avatar failed to load for staff:', user?.full_name, 'URL:', avatarUrl);
                    // Hide the image and show fallback
                    e.target.style.display = 'none';
                  }}
                />
              ) : null}
              
              {/* Fallback avatar icon - shows if no avatar or image fails to load */}
              <div 
                className={`w-100 h-100 d-flex align-items-center justify-content-center ${avatarUrl ? 'd-none' : 'd-flex'}`}
                style={{
                  background: "linear-gradient(135deg, #018181 0%, #016767 100%)",
                  color: "white"
                }}
              >
                <FaUserTie size={40} />
              </div>
            </div>
            
            {/* Profile photo label */}
            <small 
              className="text-muted mt-2 d-block text-center"
              style={{ fontSize: "0.75rem" }}
            >
              Profile Photo
            </small>
          </div>

          <div className="text-center text-md-start">
            <h1 className="h3 mb-1 fw-bold" style={{ color: "#1a2a1a" }}>
              Registry Staff Profile
            </h1>
            <p className="text-muted mb-0">
              {user?.full_name || user?.username} • Civil Registry Staff
            </p>
            <small className="text-muted">
              {user?.is_active ? (
                <span style={{ color: "#27ae60" }}>● Active Account</span>
              ) : (
                <span style={{ color: "#e74c3c" }}>● Inactive Account</span>
              )}
            </small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Staff Information */}
        <div className="col-12 col-lg-8">
          <div
            className="card border-0 h-100"
            style={{
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
            }}
          >
            <div
              className="card-header bg-transparent border-0 py-3 px-4"
              style={{
                background: "#f8faf8",
                borderBottom: "2px solid #e0e6e0",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#018181",
                    color: "white",
                    boxShadow: "0 3px 10px rgba(1, 129, 129, 0.4)",
                  }}
                >
                  <FaUser style={{ fontSize: "1rem" }} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "#1a2a1a" }}>
                    Staff Information
                  </h6>
                  <small className="text-muted">Civil registry staff account details</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {[
                  { 
                    icon: FaUser, 
                    label: "Full Name", 
                    value: user?.full_name || "Not specified",
                    description: "Staff member's full name"
                  },
                  { 
                    icon: FaEnvelope, 
                    label: "Email Address", 
                    value: user?.email || "Not specified",
                    description: "Primary contact email"
                  },
                  { 
                    icon: FaPhone, 
                    label: "Contact Number", 
                    value: user?.contact_number || "Not specified",
                    description: "Staff contact number"
                  },
                  { 
                    icon: FaMapMarkerAlt, 
                    label: "Address", 
                    value: user?.address || "Not specified",
                    description: "Staff residential address"
                  },
                  { 
                    icon: FaCalendarAlt, 
                    label: "Last Login", 
                    value: user?.last_login_at ? formatDate(user.last_login_at) : "Never logged in",
                    description: "Most recent login activity"
                  },
                  { 
                    icon: FaCheckCircle, 
                    label: "Account Status", 
                    value: user?.is_active ? "Active" : "Inactive",
                    description: "Current account status",
                    statusColor: user?.is_active ? "#27ae60" : "#e74c3c"
                  },
                ].map((item, index) => (
                  <div key={index} className="col-12 col-sm-6">
                    <div 
                      className="d-flex align-items-start p-3 rounded-3 position-relative overflow-hidden"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e0e6e0",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f8faf8";
                        e.currentTarget.style.borderColor = "#018181";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(1, 129, 129, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.borderColor = "#e0e6e0";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            minWidth: "32px",
                          }}
                        >
                          <item.icon style={{ 
                            fontSize: "1rem", 
                            color: item.statusColor || "#018181" 
                          }} />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <small className="d-block text-muted mb-1" style={{ fontSize: "0.75rem" }}>
                              {item.label}
                            </small>
                            <span className="fw-semibold d-block" style={{ 
                              color: item.statusColor || "#1a2a1a", 
                              fontSize: "0.9rem" 
                            }}>
                              {item.value}
                            </span>
                          </div>
                        </div>
                        <small className="text-muted mt-1 d-block" style={{ fontSize: "0.7rem" }}>
                          {item.description}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Support */}
        <div className="col-12 col-lg-4">
          <div
            className="card border-0 h-100"
            style={{
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
            }}
          >
            <div
              className="card-header bg-transparent border-0 py-3 px-4"
              style={{
                background: "#f8faf8",
                borderBottom: "2px solid #e0e6e0",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#ff6b35",
                    color: "white",
                    boxShadow: "0 3px 10px rgba(255, 107, 53, 0.4)",
                  }}
                >
                  <FaMapMarkerAlt style={{ fontSize: "1rem" }} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: "#1a2a1a" }}>
                    Support & Assistance
                  </h6>
                  <small className="text-muted">Get help and support</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              {/* Staff Role Information */}
              <div 
                className="rounded-3 p-3 mb-4"
                style={{
                  background: "rgba(1, 129, 129, 0.05)",
                  border: "1px solid rgba(1, 129, 129, 0.2)",
                  boxShadow: "0 2px 8px rgba(1, 129, 129, 0.1)",
                }}
              >
                <strong style={{ color: "#1a2a1a" }} className="d-block mb-2">
                  Staff Responsibilities:
                </strong>
                <ul className="mb-0 small" style={{ color: "#4a5c4a", fontSize: "0.85rem" }}>
                  <li>Encode birth, marriage, and death records</li>
                  <li>Generate civil registry certificates</li>
                  <li>Search and retrieve civil records</li>
                  <li>Verify record accuracy and completeness</li>
                  <li>Maintain data integrity and confidentiality</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="row g-2">
                <div className="col-12">
                  <button
                    className="btn w-100 d-flex align-items-center justify-content-center py-2 position-relative overflow-hidden"
                    onClick={handleContactAdmin}
                    style={{
                      background: "linear-gradient(135deg, #018181 0%, #016767 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      boxShadow: "0 3px 12px rgba(1, 129, 129, 0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #016767 0%, #018181 100%)";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 5px 18px rgba(1, 129, 129, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #018181 0%, #016767 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 3px 12px rgba(1, 129, 129, 0.4)";
                    }}
                  >
                    <FaPhone className="me-2 flex-shrink-0" style={{ fontSize: "0.9rem" }} />
                    <span>Contact Administrator</span>
                  </button>
                </div>
              </div>

              {/* Information Note */}
              <div className="mt-4 p-3 rounded-3" style={{
                background: "rgba(255, 107, 53, 0.05)",
                border: "1px solid rgba(255, 107, 53, 0.2)",
              }}>
                <small className="text-muted d-block text-center" style={{ fontSize: "0.8rem" }}>
                  <FaUserTie className="me-1 flex-shrink-0" style={{ fontSize: "0.8rem" }} />
                  For profile updates or technical issues, please contact the system administrator.
                  Staff accounts have limited self-service capabilities.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .object-fit-cover {
          object-fit: cover;
        }
        
        .fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StaffProfile;