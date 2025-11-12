// src/pages/Unified/GenerateCertificates/components/CertificateIssuanceForm.jsx
import React, { useState } from "react";
import { showToast } from "../../../services/notificationService";

const CertificateIssuanceForm = ({ certificateData, onClose, onIssue }) => {
  const [issuanceData, setIssuanceData] = useState({
    issued_to: "",
    purpose: "",
    amount_paid: 180.00,
    or_number: "",
    date_paid: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setIssuanceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!issuanceData.issued_to.trim()) {
      showToast.warning("Please enter the recipient's name");
      setLoading(false);
      return;
    }

    if (!issuanceData.or_number.trim()) {
      showToast.warning("Please enter the OR number");
      setLoading(false);
      return;
    }

    try {
      await onIssue(issuanceData);
    } catch (error) {
      console.error("Error issuing certificate:", error);
      showToast.error("Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  const generateORNumber = () => {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000);
    handleInputChange('or_number', randomNum.toString());
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header text-white" style={{ backgroundColor: "#018181" }}>
            <h5 className="modal-title">
              <i className="fas fa-file-certificate me-2"></i>
              Issue Certificate
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Certificate Details:</strong><br />
                    Type: {certificateData.certificate_type.toUpperCase()}<br />
                    Certificate No: {certificateData.certificate_number}<br />
                    Registry No: {certificateData.record.registry_number}
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">
                    Issued To <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter recipient's full name"
                    value={issuanceData.issued_to}
                    onChange={(e) => handleInputChange('issued_to', e.target.value)}
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">Purpose</label>
                  <select
                    className="form-select"
                    value={issuanceData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                  >
                    <option value="">Select purpose...</option>
                    <option value="Legal">Legal Requirements</option>
                    <option value="Personal">Personal Use</option>
                    <option value="Employment">Employment</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Amount Paid <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">₱</span>
                    <input
                      type="number"
                      className="form-control"
                      step="0.01"
                      value={issuanceData.amount_paid}
                      onChange={(e) => handleInputChange('amount_paid', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    O.R. Number <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter OR number"
                      value={issuanceData.or_number}
                      onChange={(e) => handleInputChange('or_number', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={generateORNumber}
                    >
                      <i className="fas fa-random"></i>
                    </button>
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">
                    Date Paid <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={issuanceData.date_paid}
                    onChange={(e) => handleInputChange('date_paid', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <i className="fas fa-times me-2"></i>Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
                style={{
                  backgroundColor: "#018181",
                  borderColor: "#018181",
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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
  );
};

export default CertificateIssuanceForm;