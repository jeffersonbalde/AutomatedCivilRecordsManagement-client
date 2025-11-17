// src/pages/Unified/DocumentScanning/DocumentInfoModal.jsx - FIXED VERSION
import React, { useEffect } from "react";
import Portal from "../../../components/Portal";

const DocumentInfoModal = ({ document: doc, onClose, onViewDocument }) => {
  if (!doc) return null;

  const isPDF = doc.is_pdf || doc.file_url?.endsWith('.pdf');
  const isImage = doc.is_image || 
    doc.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || 
    doc.original_filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

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

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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

  useEffect(() => {
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
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                backgroundColor: "#018181",
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
                <i className="fas fa-info-circle me-2"></i>
                Document Information
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
              <div className="card border-0 bg-white">
                <div className="card-body p-4">
                  <div className="row">
                    {/* Document Icon */}
                    <div className="col-12 text-center mb-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: isPDF ? '#dc3545' : (isImage ? '#28a745' : '#6c757d'),
                        }}
                      >
                        <i className={`fas ${isPDF ? 'fa-file-pdf' : (isImage ? 'fa-file-image' : 'fa-file')} fa-2x text-white`}></i>
                      </div>
                      <h5 className="mt-3 text-dark fw-bold">{doc.original_filename}</h5>
                    </div>

                    {/* Document Details */}
                    <div className="col-12">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <td className="fw-semibold text-dark" style={{ width: "140px" }}>Filename:</td>
                            <td className="text-dark">{doc.original_filename}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold text-dark">Record Type:</td>
                            <td>
                              <span className={`badge ${
                                doc.record_type === 'birth' ? 'bg-success' : 
                                doc.record_type === 'marriage' ? 'bg-info' : 
                                'bg-warning'
                              } text-white`}>
                                {doc.record_type?.charAt(0).toUpperCase() + doc.record_type?.slice(1)}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-semibold text-dark">File Size:</td>
                            <td className="text-dark">{formatFileSize(doc.file_size)}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold text-dark">File Type:</td>
                            <td className="text-dark">
                              {isPDF ? 'PDF Document' : (isImage ? 'Image File' : 'Unknown')}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-semibold text-dark">Uploaded By:</td>
                            <td className="text-dark">{doc.uploaded_by}</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold text-dark">Upload Date:</td>
                            <td className="text-dark">{formatDate(doc.uploaded_at)}</td>
                          </tr>
                          {doc.created_at && (
                            <tr>
                              <td className="fw-semibold text-dark">Created:</td>
                              <td className="text-dark">{formatDate(doc.created_at)}</td>
                            </tr>
                          )}
                          {doc.updated_at && (
                            <tr>
                              <td className="fw-semibold text-dark">Last Updated:</td>
                              <td className="text-dark">{formatDate(doc.updated_at)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
                <i className="fas fa-times me-2"></i>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white fw-semibold"
                onClick={onViewDocument}
                style={{
                  backgroundColor: "#018181",
                  borderColor: "#018181",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#016767";
                  e.target.style.borderColor = "#016767";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#018181";
                  e.target.style.borderColor = "#018181";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <i className="fas fa-eye me-2"></i>
                View Document
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-header {
          all: unset !important;
        }
        
        .modal-header[style] {
          all: unset !important;
          background: #018181 !important;
          background-color: #018181 !important;
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
      `}</style>
    </Portal>
  );
};

export default DocumentInfoModal;