// src/pages/BirthRecords/components/ViewBirthRecordModal.jsx - SIMPLIFIED
import React from "react";
import Portal from "../../../components/Portal";

const ViewBirthRecordModal = ({ record, onClose }) => {
  if (!record) return null;

  // Simplified encoder info - use the data from backend
  const getEncoderInfo = () => {
    if (record.encoded_by && typeof record.encoded_by === 'object') {
      // Use the transformed data from backend
      return record.encoded_by;
    }

    // Fallback
    return { 
      name: record.encoder_name || 'System', 
      type: record.encoder_type || 'System', 
      details: 'System Account',
      email: null
    };
  };

  const encoderInfo = getEncoderInfo();

  // Format display text based on encoder type
  const getDisplayType = (type) => {
    switch (type) {
      case 'Admin': return 'Administrator';
      case 'Staff': return 'Staff';
      case 'System': return 'System';
      default: return 'User';
    }
  };

  const getDisplayDetails = (type, details) => {
    switch (type) {
      case 'Admin': return details || 'System Administrator';
      case 'Staff': return 'Registry Staff';
      case 'System': return 'System Account';
      default: return details || 'Registry User';
    }
  };

  // Rest of your component remains the same...
  // Just update the display part:

  return (
    <Portal>
      {/* Your existing modal JSX */}
      {/* ... */}

      {/* System Information */}
      <div className="col-12">
        <div className="card border-0 bg-light">
          <div className="card-header bg-transparent">
            <h6 className="mb-0 text-muted">
              <i className="fas fa-cog me-2"></i>
              System Information
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Encoded By
                </label>
                <div className="fw-semibold text-dark">
                  {encoderInfo.full_name || encoderInfo.name}
                </div>
                <small className="text-muted">
                  {getDisplayType(encoderInfo.user_type)} • {getDisplayDetails(encoderInfo.user_type, encoderInfo.position)}
                </small>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Date Registered
                </label>
                <div className="fw-semibold text-dark">
                  {formatDate(record.date_registered)}
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Last Updated
                </label>
                <div className="fw-semibold text-dark">
                  {formatDate(record.updated_at)}
                </div>
              </div>
              {encoderInfo.email && (
                <div className="col-12 mt-2">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    Encoder Contact
                  </label>
                  <div className="fw-semibold text-dark small">
                    {encoderInfo.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ... rest of your modal */}
    </Portal>
  );
};

export default ViewBirthRecordModal;