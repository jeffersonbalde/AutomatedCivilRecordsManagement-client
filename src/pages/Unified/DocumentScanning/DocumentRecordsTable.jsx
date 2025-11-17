// src/pages/Unified/DocumentScanning/DocumentRecordsTable.jsx - UPDATED VERSION
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const DocumentRecordsTable = ({
  records,
  loading,
  onViewRecord,
  onViewInfo,
  onDeleteRecord,
  currentPage,
  itemsPerPage,
  onPageChange
}) => {
  const { isAdmin, isStaff } = useAuth();
  const [sortField, setSortField] = useState("uploaded_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return "fas fa-sort";
    return sortDirection === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
  };

  // Sort records based on current sort field and direction
  const sortRecords = (records) => {
    if (!records || !records.data) return records;
    
    const sortedData = [...records.data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle null/undefined values
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortDirection === "asc" ? -1 : 1;
      if (!bValue) return sortDirection === "asc" ? 1 : -1;
      
      // Handle date fields specifically
      if (sortField === "uploaded_at" || sortField === "created_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    return {
      ...records,
      data: sortedData
    };
  };

  // Apply sorting to the records
  const sortedRecords = sortRecords(records);

  // Skeleton loader for table rows
  const TableRowSkeleton = () => (
    <tr className="align-middle" style={{ height: "70px" }}>
      <td className="text-center">
        <div className="skeleton-box" style={{ width: "30px", height: "20px", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-1">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton-box" style={{ width: "32px", height: "32px", borderRadius: "4px" }}></div>
          ))}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="skeleton-icon me-3" style={{ width: "40px", height: "40px", borderRadius: "4px" }}></div>
          <div className="flex-grow-1">
            <div className="skeleton-line mb-1" style={{ height: "16px", width: "120px" }}></div>
            <div className="skeleton-line" style={{ height: "14px", width: "80px" }}></div>
          </div>
        </div>
      </td>
      <td>
        <div className="skeleton-badge" style={{ width: "80px", height: "24px", borderRadius: "12px" }}></div>
      </td>
      <td>
        <div className="skeleton-line" style={{ height: "16px", width: "100px" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-line" style={{ height: "16px", width: "80%", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-line" style={{ height: "16px", width: "100px", margin: "0 auto" }}></div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="card shadow border-0">
        <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
          <h6 className="card-title mb-0">
            <i className="fas fa-file me-2"></i>
            Document Records
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead style={{ backgroundColor: "var(--background-light)" }}>
                <tr>
                  <th className="text-center" style={{ width: "60px", fontSize: "0.875rem" }}>#</th>
                  <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Actions</th>
                  <th style={{ minWidth: "200px", fontSize: "0.875rem" }}>Document</th>
                  <th style={{ width: "120px", fontSize: "0.875rem" }}>Type</th>
                  <th style={{ width: "100px", fontSize: "0.875rem" }}>Size</th>
                  <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Uploaded By</th>
                  <th className="text-center" style={{ minWidth: "130px", fontSize: "0.875rem" }}>Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center py-4">
            <div className="spinner-border me-2" style={{ color: "#018181" }} role="status"></div>
            <span className="text-muted">Loading document records...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow border-0">
      <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <h6 className="card-title mb-0">
            <i className="fas fa-file me-2"></i>
            Document Records
            <small className="opacity-75 ms-2">
              ({sortedRecords?.data?.length || 0} of {sortedRecords?.total || 0} records)
            </small>
          </h6>
          <div className="text-white small">
            Page {sortedRecords?.current_page || 1} of {sortedRecords?.last_page || 1}
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {!sortedRecords?.data?.length ? (
          <div className="text-center py-5">
            <i className="fas fa-file fa-4x text-muted opacity-50 mb-4"></i>
            <h5 className="text-muted mb-3">No Document Records Found</h5>
            <p className="text-muted mb-4">
              {sortedRecords?.total === 0 
                ? "No document records have been uploaded yet. Click 'Upload Document' to add the first one."
                : "No records match your current search criteria. Try adjusting your filters."
              }
            </p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead style={{ backgroundColor: "var(--background-light)" }}>
                  <tr>
                    <th className="text-center" style={{ width: "60px", fontSize: "0.875rem" }}>#</th>
                    <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Actions</th>
                    <th style={{ minWidth: "200px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold text-start w-100" 
                        onClick={() => handleSort("original_filename")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Document <i className={`ms-1 ${getSortIcon("original_filename")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th style={{ width: "120px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold text-start w-100" 
                        onClick={() => handleSort("record_type")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Type <i className={`ms-1 ${getSortIcon("record_type")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th style={{ width: "100px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold text-start w-100" 
                        onClick={() => handleSort("file_size")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Size <i className={`ms-1 ${getSortIcon("file_size")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold" 
                        onClick={() => handleSort("uploaded_by")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Uploaded By <i className={`ms-1 ${getSortIcon("uploaded_by")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th className="text-center" style={{ minWidth: "130px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold" 
                        onClick={() => handleSort("uploaded_at")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Upload Date <i className={`ms-1 ${getSortIcon("uploaded_at")}`}></i>
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.data.map((document, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const isPDF = document.is_pdf || document.file_url?.endsWith('.pdf');
                    const isImage = document.is_image || 
                      document.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || 
                      document.original_filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    
                    return (
                      <tr key={document.id} className="align-middle" style={{ height: "70px" }}>
                        {/* Row Number */}
                        <td className="text-center">
                          <span className="fw-semibold text-muted" style={{ fontSize: "0.875rem" }}>
                            {rowNumber}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            {/* View Button */}
                            <button
                              className="btn btn-sm action-btn"
                              onClick={() => onViewRecord(document)}
                              title="View Document"
                              style={{
                                backgroundColor: "#018181",
                                borderColor: "#018181",
                                color: "white",
                                width: "32px",
                                height: "32px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.875rem",
                                padding: "0",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#016767";
                                e.target.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#018181";
                                e.target.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            
                            {/* Info Button */}
                            <button
                              className="btn btn-sm action-btn"
                              onClick={() => onViewInfo(document)}
                              title="View Info"
                              style={{
                                backgroundColor: "#ffc107",
                                borderColor: "#ffc107",
                                color: "white",
                                width: "32px",
                                height: "32px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.875rem",
                                padding: "0",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#e0a800";
                                e.target.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#ffc107";
                                e.target.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-info"></i>
                            </button>
                            
                            {/* Delete Button - Only for Admin */}
                            {isAdmin && (
                              <button
                                className="btn btn-sm action-btn"
                                onClick={() => onDeleteRecord(document.id, document.original_filename)}
                                title="Delete Document"
                                style={{
                                  backgroundColor: "#dc3545",
                                  borderColor: "#dc3545",
                                  color: "white",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.875rem",
                                  padding: "0",
                                  transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#c82333";
                                  e.target.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "#dc3545";
                                  e.target.style.transform = "scale(1)";
                                }}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Document Information */}
                        <td style={{ minWidth: "200px", maxWidth: "200px" }}>
                          <div className="d-flex align-items-center h-100">
                            <div className="flex-shrink-0">
                              <div
                                className="rounded d-flex align-items-center justify-content-center text-white"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: isPDF ? '#dc3545' : (isImage ? '#28a745' : '#6c757d'),
                                  fontSize: "14px",
                                }}
                              >
                                <i className={`fas ${isPDF ? 'fa-file-pdf' : (isImage ? 'fa-file-image' : 'fa-file')}`}></i>
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3 min-w-0">
                              {/* Filename - With ellipsis for long text */}
                              <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.9rem", lineHeight: "1.3" }} title={document.original_filename}>
                                {document.original_filename}
                              </div>
                              
                              {/* File type info */}
                              <small className="text-muted d-block text-truncate mt-1" style={{ fontSize: "0.8rem", lineHeight: "1.2" }}>
                                {isPDF ? 'PDF Document' : (isImage ? 'Image File' : 'Document')}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Record Type */}
                        <td style={{ width: "120px", maxWidth: "120px" }}>
                          <span className={`badge ${
                            document.record_type === 'birth' ? 'bg-success' : 
                            document.record_type === 'marriage' ? 'bg-info' : 
                            'bg-warning'
                          } text-white text-truncate`} style={{ fontSize: "0.75rem", maxWidth: "100px" }}>
                            {document.record_type?.charAt(0).toUpperCase() + document.record_type?.slice(1)}
                          </span>
                        </td>

                        {/* File Size */}
                        <td style={{ width: "100px", maxWidth: "100px" }}>
                          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                            {formatFileSize(document.file_size)}
                          </span>
                        </td>

                        {/* Uploaded By */}
                        <td className="text-center">
                          <span className="badge bg-primary bg-opacity-10 text-primary text-truncate" style={{ fontSize: "0.75rem", maxWidth: "100px" }} title={document.uploaded_by}>
                            {document.uploaded_by}
                          </span>
                        </td>

                        {/* Upload Date */}
                        <td className="text-center" style={{ minWidth: "130px", maxWidth: "130px" }}>
                          <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.85rem", lineHeight: "1.3" }} title={formatDate(document.uploaded_at)}>
                            {formatDate(document.uploaded_at)}
                          </div>
                          <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem", lineHeight: "1.2" }}>
                            {document.uploaded_at ? new Date(document.uploaded_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {sortedRecords.last_page > 1 && (
              <div className="card-footer bg-white border-top-0 py-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="text-center text-md-start">
                    <small className="text-muted">
                      Showing <span className="fw-semibold">{sortedRecords.from}</span> to{" "}
                      <span className="fw-semibold">{sortedRecords.to}</span> of{" "}
                      <span className="fw-semibold">{sortedRecords.total}</span> entries
                    </small>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm pagination-btn"
                      onClick={() => onPageChange(sortedRecords.current_page - 1)}
                      disabled={sortedRecords.current_page === 1}
                      style={{
                        backgroundColor: sortedRecords.current_page === 1 ? "#f8f9fa" : "white",
                        borderColor: "#018181",
                        color: sortedRecords.current_page === 1 ? "#6c757d" : "#018181",
                        minWidth: "80px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (sortedRecords.current_page !== 1) {
                          e.target.style.backgroundColor = "#018181";
                          e.target.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortedRecords.current_page !== 1) {
                          e.target.style.backgroundColor = "white";
                          e.target.style.color = "#018181";
                        }
                      }}
                    >
                      <i className="fas fa-chevron-left me-1"></i>
                      Previous
                    </button>
                    
                    <div className="d-none d-md-flex gap-1">
                      {Array.from({ length: sortedRecords.last_page }, (_, i) => i + 1)
                        .filter((page) => {
                          if (sortedRecords.last_page <= 7) return true;
                          if (page === 1 || page === sortedRecords.last_page) return true;
                          if (Math.abs(page - sortedRecords.current_page) <= 1) return true;
                          return false;
                        })
                        .map((page, index, array) => {
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && <span className="px-2 text-muted">...</span>}
                              <button
                                className={`btn btn-sm pagination-page-btn ${
                                  sortedRecords.current_page === page ? "active" : ""
                                }`}
                                onClick={() => onPageChange(page)}
                                style={
                                  sortedRecords.current_page === page
                                    ? {
                                        backgroundColor: "#018181",
                                        borderColor: "#018181",
                                        minWidth: "40px",
                                        color: "white"
                                      }
                                    : {
                                        backgroundColor: "white",
                                        borderColor: "#018181",
                                        color: "#018181",
                                        minWidth: "40px",
                                        transition: "all 0.2s ease"
                                      }
                                }
                                onMouseEnter={(e) => {
                                  if (sortedRecords.current_page !== page) {
                                    e.target.style.backgroundColor = "#e6f7f7";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (sortedRecords.current_page !== page) {
                                    e.target.style.backgroundColor = "white";
                                  }
                                }}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>
                    
                    <div className="d-md-none d-flex align-items-center px-3">
                      <small className="text-muted">
                        Page <span className="fw-bold">{sortedRecords.current_page}</span> of{" "}
                        <span className="fw-bold">{sortedRecords.last_page}</span>
                      </small>
                    </div>
                    
                    <button
                      className="btn btn-sm pagination-btn"
                      onClick={() => onPageChange(sortedRecords.current_page + 1)}
                      disabled={sortedRecords.current_page === sortedRecords.last_page}
                      style={{
                        backgroundColor: sortedRecords.current_page === sortedRecords.last_page ? "#f8f9fa" : "white",
                        borderColor: "#018181",
                        color: sortedRecords.current_page === sortedRecords.last_page ? "#6c757d" : "#018181",
                        minWidth: "80px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (sortedRecords.current_page !== sortedRecords.last_page) {
                          e.target.style.backgroundColor = "#018181";
                          e.target.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortedRecords.current_page !== sortedRecords.last_page) {
                          e.target.style.backgroundColor = "white";
                          e.target.style.color = "#018181";
                        }
                      }}
                    >
                      Next
                      <i className="fas fa-chevron-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentRecordsTable;