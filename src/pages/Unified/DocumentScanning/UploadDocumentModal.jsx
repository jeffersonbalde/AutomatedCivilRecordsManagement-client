// src/pages/Unified/DocumentScanning/UploadDocumentModal.jsx
import React, { useState, useEffect } from "react";
import Portal from "../../../components/Portal";
import { showAlert, showToast } from "../../../services/notificationService";

const UploadDocumentModal = ({ onClose, onSave, token }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordType, setRecordType] = useState("birth");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // File handling
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        setSelectedFile(file);

        if (file.type.startsWith("image/")) {
          setPreviewUrl(URL.createObjectURL(file));
        } else {
          setPreviewUrl(null);
        }

        setUploadProgress(0);
      } else {
        showToast.error("Please select an image or PDF file");
      }
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      showToast.error("Please select a file first");
      return;
    }

    const confirmation = await showAlert.confirm(
      "Upload Document",
      `Are you sure you want to upload "${selectedFile.name}" as a ${recordType} record?`,
      "Yes, Upload",
      "Cancel"
    );

    if (!confirmation.isConfirmed) return;

    // Show processing alert with loading state
    showAlert.processing(
      "Uploading Document",
      "Please wait while we upload the document..."
    );
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("record_type", recordType);
      formData.append("original_filename", selectedFile.name);

      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/document-scanning/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        // Close the processing alert
        showAlert.close();

        showToast.success("Document uploaded successfully!");
        clearUpload();
        onSave(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      // Close the processing alert
      showAlert.close();

      console.error("Upload error:", error);
      showAlert.error("Error", "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = async () => {
    if (selectedFile) {
      const result = await showAlert.confirm(
        "Unsaved Changes",
        "You have selected a file but haven't uploaded it. Are you sure you want to close?",
        "Yes, Close",
        "Continue Uploading"
      );

      if (!result.isConfirmed) return;
    }

    onClose();
  };

  // Effect for escape key and body scroll
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    };
  }, [loading, selectedFile]);

  return (
    <Portal>
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
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
              id="upload-document-modal-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-upload me-2"></i>
                Upload Document
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
                aria-label="Close"
                disabled={uploading}
              ></button>
            </div>

            <div
              className="modal-body"
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
              }}
            >
              {/* Record Type */}
              <div className="row mb-4">
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Record Type
                  </label>
                  <div className="btn-group w-100" role="group">
                    {["birth", "marriage", "death"].map((type) => (
                      <React.Fragment key={type}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="recordType"
                          id={type}
                          checked={recordType === type}
                          onChange={() => setRecordType(type)}
                        />
                        <label
                          className="btn btn-outline-primary"
                          htmlFor={type}
                          style={{
                            borderColor: "#018181",
                            color: recordType === type ? "white" : "#018181",
                            backgroundColor:
                              recordType === type ? "#018181" : "transparent",
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Upload Logbook Document
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="form-control"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                />
                <small className="text-muted">
                  Upload image (JPG, PNG) or PDF file of logbook page (Max: 10MB)
                </small>
              </div>

              {/* Preview for Images */}
              {previewUrl &&
                selectedFile &&
                selectedFile.type.startsWith("image/") && (
                  <div className="mb-4 text-center">
                    <h6 className="fw-semibold mb-2">Preview</h6>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}

              {/* File Info for PDF */}
              {selectedFile && selectedFile.type === "application/pdf" && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">File Information</h6>
                  <div className="alert alert-info">
                    <i className="fas fa-file-pdf me-2 text-danger"></i>
                    <strong>{selectedFile.name}</strong>
                    <br />
                    <small>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-top bg-white">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={uploadDocument}
                disabled={!selectedFile || uploading}
                style={{
                  backgroundColor: "#018181",
                  borderColor: "#018181",
                }}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload me-2"></i>
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Force solid color header with maximum specificity */
        #upload-document-modal-header {
          background: #018181 !important;
          background-image: none !important;
          background-color: #018181 !important;
        }
        
        /* Override any potential gradient from parent or Bootstrap classes */
        .modal-header#upload-document-modal-header {
          background: #018181 !important;
          background-image: none !important;
          background-color: #018181 !important;
        }
        
        /* Nuclear option - target any modal header with this ID */
        div#upload-document-modal-header.modal-header {
          background: #018181 !important;
          background-image: none !important;
          background-color: #018181 !important;
        }
        
        /* Remove any gradient images or overlays */
        #upload-document-modal-header::before,
        #upload-document-modal-header::after {
          display: none !important;
          background-image: none !important;
        }
        
        /* Ensure no background images are applied */
        #upload-document-modal-header {
          background-image: none !important;
        }
      `}</style>
    </Portal>
  );
};

export default UploadDocumentModal;