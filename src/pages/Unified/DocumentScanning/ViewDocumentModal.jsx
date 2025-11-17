// src/pages/Unified/DocumentScanning/ViewDocumentModal.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import Portal from "../../../components/Portal";

const ViewDocumentModal = ({ document: doc, onClose }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

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
                <i className={`fas ${isPDF ? 'fa-file-pdf' : (isImage ? 'fa-file-image' : 'fa-file')} me-2`}></i>
                {doc.original_filename}
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
              <div className="row">
                {/* Document Preview */}
                <div className="col-12">
                  <div className="card border-0 bg-white mb-4">
                    <div className="card-body p-4">
                      <div className="text-center">
                        {isPDF ? (
                          <div>
                            <div className="alert alert-info mb-4">
                              <i className="fas fa-info-circle me-2"></i>
                              PDF documents open in a new window
                            </div>
                            <div className="mb-4">
                              <i className="fas fa-file-pdf fa-5x text-danger mb-3"></i>
                              <h5 className="text-dark">{doc.original_filename}</h5>
                              <p className="text-muted">PDF Document</p>
                            </div>
                            <button
                              className="btn btn-primary btn-lg"
                              onClick={() => window.open(doc.file_url, "_blank")}
                              style={{
                                backgroundColor: "#018181",
                                borderColor: "#018181",
                              }}
                            >
                              <i className="fas fa-external-link-alt me-2"></i>
                              Open PDF Document
                            </button>
                          </div>
                        ) : isImage ? (
                          <div>
                            {imageLoading && (
                              <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" role="status">
                                  <span className="visually-hidden">Loading image...</span>
                                </div>
                                <p className="text-muted">Loading image...</p>
                              </div>
                            )}
                            
                            {imageError ? (
                              <div className="alert alert-danger">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Failed to load image. 
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="alert-link ms-1">
                                  Click here to open directly
                                </a>
                              </div>
                            ) : (
                              <img
                                src={doc.file_url}
                                alt={doc.original_filename}
                                className="img-fluid rounded border"
                                style={{ 
                                  maxHeight: "50vh",
                                  display: imageLoading ? "none" : "block"
                                }}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                              />
                            )}
                            
                            {!imageLoading && !imageError && (
                              <div className="mt-3">
                                <a
                                  href={doc.file_url}
                                  className="btn btn-outline-primary btn-sm"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <i className="fas fa-external-link-alt me-1"></i>
                                  Open Image in New Tab
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="alert alert-warning">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            Unknown file type. Cannot preview this document.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Information */}
                <div className="col-12">
                  <div className="card border-0 bg-white">
                    <div
                      className="card-header border-bottom bg-white"
                      style={{
                        borderColor: "rgba(1, 129, 129, 0.2)",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        Document Information
                      </h6>
                    </div>
                    <div className="card-body" style={{ padding: "1rem" }}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Filename
                          </label>
                          <div className="text-dark">{doc.original_filename}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Record Type
                          </label>
                          <div>
                            <span className={`badge ${
                              doc.record_type === 'birth' ? 'bg-success' : 
                              doc.record_type === 'marriage' ? 'bg-info' : 
                              'bg-warning'
                            } text-white`}>
                              {doc.record_type?.charAt(0).toUpperCase() + doc.record_type?.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">
                            File Size
                          </label>
                          <div className="text-dark">{formatFileSize(doc.file_size)}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">
                            File Type
                          </label>
                          <div className="text-dark">
                            {isPDF ? 'PDF Document' : (isImage ? 'Image File' : 'Unknown')}
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Uploaded By
                          </label>
                          <div className="text-dark">{doc.uploaded_by}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark mb-1">
                            Upload Date
                          </label>
                          <div className="text-dark">{formatDate(doc.uploaded_at)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top bg-white">
              <a
                href={doc.file_url}
                className="btn btn-outline-primary"
                target="_blank"
                rel="noopener noreferrer"
                download={doc.original_filename}
              >
                <i className="fas fa-download me-2"></i>
                Download
              </a>
              <button
                type="button"
                className="btn btn-primary text-white fw-semibold"
                onClick={onClose}
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
                <i className="fas fa-times me-2"></i>
                Close
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

export default ViewDocumentModal;