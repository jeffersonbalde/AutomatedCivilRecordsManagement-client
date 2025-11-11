// src/pages/BirthRecords/components/ViewBirthRecordModal.jsx
import React from "react";
import Portal from "../../../components/Portal";

const ViewBirthRecordModal = ({ record, onClose }) => {
  if (!record) return null;

  // Get encoder display information
  const getEncoderInfo = () => {
    if (record.encoded_by && typeof record.encoded_by === "object") {
      return record.encoded_by;
    }

    return {
      full_name: record.encoder_name || "System",
      user_type: record.encoder_type || "System",
      position: "System Account",
      email: null,
    };
  };

  const encoderInfo = getEncoderInfo();

  // Format display text
  const getDisplayType = (type) => {
    switch (type) {
      case "Admin":
        return "Administrator";
      case "Staff":
        return "Staff";
      case "System":
        return "System";
      default:
        return "User";
    }
  };

  const getDisplayDetails = (type, details) => {
    switch (type) {
      case "Admin":
        return details || "System Administrator";
      case "Staff":
        return "Registry Staff";
      case "System":
        return "System Account";
      default:
        return details || "Registry User";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
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
        <div className="modal-dialog modal-dialog-centered modal-lg mx-3 mx-sm-auto">
          <div
            className="modal-content border-0"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header - Using custom class to override .modal-header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                backgroundColor: "#079B96",
                color: "white",
                borderBottom: "none",
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem",
              }}
            >
              <h5
                className="modal-title fw-bold"
                style={{ margin: 0, color: "white" }}
              >
                <i className="fas fa-eye me-2"></i>
                Birth Record Details
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
                style={{
                  filter: "invert(1)",
                }}
              ></button>
            </div>

            <div
              className="modal-body bg-light"
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              <div className="row g-3">
                {/* Record Header */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "#079B96",
                            }}
                          >
                            <i className="fas fa-baby text-white"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h4 className="mb-2 text-dark fw-bold">
                            {record.child_first_name} {record.child_middle_name}{" "}
                            {record.child_last_name}
                          </h4>
                          <div className="d-flex flex-wrap gap-2">
                            <span
                              className={`badge ${
                                record.sex === "Male" ? "bg-info" : "bg-pink"
                              } text-white`}
                            >
                              {record.sex}
                            </span>
                            <span className="badge bg-primary text-white">
                              {record.type_of_birth}
                            </span>
                            <span className="badge bg-light text-dark border">
                              <i className="fas fa-certificate me-1"></i>
                              {record.registry_number}
                            </span>
                            <span className="badge bg-success text-white">
                              Born: {formatDate(record.date_of_birth)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Child Information */}
                <div className="col-12 col-md-6">
                  <div
                    className="card border-0 bg-white"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="card-header border-bottom bg-white"
                      style={{
                        borderColor: "rgba(7, 155, 150, 0.2)",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-baby me-2 text-primary"></i>
                        Child Information
                      </h6>
                    </div>
                    <div className="card-body" style={{ padding: "1rem" }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          <i className="fas fa-user me-1 text-info"></i>
                          Full Name
                        </label>
                        <div className="text-dark">
                          {record.child_first_name} {record.child_middle_name}{" "}
                          {record.child_last_name}
                        </div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          <i className="fas fa-venus-mars me-1 text-primary"></i>
                          Sex & Age
                        </label>
                        <div className="text-dark">
                          {record.sex} • {calculateAge(record.date_of_birth)}{" "}
                          years old
                        </div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          <i className="fas fa-calendar-alt me-1 text-success"></i>
                          Date of Birth
                        </label>
                        <div className="text-dark">
                          {formatDate(record.date_of_birth)}
                        </div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          <i className="fas fa-clock me-1 text-secondary"></i>
                          Time of Birth
                        </label>
                        <div className="text-dark">
                          {formatTime(record.time_of_birth)}
                        </div>
                      </div>
                      <div>
                        <label className="form-label fw-semibold text-dark mb-1">
                          <i className="fas fa-map-marker-alt me-1 text-danger"></i>
                          Place of Birth
                        </label>
                        <div className="text-dark">{record.place_of_birth}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Birth Details */}
                <div className="col-12 col-md-6">
                  <div
                    className="card border-0 bg-white"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="card-header border-bottom bg-white"
                      style={{
                        borderColor: "rgba(7, 155, 150, 0.2)",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-info-circle me-2 text-warning"></i>
                        Birth Details
                      </h6>
                    </div>
                    <div className="card-body" style={{ padding: "1rem" }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          Type of Birth
                        </label>
                        <div className="text-dark">{record.type_of_birth}</div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          Birth Order
                        </label>
                        <div className="text-dark">{record.birth_order}</div>
                      </div>
                      <div style={{ marginBottom: "1rem" }}>
                        <label className="form-label fw-semibold text-dark mb-1">
                          Birth Weight
                        </label>
                        <div className="text-dark">
                          {record.birth_weight
                            ? `${record.birth_weight} kg`
                            : "Not specified"}
                        </div>
                      </div>
                      {record.multiple_birth_order && (
                        <div style={{ marginBottom: "1rem" }}>
                          <label className="form-label fw-semibold text-dark mb-1">
                            Multiple Birth Order
                          </label>
                          <div className="text-dark">
                            {record.multiple_birth_order}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="form-label fw-semibold text-dark mb-1">
                          Birth Address
                        </label>
                        <div className="text-dark small">
                          {[
                            record.birth_address_house,
                            record.birth_address_barangay,
                            record.birth_address_city,
                            record.birth_address_province,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mother's Information */}
                <div className="col-12 col-md-6">
                  <div
                    className="card border-0 bg-white"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="card-header border-bottom bg-white"
                      style={{
                        borderColor: "rgba(7, 155, 150, 0.2)",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-female me-2 text-success"></i>
                        Mother's Information
                      </h6>
                    </div>
                    <div className="card-body" style={{ padding: "1rem" }}>
                      {record.mother ? (
                        <>
                          <div style={{ marginBottom: "1rem" }}>
                            <label className="form-label fw-semibold text-dark mb-1">
                              Full Name
                            </label>
                            <div className="text-dark">
                              {record.mother.first_name}{" "}
                              {record.mother.middle_name}{" "}
                              {record.mother.last_name}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Citizenship
                              </label>
                              <div className="text-dark small">
                                {record.mother.citizenship}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Age at Birth
                              </label>
                              <div className="text-dark small">
                                {record.mother.age_at_birth}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Occupation
                              </label>
                              <div className="text-dark small">
                                {record.mother.occupation || "Not specified"}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Religion
                              </label>
                              <div className="text-dark small">
                                {record.mother.religion || "Not specified"}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Address
                            </label>
                            <div className="text-dark small">
                              {[
                                record.mother.house_no,
                                record.mother.barangay,
                                record.mother.city,
                                record.mother.province,
                                record.mother.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
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

                {/* Father's Information */}
                <div className="col-12 col-md-6">
                  <div
                    className="card border-0 bg-white"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="card-header border-bottom bg-white"
                      style={{
                        borderColor: "rgba(7, 155, 150, 0.2)",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-male me-2 text-info"></i>
                        Father's Information
                      </h6>
                    </div>
                    <div className="card-body" style={{ padding: "1rem" }}>
                      {record.father ? (
                        <>
                          <div style={{ marginBottom: "1rem" }}>
                            <label className="form-label fw-semibold text-dark mb-1">
                              Full Name
                            </label>
                            <div className="text-dark">
                              {record.father.first_name}{" "}
                              {record.father.middle_name}{" "}
                              {record.father.last_name}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Citizenship
                              </label>
                              <div className="text-dark small">
                                {record.father.citizenship}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Age at Birth
                              </label>
                              <div className="text-dark small">
                                {record.father.age_at_birth}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Occupation
                              </label>
                              <div className="text-dark small">
                                {record.father.occupation || "Not specified"}
                              </div>
                            </div>
                            <div className="col-6 mb-2">
                              <label className="form-label fw-semibold text-dark mb-1">
                                Religion
                              </label>
                              <div className="text-dark small">
                                {record.father.religion || "Not specified"}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Address
                            </label>
                            <div className="text-dark small">
                              {[
                                record.father.house_no,
                                record.father.barangay,
                                record.father.city,
                                record.father.province,
                                record.father.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
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
                    <div className="card border-0 bg-white">
                      <div
                        className="card-header border-bottom bg-white"
                        style={{
                          borderColor: "rgba(7, 155, 150, 0.2)",
                          padding: "0.75rem 1rem",
                        }}
                      >
                        <h6 className="mb-0 fw-semibold text-dark">
                          <i className="fas fa-ring me-2 text-warning"></i>
                          Parents Marriage Information
                        </h6>
                      </div>
                      <div className="card-body" style={{ padding: "1rem" }}>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Marriage Date
                            </label>
                            <div className="text-dark">
                              {formatDate(
                                record.parents_marriage.marriage_date
                              )}
                            </div>
                          </div>
                          <div className="col-md-8 mb-3">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Place of Marriage
                            </label>
                            <div className="text-dark">
                              {[
                                record.parents_marriage.marriage_place_city,
                                record.parents_marriage.marriage_place_province,
                                record.parents_marriage.marriage_place_country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Birth Attendant */}
                {record.attendant && (
                  <div className="col-12 col-md-6">
                    <div className="card border-0 bg-white">
                      <div
                        className="card-header border-bottom bg-white"
                        style={{
                          borderColor: "rgba(7, 155, 150, 0.2)",
                          padding: "0.75rem 1rem",
                        }}
                      >
                        <h6 className="mb-0 fw-semibold text-dark">
                          <i className="fas fa-user-md me-2 text-primary"></i>
                          Birth Attendant
                        </h6>
                      </div>
                      <div className="card-body" style={{ padding: "1rem" }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <label className="form-label fw-semibold text-dark mb-1">
                            Name
                          </label>
                          <div className="text-dark">
                            {record.attendant.attendant_name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 mb-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Type
                            </label>
                            <div className="text-dark small">
                              {record.attendant.attendant_type}
                            </div>
                          </div>
                          <div className="col-6 mb-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              License
                            </label>
                            <div className="text-dark small">
                              {record.attendant.attendant_license ||
                                "Not specified"}
                            </div>
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Title/Position
                            </label>
                            <div className="text-dark small">
                              {record.attendant.attendant_title}
                            </div>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Address
                            </label>
                            <div className="text-dark small">
                              {record.attendant.attendant_address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informant */}
                {record.informant && (
                  <div className="col-12 col-md-6">
                    <div className="card border-0 bg-white">
                      <div
                        className="card-header border-bottom bg-white"
                        style={{
                          borderColor: "rgba(7, 155, 150, 0.2)",
                          padding: "0.75rem 1rem",
                        }}
                      >
                        <h6 className="mb-0 fw-semibold text-dark">
                          <i className="fas fa-user me-2 text-secondary"></i>
                          Informant
                        </h6>
                      </div>
                      <div className="card-body" style={{ padding: "1rem" }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <label className="form-label fw-semibold text-dark mb-1">
                            Full Name
                          </label>
                          <div className="text-dark">
                            {record.informant.first_name}{" "}
                            {record.informant.middle_name}{" "}
                            {record.informant.last_name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6 mb-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Relationship
                            </label>
                            <div className="text-dark small">
                              {record.informant.relationship}
                            </div>
                          </div>
                          <div className="col-6 mb-2">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Certification
                            </label>
                            <div>
                              <span
                                className={`badge ${
                                  record.informant.certification_accepted
                                    ? "bg-success"
                                    : "bg-danger"
                                } text-white`}
                              >
                                {record.informant.certification_accepted
                                  ? "Accepted"
                                  : "Not Accepted"}
                              </span>
                            </div>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark mb-1">
                              Address
                            </label>
                            <div className="text-dark small">
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
                  <div className="card border-0 bg-white">
                    <div
                      className="card-header border-bottom bg-white"
                      style={{
                        borderColor: "rgba(7, 155, 150, 0.2)",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-cog me-2 text-muted"></i>
                        System Information
                      </h6>
                    </div>
                    <div className="card-body" style={{ padding: "1rem" }}>
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Encoded By
                          </label>
                          <div className="text-dark">
                            {encoderInfo.full_name}
                          </div>
                          <small className="text-muted">
                            {getDisplayType(encoderInfo.user_type)} •{" "}
                            {getDisplayDetails(
                              encoderInfo.user_type,
                              encoderInfo.position
                            )}
                          </small>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Date Registered
                          </label>
                          <div className="text-dark">
                            {formatDate(record.date_registered)}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Last Updated
                          </label>
                          <div className="text-dark">
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
                className="btn btn-primary text-white fw-semibold"
                onClick={onClose}
                style={{
                  backgroundColor: "#079B96",
                  borderColor: "#079B96",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#067a75";
                  e.target.style.borderColor = "#067a75";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#079B96";
                  e.target.style.borderColor = "#079B96";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <i className="fas fa-times me-2"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* NUCLEAR CSS - This will definitely work */
        .modal-header {
          all: unset !important;
        }
        
        .modal-header[style] {
          all: unset !important;
          background: #079B96 !important;
          background-color: #079B96 !important;
          background-image: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 1rem 1.5rem !important;
          border-bottom: none !important;
          color: white !important;
        }
        
        /* Remove any pseudo-elements */
        .modal-header::before,
        .modal-header::after {
          display: none !important;
          content: none !important;
        }
        
        /* Override CSS variables at the root level */
        :root {
          --primary-color: #079B96 !important;
          --primary-light: #079B96 !important;
        }

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
