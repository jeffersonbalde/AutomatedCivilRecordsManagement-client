import React from "react";
import Portal from "../../../components/Portal";

const ViewMarriageRecordModal = ({ record, onClose }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!record) return null;

  return (
    <Portal>
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div
            className="modal-content border-0"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              className="modal-header border-0 text-white"
              style={{ backgroundColor: "#018181" }}
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-eye me-2"></i>
                View Marriage Record - {record.registry_number}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div
              className="modal-body"
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
              }}
            >
              <div className="row g-4">
                {/* Basic Marriage Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div 
                      className="card-header border-bottom bg-white"
                      style={{ 
                        borderColor: 'rgba(1, 129, 129, 0.2)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        Basic Marriage Information
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Registry Number</label>
                          <div className="text-dark fs-6">{record.registry_number}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Date of Marriage</label>
                          <div className="text-dark">{formatDate(record.date_of_marriage)}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Time of Marriage</label>
                          <div className="text-dark">{formatTime(record.time_of_marriage)}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Province</label>
                          <div className="text-dark">{record.province}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">City/Municipality</label>
                          <div className="text-dark">{record.city_municipality}</div>
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Place of Marriage</label>
                          <div className="text-dark">{record.place_of_marriage}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Type of Marriage</label>
                          <div className="text-dark">{record.marriage_type}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">License Number</label>
                          <div className="text-dark">{record.license_number}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Property Regime</label>
                          <div className="text-dark">{record.property_regime}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">License Date</label>
                          <div className="text-dark">{formatDate(record.license_date)}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">License Place</label>
                          <div className="text-dark">{record.license_place}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Couple Information */}
                <div className="col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div 
                      className="card-header border-bottom bg-white"
                      style={{ 
                        borderColor: 'rgba(23, 162, 184, 0.2)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-male me-2 text-info"></i>
                        Husband's Information
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Full Name</label>
                        <div className="text-dark">
                          {record.husband_first_name} {record.husband_middle_name} {record.husband_last_name}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Date of Birth</label>
                          <div className="text-dark">{formatDate(record.husband_birthdate)}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Place of Birth</label>
                          <div className="text-dark">{record.husband_birthplace}</div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Sex</label>
                          <div className="text-dark">{record.husband_sex}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Citizenship</label>
                          <div className="text-dark">{record.husband_citizenship}</div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Religion</label>
                          <div className="text-dark">{record.husband_religion || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Civil Status</label>
                          <div className="text-dark">{record.husband_civil_status}</div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Occupation</label>
                        <div className="text-dark">{record.husband_occupation || 'Not specified'}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Address</label>
                        <div className="text-dark" style={{ lineHeight: "1.6" }}>{record.husband_address}</div>
                      </div>

                      {/* Husband's Parents */}
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-semibold text-dark mb-3">Parent's Information</h6>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Father's Name</label>
                          <div className="text-dark">{record.husband_father_name}</div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Father's Citizenship</label>
                          <div className="text-dark">{record.husband_father_citizenship}</div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Mother's Maiden Name</label>
                          <div className="text-dark">{record.husband_mother_name}</div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Mother's Citizenship</label>
                          <div className="text-dark">{record.husband_mother_citizenship}</div>
                        </div>
                      </div>

                      {/* Husband's Consent (if applicable) */}
                      {(record.husband_consent_giver || record.husband_consent_relationship) && (
                        <div className="mt-4 pt-3 border-top">
                          <h6 className="fw-semibold text-dark mb-3">Consent Information</h6>
                          {record.husband_consent_giver && (
                            <div className="mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">Consent Giver</label>
                              <div className="text-dark">{record.husband_consent_giver}</div>
                            </div>
                          )}
                          {record.husband_consent_relationship && (
                            <div className="mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">Relationship</label>
                              <div className="text-dark">{record.husband_consent_relationship}</div>
                            </div>
                          )}
                          {record.husband_consent_address && (
                            <div className="mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">Consent Giver Address</label>
                              <div className="text-dark">{record.husband_consent_address}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div 
                      className="card-header border-bottom bg-white"
                      style={{ 
                        borderColor: 'rgba(232, 62, 140, 0.2)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-female me-2 text-pink"></i>
                        Wife's Information
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Full Name</label>
                        <div className="text-dark">
                          {record.wife_first_name} {record.wife_middle_name} {record.wife_last_name}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Date of Birth</label>
                          <div className="text-dark">{formatDate(record.wife_birthdate)}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Place of Birth</label>
                          <div className="text-dark">{record.wife_birthplace}</div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Sex</label>
                          <div className="text-dark">{record.wife_sex}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Citizenship</label>
                          <div className="text-dark">{record.wife_citizenship}</div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Religion</label>
                          <div className="text-dark">{record.wife_religion || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Civil Status</label>
                          <div className="text-dark">{record.wife_civil_status}</div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Occupation</label>
                        <div className="text-dark">{record.wife_occupation || 'Not specified'}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Address</label>
                        <div className="text-dark" style={{ lineHeight: "1.6" }}>{record.wife_address}</div>
                      </div>

                      {/* Wife's Parents */}
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-semibold text-dark mb-3">Parent's Information</h6>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Father's Name</label>
                          <div className="text-dark">{record.wife_father_name}</div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Father's Citizenship</label>
                          <div className="text-dark">{record.wife_father_citizenship}</div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Mother's Maiden Name</label>
                          <div className="text-dark">{record.wife_mother_name}</div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Mother's Citizenship</label>
                          <div className="text-dark">{record.wife_mother_citizenship}</div>
                        </div>
                      </div>

                      {/* Wife's Consent (if applicable) */}
                      {(record.wife_consent_giver || record.wife_consent_relationship) && (
                        <div className="mt-4 pt-3 border-top">
                          <h6 className="fw-semibold text-dark mb-3">Consent Information</h6>
                          {record.wife_consent_giver && (
                            <div className="mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">Consent Giver</label>
                              <div className="text-dark">{record.wife_consent_giver}</div>
                            </div>
                          )}
                          {record.wife_consent_relationship && (
                            <div className="mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">Relationship</label>
                              <div className="text-dark">{record.wife_consent_relationship}</div>
                            </div>
                          )}
                          {record.wife_consent_address && (
                            <div className="mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">Consent Giver Address</label>
                              <div className="text-dark">{record.wife_consent_address}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ceremony Details */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div 
                      className="card-header border-bottom bg-white"
                      style={{ 
                        borderColor: 'rgba(255, 193, 7, 0.2)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-ring me-2 text-warning"></i>
                        Ceremony Details
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Officiating Officer</label>
                          <div className="text-dark">{record.officiating_officer}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Officiant Title</label>
                          <div className="text-dark">{record.officiant_title || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Officiant License</label>
                          <div className="text-dark">{record.officiant_license || 'Not specified'}</div>
                        </div>
                        {record.legal_basis && (
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold text-dark mb-1">Legal Basis</label>
                            <div className="text-dark">{record.legal_basis}</div>
                          </div>
                        )}
                        {record.legal_basis_article && (
                          <div className="col-12 mb-3">
                            <label className="form-label fw-semibold text-dark mb-1">Legal Basis Article/Provision</label>
                            <div className="text-dark">{record.legal_basis_article}</div>
                          </div>
                        )}
                        {record.marriage_remarks && (
                          <div className="col-12 mt-2">
                            <label className="form-label fw-semibold text-dark mb-1">Additional Remarks</label>
                            <div className="text-dark" style={{ lineHeight: "1.6" }}>{record.marriage_remarks}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Witnesses */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div 
                      className="card-header border-bottom bg-white"
                      style={{ 
                        borderColor: 'rgba(40, 167, 69, 0.2)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-users me-2 text-success"></i>
                        Witnesses
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label className="form-label fw-semibold text-dark mb-3">Witness 1</label>
                          <div className="text-dark">
                            <div className="mb-2">
                              <strong>Name:</strong> {record.witness1_name}
                            </div>
                            <div className="mb-2">
                              <strong>Address:</strong> {record.witness1_address}
                            </div>
                            {record.witness1_relationship && (
                              <div className="mb-2">
                                <strong>Relationship:</strong> {record.witness1_relationship}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <label className="form-label fw-semibold text-dark mb-3">Witness 2</label>
                          <div className="text-dark">
                            <div className="mb-2">
                              <strong>Name:</strong> {record.witness2_name}
                            </div>
                            <div className="mb-2">
                              <strong>Address:</strong> {record.witness2_address}
                            </div>
                            {record.witness2_relationship && (
                              <div className="mb-2">
                                <strong>Relationship:</strong> {record.witness2_relationship}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div 
                      className="card-header border-bottom bg-white"
                      style={{ 
                        borderColor: 'rgba(108, 117, 125, 0.2)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-database me-2 text-secondary"></i>
                        System Information
                      </h6>
                    </div>
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Date Registered</label>
                          <div className="text-dark">{formatDate(record.date_registered)}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Encoded By</label>
                          <div className="text-dark">
                            {record.encoder_name} ({record.encoder_type})
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Record Created</label>
                          <div className="text-dark">
                            {new Date(record.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
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
                className="btn btn-secondary"
                onClick={onClose}
              >
                <i className="fas fa-times me-2"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-pink {
          color: #e83e8c !important;
        }
        .card {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
      `}</style>
    </Portal>
  );
};

export default ViewMarriageRecordModal;