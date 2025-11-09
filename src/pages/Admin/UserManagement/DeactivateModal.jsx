// components/admin/DeactivateModal.jsx
import React, { useState } from "react";
import Portal from "../../../components/Portal";
import { showAlert } from "../../../services/notificationService";

const DeactivateModal = ({ user, onClose, onDeactivate, loading }) => {
  const [deactivateReason, setDeactivateReason] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deactivateReason.trim()) {
      showAlert.error("Error", "Please provide a reason for deactivation");
      return;
    }

    await onDeactivate(deactivateReason);
  };

  const predefinedReasons = [
    "Left the organization",
    "Performance issues",
    "Violation of policies",
    "Position eliminated",
    "Other"
  ];

  return (
    <Portal>
      <div 
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div 
            className="modal-content border-0"
            style={{ 
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header - Same color as StaffFormModal */}
            <div 
              id="deactivate-modal-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-user-slash me-2"></i>
                Deactivate Account
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
                disabled={loading}
              ></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Modal Body with grey background - Matching StaffFormModal */}
              <div 
                className="modal-body"
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <div className="alert alert-warning border-0">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  You are about to deactivate <strong>{user.name}</strong>'s account.
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark mb-1">
                    Reason for Deactivation <span className="text-danger">*</span>
                  </label>
                  
                  <div className="mb-3">
                    {predefinedReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        className="btn btn-outline-secondary btn-sm me-2 mb-2"
                        onClick={() => setDeactivateReason(reason)}
                        style={{
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#6c757d";
                          e.target.style.borderColor = "#6c757d";
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.borderColor = "#6c757d";
                          e.target.style.color = "#6c757d";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Please provide a detailed reason for deactivation..."
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                    required
                    disabled={loading}
                    style={{ backgroundColor: "#ffffff" }}
                  />
                  <div className="form-text">
                    This reason will be recorded and may be used for reporting purposes.
                  </div>
                </div>

                <div className="alert alert-info border-0">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Note:</strong> Deactivated accounts can be reactivated later. 
                  The staff member will lose access to the system until reactivated.
                </div>
              </div>
              
              {/* Footer - Matching StaffFormModal design */}
              <div className="modal-footer border-top bg-white">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    transition: "all 0.3s ease",
                    minWidth: "100px"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#6c757d";
                      e.target.style.borderColor = "#6c757d";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.borderColor = "#6c757d";
                      e.target.style.color = "#6c757d";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn fw-semibold position-relative"
                  disabled={loading || !deactivateReason.trim()}
                  style={{
                    backgroundColor: loading ? "#6c757d" : "#dc3545",
                    borderColor: loading ? "#6c757d" : "#dc3545",
                    color: "white",
                    transition: "all 0.3s ease",
                    minWidth: "160px"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && deactivateReason.trim()) {
                      e.target.style.backgroundColor = "#c82333";
                      e.target.style.borderColor = "#c82333";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = "0 4px 8px rgba(220, 53, 69, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && deactivateReason.trim()) {
                      e.target.style.backgroundColor = "#dc3545";
                      e.target.style.borderColor = "#dc3545";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!loading && deactivateReason.trim()) {
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Deactivating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-slash me-2"></i>
                      Deactivate Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        /* Header background - SAME COLOR AS StaffFormModal */
        #deactivate-modal-header {
          background: #018181 !important;
          background-color: #018181 !important;
          background-image: none !important;
        }
        
        /* Input field styling to match StaffFormModal */
        #deactivate-modal-header ~ .modal-body .form-control {
          background-color: #ffffff !important;
        }
        
        /* Focus states matching StaffFormModal */
        #deactivate-modal-header ~ .modal-body .form-control:focus {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
        
        /* Alert styling */
        #deactivate-modal-header ~ .modal-body .alert {
          border-radius: 8px;
        }
      `}</style>
    </Portal>
  );
};

export default DeactivateModal;