// src/pages/Unified/GenerateCertificates/components/CertificateIssuanceForm.jsx
import React, { useState } from "react";
import { showToast, showAlert } from "../../../services/notificationService";
import Portal from "../../../components/Portal";

const CertificateIssuanceForm = ({
  certificateData,
  onClose,
  onIssue,
  loading,
}) => {
  const [issuanceData, setIssuanceData] = useState({
    issued_to: "",
    purpose: "",
    amount_paid: 180.0,
    or_number: "",
    date_paid: new Date().toISOString().split("T")[0],
    verified_by: "JUNALYN R. TUBIGON", // Default value but editable
  });

  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setIssuanceData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

// In CertificateIssuanceForm.jsx, update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setFormLoading(true);
  setErrors({});

  // Enhanced frontend validation
  const validationErrors = {};
  
  if (!issuanceData.issued_to.trim()) {
    validationErrors.issued_to = "Recipient name is required";
  }

  if (!issuanceData.or_number.trim()) {
    validationErrors.or_number = "OR number is required";
  }

  if (!issuanceData.date_paid) {
    validationErrors.date_paid = "Date paid is required";
  }

  if (!issuanceData.verified_by.trim()) {
    validationErrors.verified_by = "Verified by clerk name is required";
  }

  // Validate amount
  if (!issuanceData.amount_paid || issuanceData.amount_paid <= 0) {
    validationErrors.amount_paid = "Valid amount is required";
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setFormLoading(false);
    showToast.error("Please fill in all required fields correctly");
    return;
  }

  try {
    showAlert.processing(
      "Issuing Certificate",
      "Please wait while we process your certificate issuance..."
    );

    await onIssue(issuanceData);
    showAlert.close();
  } catch (error) {
    console.error("Certificate issuance error:", error);
    showAlert.close();
    
    // Enhanced error display
    if (error.errors) {
      setErrors(error.errors);
      
      // Show specific field errors in toast
      const fieldErrors = Object.keys(error.errors);
      if (fieldErrors.length > 0) {
        const firstError = error.errors[fieldErrors[0]];
        if (Array.isArray(firstError)) {
          showToast.error(firstError[0] || "Please fix the form errors");
        } else {
          showToast.error(firstError || "Please fix the form errors");
        }
      } else {
        showToast.error(error.message || "Please fix the form errors");
      }
    } else {
      showToast.error(error.message || "Failed to issue certificate");
    }
  } finally {
    setFormLoading(false);
  }
};

  const generateORNumber = () => {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000);
    handleInputChange("or_number", randomNum.toString());
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !formLoading) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === "Escape" && !formLoading) {
      e.preventDefault();
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
  }, [formLoading]);

  const isSubmitting = formLoading || loading;

  return (
    <Portal>
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered mx-3 mx-sm-auto">
          <div
            className="modal-content border-0"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              id="certificate-issuance-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-certificate me-2"></i>
                Issue Certificate
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
                disabled={isSubmitting}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body bg-light">
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Certificate Details:</strong>
                      <br />
                      Type: {certificateData.certificate_type.toUpperCase()}
                      <br />
                      Certificate No: {certificateData.certificate_number}
                      <br />
                      Registry No: {certificateData.record.registry_number}
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Issued To <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.issued_to ? "is-invalid" : ""
                      }`}
                      placeholder="Enter recipient's full name"
                      value={issuanceData.issued_to}
                      onChange={(e) =>
                        handleInputChange("issued_to", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                    />
                    {errors.issued_to && (
                      <div className="invalid-feedback">{errors.issued_to}</div>
                    )}
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Purpose</label>
                    <select
                      className={`form-control ${
                        errors.purpose ? "is-invalid" : ""
                      }`}
                      value={issuanceData.purpose}
                      onChange={(e) =>
                        handleInputChange("purpose", e.target.value)
                      }
                      disabled={isSubmitting}
                    >
                      <option value="">Select purpose...</option>
                      <option value="Legal">Legal Requirements</option>
                      <option value="Personal">Personal Use</option>
                      <option value="Employment">Employment</option>
                      <option value="Education">Education</option>
                      <option value="Travel">Travel</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.purpose && (
                      <div className="invalid-feedback">{errors.purpose}</div>
                    )}
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Verified By Clerk <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.verified_by ? "is-invalid" : ""}`}
                      placeholder="Enter clerk name for verification"
                      value={issuanceData.verified_by}
                      onChange={(e) => handleInputChange("verified_by", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.verified_by && (
                      <div className="invalid-feedback">{errors.verified_by}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Amount Paid <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">₱</span>
                      <input
                        type="number"
                        className={`form-control ${
                          errors.amount_paid ? "is-invalid" : ""
                        }`}
                        step="0.01"
                        min="0"
                        value={issuanceData.amount_paid}
                        onChange={(e) =>
                          handleInputChange(
                            "amount_paid",
                            parseFloat(e.target.value)
                          )
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.amount_paid && (
                      <div className="invalid-feedback d-block">
                        {errors.amount_paid}
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      O.R. Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.or_number ? "is-invalid" : ""
                        }`}
                        placeholder="Enter OR number"
                        value={issuanceData.or_number}
                        onChange={(e) =>
                          handleInputChange("or_number", e.target.value)
                        }
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={generateORNumber}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-random"></i>
                      </button>
                    </div>
                    {errors.or_number && (
                      <div className="invalid-feedback d-block">
                        {errors.or_number}
                      </div>
                    )}
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">
                      Date Paid <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_paid ? "is-invalid" : ""
                      }`}
                      value={issuanceData.date_paid}
                      onChange={(e) =>
                        handleInputChange("date_paid", e.target.value)
                      }
                      required
                      disabled={isSubmitting}
                    />
                    {errors.date_paid && (
                      <div className="invalid-feedback">{errors.date_paid}</div>
                    )}
                  </div>

                  {/* Show backend validation errors summary */}
                  {errors.message && (
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <strong>Validation Error:</strong> {errors.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-top bg-white">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
                <button
                  type="submit"
                  className="btn fw-semibold position-relative"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? "#6c757d" : "#018181",
                    borderColor: isSubmitting ? "#6c757d" : "#018181",
                    color: "white",
                    transition: "all 0.3s ease",
                    minWidth: "140px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.backgroundColor = "#016767";
                      e.target.style.borderColor = "#016767";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 8px rgba(1, 129, 129, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.backgroundColor = "#018181";
                      e.target.style.borderColor = "#018181";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Issuing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>Issue Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        #certificate-issuance-header {
          background: #018181 !important;
          background-color: #018181 !important;
          background-image: none !important;
        }
      `}</style>
    </Portal>
  );
};

export default CertificateIssuanceForm;