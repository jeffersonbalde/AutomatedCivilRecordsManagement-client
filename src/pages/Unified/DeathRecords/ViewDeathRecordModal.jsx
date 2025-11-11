// src/pages/DeathRecords/components/ViewDeathRecordModal.jsx
import React from "react";
import Portal from "../../../components/Portal";

const ViewDeathRecordModal = ({ record, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAgeAtDeath = () => {
    if (record.age_under_1) {
      const parts = [];
      if (record.age_months) parts.push(`${record.age_months} months`);
      if (record.age_days) parts.push(`${record.age_days} days`);
      if (record.age_hours) parts.push(`${record.age_hours} hours`);
      if (record.age_minutes) parts.push(`${record.age_minutes} minutes`);
      return parts.length > 0 ? parts.join(', ') : 'Under 1 year';
    }
    return record.age_years ? `${record.age_years} years` : 'Not specified';
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
                View Death Record - {record.registry_number}
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
                {/* Personal Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-user me-2 text-danger"></i>
                        Personal Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Full Name</label>
                          <div className="text-dark">
                            {record.first_name} {record.middle_name} {record.last_name}
                          </div>
                        </div>
                        <div className="col-md-2 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Sex</label>
                          <div className="text-dark">
                            <span className={`badge ${record.sex === 'Male' ? 'bg-primary' : 'bg-pink'}`}>
                              {record.sex}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Civil Status</label>
                          <div className="text-dark">{record.civil_status}</div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Age at Death</label>
                          <div className="text-dark">{formatAgeAtDeath()}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Date of Birth</label>
                          <div className="text-dark">{formatDate(record.date_of_birth)}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Date of Death</label>
                          <div className="text-dark">{formatDate(record.date_of_death)}</div>
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Place of Death</label>
                          <div className="text-dark">{record.place_of_death}</div>
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Residence</label>
                          <div className="text-dark">{record.residence}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Citizenship</label>
                          <div className="text-dark">{record.citizenship}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Religion</label>
                          <div className="text-dark">{record.religion || 'Not specified'}</div>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold text-dark mb-1">Occupation</label>
                          <div className="text-dark">{record.occupation || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parents Information */}
                <div className="col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-male me-2 text-success"></i>
                        Father's Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-dark mb-1">Name</label>
                        <div className="text-dark">{record.father_name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-female me-2 text-info"></i>
                        Mother's Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-dark mb-1">Maiden Name</label>
                        <div className="text-dark">{record.mother_maiden_name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-stethoscope me-2 text-warning"></i>
                        Medical Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Immediate Cause</label>
                          <div className="text-dark">{record.immediate_cause}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Antecedent Cause</label>
                          <div className="text-dark">{record.antecedent_cause || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Underlying Cause</label>
                          <div className="text-dark">{record.underlying_cause || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Other Conditions</label>
                          <div className="text-dark">{record.other_significant_conditions || 'Not specified'}</div>
                        </div>
                        {record.maternal_condition && (
                          <div className="col-12 mb-3">
                            <label className="form-label fw-semibold text-dark mb-1">Maternal Condition</label>
                            <div className="text-dark">{record.maternal_condition}</div>
                          </div>
                        )}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Manner of Death</label>
                          <div className="text-dark">{record.manner_of_death || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Place of Occurrence</label>
                          <div className="text-dark">{record.place_of_occurrence || 'Not specified'}</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Autopsy Performed</label>
                          <div className="text-dark">
                            <span className={`badge ${record.autopsy === 'Yes' ? 'bg-success' : 'bg-danger'}`}>
                              {record.autopsy || 'Not specified'}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark mb-1">Attendant</label>
                          <div className="text-dark">{record.attendant}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Death Certification */}
                <div className="col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-certificate me-2 text-secondary"></i>
                        Death Certification
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Certifier Name</label>
                        <div className="text-dark">{record.certifier_name}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Title/Position</label>
                        <div className="text-dark">{record.certifier_title || 'Not specified'}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Address</label>
                        <div className="text-dark">{record.certifier_address || 'Not specified'}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Date</label>
                        <div className="text-dark">{formatDate(record.certifier_date)}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Attended Deceased</label>
                        <div className="text-dark">
                          <span className={`badge ${record.attended_deceased === 'Yes' ? 'bg-success' : 'bg-danger'}`}>
                            {record.attended_deceased || 'Not specified'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="form-label fw-semibold text-dark mb-1">Time of Death</label>
                        <div className="text-dark">{record.death_occurred_time || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Burial Details */}
                <div className="col-md-6">
                  <div className="card border-0 bg-white h-100">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-monument me-2 text-dark"></i>
                        Burial Details
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Corpse Disposal</label>
                        <div className="text-dark">{record.corpse_disposal || 'Not specified'}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Cemetery/Crematory</label>
                        <div className="text-dark">{record.cemetery_name || 'Not specified'}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark mb-1">Cemetery Address</label>
                        <div className="text-dark">{record.cemetery_address || 'Not specified'}</div>
                      </div>
                      {record.burial_permit_number && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Burial Permit Number</label>
                          <div className="text-dark">{record.burial_permit_number}</div>
                        </div>
                      )}
                      {record.burial_permit_date && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Burial Permit Date</label>
                          <div className="text-dark">{formatDate(record.burial_permit_date)}</div>
                        </div>
                      )}
                      {record.transfer_permit_number && (
                        <div>
                          <label className="form-label fw-semibold text-dark mb-1">Transfer Permit Number</label>
                          <div className="text-dark">{record.transfer_permit_number}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informant Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-user-tie me-2 text-purple"></i>
                        Informant Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Name</label>
                          <div className="text-dark">{record.informant_name}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Relationship</label>
                          <div className="text-dark">{record.informant_relationship}</div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">Date</label>
                          <div className="text-dark">{formatDate(record.informant_date)}</div>
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold text-dark mb-1">Address</label>
                          <div className="text-dark">{record.informant_address || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        System Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Registry Number</label>
                          <div className="text-dark">{record.registry_number}</div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Date Registered</label>
                          <div className="text-dark">{formatDate(record.date_registered)}</div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <label className="form-label fw-semibold text-dark mb-1">Encoded By</label>
                          <div className="text-dark">
                            {record.encoded_by?.full_name || record.encoder_name || 'System'}
                            <small className="text-muted ms-2">({record.encoded_by?.user_type || record.encoder_type})</small>
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
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-purple {
          color: #6f42c1 !important;
        }
        .card {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .bg-pink {
          background-color: #e83e8c !important;
        }
      `}</style>
    </Portal>
  );
};

export default ViewDeathRecordModal;