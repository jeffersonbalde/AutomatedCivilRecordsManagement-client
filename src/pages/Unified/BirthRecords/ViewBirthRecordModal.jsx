// src/pages/BirthRecords/components/ViewBirthRecordModal.jsx
import React from "react";
import Portal from "../../../components/Portal";

const ViewBirthRecordModal = ({ record, onClose }) => {
  if (!record) return null;

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

  // Calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

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
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Portal>
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
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
                Birth Record Details
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
                maxHeight: "80vh",
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
              }}
            >
              {/* Registry Number Banner */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card bg-primary bg-opacity-10 border-primary">
                    <div className="card-body text-center py-3">
                      <h4 className="mb-0 text-primary">
                        <i className="fas fa-certificate me-2"></i>
                        Registry Number: <strong>{record.registry_number}</strong>
                      </h4>
                      <small className="text-muted">
                        Registered on {formatDate(record.date_registered)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* Child Information */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-baby me-2"></i>
                        Child Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                          <div className="fw-semibold text-dark fs-6">
                            {record.child_first_name} {record.child_middle_name} {record.child_last_name}
                          </div>
                        </div>
                        <div className="col-md-2 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Sex</label>
                          <div>
                            <span className={`badge ${record.sex === 'Male' ? 'bg-info' : 'bg-pink'}`}>
                              {record.sex}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Date of Birth</label>
                          <div className="fw-semibold text-dark">
                            {formatDate(record.date_of_birth)}
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Age</label>
                          <div className="fw-semibold text-dark">
                            {calculateAge(record.date_of_birth)} years old
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Place of Birth</label>
                          <div className="fw-semibold text-dark">
                            {record.place_of_birth}
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Time of Birth</label>
                          <div className="fw-semibold text-dark">
                            {formatTime(record.time_of_birth)}
                          </div>
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Birth Address</label>
                          <div className="fw-semibold text-dark">
                            {[record.birth_address_house, record.birth_address_barangay, record.birth_address_city, record.birth_address_province]
                              .filter(Boolean).join(', ') || 'Not specified'}
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Type of Birth</label>
                          <div className="fw-semibold text-dark">
                            {record.type_of_birth}
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Birth Order</label>
                          <div className="fw-semibold text-dark">
                            {record.birth_order}
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Birth Weight</label>
                          <div className="fw-semibold text-dark">
                            {record.birth_weight ? `${record.birth_weight} kg` : 'Not specified'}
                          </div>
                        </div>
                        {record.multiple_birth_order && (
                          <div className="col-12 mb-3">
                            <label className="form-label small fw-semibold text-muted mb-1">Multiple Birth Order</label>
                            <div className="fw-semibold text-dark">
                              {record.multiple_birth_order}
                            </div>
                          </div>
                        )}
                        {record.birth_notes && (
                          <div className="col-12">
                            <label className="form-label small fw-semibold text-muted mb-1">Additional Notes</label>
                            <div className="text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                              {record.birth_notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parents Information */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-female me-2"></i>
                        Mother's Information
                      </h6>
                    </div>
                    <div className="card-body">
                      {record.mother ? (
                        <>
                          <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                            <div className="fw-semibold text-dark">
                              {record.mother.first_name} {record.mother.middle_name} {record.mother.last_name}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Citizenship</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.citizenship}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Religion</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.religion || 'Not specified'}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Occupation</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.occupation || 'Not specified'}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Age at Birth</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.age_at_birth}
                              </div>
                            </div>
                            <div className="col-4 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Children Born</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.children_born_alive}
                              </div>
                            </div>
                            <div className="col-4 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Living</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.children_still_living}
                              </div>
                            </div>
                            <div className="col-4 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Deceased</label>
                              <div className="fw-semibold text-dark small">
                                {record.mother.children_deceased}
                              </div>
                            </div>
                            <div className="col-12 mt-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Address</label>
                              <div className="fw-semibold text-dark small">
                                {[record.mother.house_no, record.mother.barangay, record.mother.city, record.mother.province, record.mother.country]
                                  .filter(Boolean).join(', ')}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted py-3">
                          <i className="fas fa-exclamation-circle fa-2x mb-2"></i>
                          <div>Mother's information not available</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-male me-2"></i>
                        Father's Information
                      </h6>
                    </div>
                    <div className="card-body">
                      {record.father ? (
                        <>
                          <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                            <div className="fw-semibold text-dark">
                              {record.father.first_name} {record.father.middle_name} {record.father.last_name}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Citizenship</label>
                              <div className="fw-semibold text-dark small">
                                {record.father.citizenship}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Religion</label>
                              <div className="fw-semibold text-dark small">
                                {record.father.religion || 'Not specified'}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Occupation</label>
                              <div className="fw-semibold text-dark small">
                                {record.father.occupation || 'Not specified'}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Age at Birth</label>
                              <div className="fw-semibold text-dark small">
                                {record.father.age_at_birth}
                              </div>
                            </div>
                            <div className="col-12 mt-2">
                              <label className="form-label small fw-semibold text-muted mb-1">Address</label>
                              <div className="fw-semibold text-dark small">
                                {[record.father.house_no, record.father.barangay, record.father.city, record.father.province, record.father.country]
                                  .filter(Boolean).join(', ')}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted py-3">
                          <i className="fas fa-exclamation-circle fa-2x mb-2"></i>
                          <div>Father's information not available</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parents Marriage Information */}
                {record.parents_marriage && (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">
                          <i className="fas fa-ring me-2"></i>
                          Parents Marriage Information
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label small fw-semibold text-muted mb-1">Marriage Date</label>
                            <div className="fw-semibold text-dark">
                              {formatDate(record.parents_marriage.marriage_date)}
                            </div>
                          </div>
                          <div className="col-md-8 mb-3">
                            <label className="form-label small fw-semibold text-muted mb-1">Place of Marriage</label>
                            <div className="fw-semibold text-dark">
                              {[record.parents_marriage.marriage_place_city, record.parents_marriage.marriage_place_province, record.parents_marriage.marriage_place_country]
                                .filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attendant Information */}
                {record.attendant && (
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-secondary text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-user-md me-2"></i>
                          Birth Attendant
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Name</label>
                          <div className="fw-semibold text-dark">
                            {record.attendant.attendant_name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 mb-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Type</label>
                            <div className="fw-semibold text-dark small">
                              {record.attendant.attendant_type}
                            </div>
                          </div>
                          <div className="col-6 mb-2">
                            <label className="form-label small fw-semibold text-muted mb-1">License</label>
                            <div className="fw-semibold text-dark small">
                              {record.attendant.attendant_license || 'Not specified'}
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Title/Position</label>
                            <div className="fw-semibold text-dark small">
                              {record.attendant.attendant_title}
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Address</label>
                            <div className="fw-semibold text-dark small">
                              {record.attendant.attendant_address}
                            </div>
                          </div>
                          <div className="col-12 mt-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Certification</label>
                            <div className="text-dark small" style={{ whiteSpace: 'pre-wrap' }}>
                              {record.attendant.attendant_certification}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informant Information */}
                {record.informant && (
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-dark text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-user me-2"></i>
                          Informant
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                          <div className="fw-semibold text-dark">
                            {record.informant.first_name} {record.informant.middle_name} {record.informant.last_name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 mb-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Relationship</label>
                            <div className="fw-semibold text-dark small">
                              {record.informant.relationship}
                            </div>
                          </div>
                          <div className="col-6 mb-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Certification</label>
                            <div>
                              <span className={`badge ${record.informant.certification_accepted ? 'bg-success' : 'bg-danger'}`}>
                                {record.informant.certification_accepted ? 'Accepted' : 'Not Accepted'}
                              </span>
                            </div>
                          </div>
                          <div className="col-12 mt-2">
                            <label className="form-label small fw-semibold text-muted mb-1">Address</label>
                            <div className="fw-semibold text-dark small">
                              {record.informant.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                          <label className="form-label small fw-semibold text-muted mb-1">Encoded By</label>
                          <div className="fw-semibold text-dark">
                            {record.encoded_by?.full_name || 'System'}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-muted mb-1">Date Registered</label>
                          <div className="fw-semibold text-dark">
                            {formatDate(record.date_registered)}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-muted mb-1">Last Updated</label>
                          <div className="fw-semibold text-dark">
                            {formatDate(record.updated_at)}
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // Add print functionality here
                  window.print();
                }}
              >
                <i className="fas fa-print me-2"></i>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-dialog,
          .modal-dialog * {
            visibility: visible;
          }
          .modal-dialog {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
          }
          .modal-footer {
            display: none;
          }
        }
      `}</style>
    </Portal>
  );
};

export default ViewBirthRecordModal;