// src/pages/Admin/Backup/components/BackupList.jsx
import React, { useState, useEffect } from "react";

const BackupList = ({ backups, loading, onDownloadBackup, onDeleteBackup, formatFileSize }) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  const totalPages = Math.ceil(backups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBackups = backups.slice(startIndex, endIndex);

  const BackupRowSkeleton = () => (
    <tr>
      <td className="text-center fw-bold text-muted">
        <div className="skeleton-line" style={{ width: "20px", height: "20px", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-1">
          <div className="skeleton-box" style={{ width: "32px", height: "32px", borderRadius: "4px" }}></div>
          <div className="skeleton-box" style={{ width: "32px", height: "32px", borderRadius: "4px" }}></div>
        </div>
      </td>
      <td className="text-center">
        <div className="skeleton-line mb-1" style={{ width: "120px", height: "16px", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-line" style={{ width: "80px", height: "16px", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-line" style={{ width: "150px", height: "16px", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-line" style={{ width: "80px", height: "16px", margin: "0 auto" }}></div>
      </td>
    </tr>
  );

  const formatPhilippineDateTime = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return { date: "Invalid Date", time: "" };
      }

      // Use Philippine locale for display
      return {
        date: date.toLocaleDateString("en-PH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        time: date.toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    } catch (error) {
      console.error('Date parsing error:', error);
      return { date: "Date Error", time: "" };
    }
  };

  const getFileTypeIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'sql':
        return 'fas fa-database text-primary';
      case 'zip':
        return 'fas fa-file-archive text-warning';
      case 'gz':
        return 'fas fa-file-archive text-warning';
      default:
        return 'fas fa-file text-secondary';
    }
  };

  if (loading) {
    return (
      <div className="card shadow border-0">
        <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
          <h6 className="card-title mb-0">
            <i className="fas fa-list me-2"></i>
            Backup Files
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead style={{ backgroundColor: "var(--background-light)" }}>
                <tr>
                  <th className="text-center fw-bold" style={{ width: "50px", fontSize: "0.875rem" }}>#</th>
                  <th className="text-center" style={{ width: "100px", fontSize: "0.875rem" }}>Actions</th>
                  <th className="text-center" style={{ fontSize: "0.875rem" }}>File Name</th>
                  <th className="text-center" style={{ fontSize: "0.875rem" }}>Type</th>
                  <th className="text-center" style={{ fontSize: "0.875rem" }}>Created</th>
                  <th className="text-center" style={{ fontSize: "0.875rem" }}>Size</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, index) => (
                  <BackupRowSkeleton key={index} />
                ))}
              </tbody>
            </table>
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
            <i className="fas fa-list me-2"></i>
            Backup Files ({backups.length})
          </h6>
          <div className="d-flex align-items-center gap-2">
            <small className="text-white-50">
              Total: {formatFileSize(backups.reduce((total, backup) => total + backup.size, 0))}
            </small>
            <select 
              className="form-select form-select-sm" 
              value={itemsPerPage} 
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: 'auto' }}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {backups.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-database fa-4x text-muted opacity-50 mb-4"></i>
            <h5 className="text-muted mb-3">No Backup Files</h5>
            <p className="text-muted mb-4">
              No backup files have been created yet. Create your first backup to secure your data.
            </p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead style={{ backgroundColor: "var(--background-light)" }}>
                  <tr>
                    <th className="text-center fw-bold" style={{ width: "50px", fontSize: "0.875rem" }}>#</th>
                    <th className="text-center" style={{ width: "100px", fontSize: "0.875rem" }}>Actions</th>
                    <th className="text-center" style={{ fontSize: "0.875rem" }}>File Name</th>
                    <th className="text-center" style={{ fontSize: "0.875rem" }}>Type</th>
                    <th className="text-center" style={{ fontSize: "0.875rem" }}>Created</th>
                    <th className="text-center" style={{ fontSize: "0.875rem" }}>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBackups.map((backup, index) => {
                    const { date, time } = formatPhilippineDateTime(backup.created_at);
                    
                    return (
                    <tr key={backup.name}>
                      {/* Number Column - Centered */}
                      <td className="text-center fw-bold text-muted" style={{ fontSize: "0.9rem", verticalAlign: "middle" }}>
                        {startIndex + index + 1}
                      </td>
                      
                      {/* Actions Column - Centered */}
                      <td className="text-center" style={{ verticalAlign: "middle" }}>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn btn-sm action-btn"
                            onClick={() => onDownloadBackup(backup.name)}
                            title="Download Backup"
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
                            <i className="fas fa-download"></i>
                          </button>
                          
                          <button
                            className="btn btn-sm action-btn"
                            onClick={() => onDeleteBackup(backup.name)}
                            title="Delete Backup"
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
                        </div>
                      </td>
                      
                      {/* File Name Column - Centered */}
                      <td className="text-center" style={{ verticalAlign: "middle" }}>
                        <div className="d-flex align-items-center justify-content-center">
                          <i className={`${getFileTypeIcon(backup.name)} me-2`}></i>
                          <span className="fw-semibold">{backup.name}</span>
                        </div>
                      </td>
                      
                      {/* Type Column - Centered */}
                      <td className="text-center" style={{ verticalAlign: "middle" }}>
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {backup.type.toUpperCase()}
                        </span>
                      </td>
                      
                      {/* Created Column - Centered */}
                      <td className="text-center" style={{ verticalAlign: "middle" }}>
                        <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }} title={`${date} ${time}`}>
                          <span className="d-block">{date}</span>
                          {time && <span className="d-block text-muted" style={{ fontSize: "0.8rem" }}>{time}</span>}
                        </div>
                      </td>
                      
                      {/* Size Column - Centered */}
                      <td className="text-center" style={{ verticalAlign: "middle" }}>
                        <span className="fw-semibold">
                          {formatFileSize(backup.size)}
                        </span>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer bg-white border-top-0 py-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="text-center text-md-start">
                    <small className="text-muted">
                      Showing <span className="fw-semibold">{startIndex + 1}-{Math.min(endIndex, backups.length)}</span> of <span className="fw-semibold">{backups.length}</span> backup files
                    </small>
                  </div>
                  <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                    <div className="d-flex gap-1">
                      <button 
                        className="btn btn-sm pagination-btn" 
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1} 
                        style={{ 
                          backgroundColor: "transparent", 
                          borderColor: "#018181", 
                          color: "#018181", 
                          minWidth: "80px" 
                        }}
                        onMouseOver={(e) => {
                          if (currentPage !== 1) {
                            e.target.style.backgroundColor = "#f0f9f9";
                            e.target.style.color = "#016767";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentPage !== 1) {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#018181";
                          }
                        }}
                      >
                        <i className="fas fa-chevron-left me-1 d-none d-sm-inline"></i>
                        <span className="d-none d-sm-inline">Previous</span>
                        <span className="d-sm-none">Prev</span>
                      </button>
                      <div className="d-none d-md-flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        }).map((page, index, array) => {
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && <span className="px-2 text-muted">...</span>}
                              <button 
                                className={`btn btn-sm pagination-page-btn ${currentPage === page ? "active" : ""}`} 
                                onClick={() => setCurrentPage(page)} 
                                style={currentPage === page ? 
                                  { backgroundColor: "#018181", borderColor: "#018181", minWidth: "40px", color: "white" } : 
                                  { backgroundColor: "transparent", borderColor: "#018181", color: "#018181", minWidth: "40px" }
                                }
                                onMouseOver={(e) => {
                                  if (currentPage !== page) {
                                    e.target.style.backgroundColor = "#f0f9f9";
                                    e.target.style.color = "#016767";
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (currentPage !== page) {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "#018181";
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
                          Page <span className="fw-bold">{currentPage}</span> of <span className="fw-bold">{totalPages}</span>
                        </small>
                      </div>
                      <button 
                        className="btn btn-sm pagination-btn" 
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                        disabled={currentPage === totalPages} 
                        style={{ 
                          backgroundColor: "transparent", 
                          borderColor: "#018181", 
                          color: "#018181", 
                          minWidth: "80px" 
                        }}
                        onMouseOver={(e) => {
                          if (currentPage !== totalPages) {
                            e.target.style.backgroundColor = "#f0f9f9";
                            e.target.style.color = "#016767";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentPage !== totalPages) {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#018181";
                          }
                        }}
                      >
                        <span className="d-none d-sm-inline">Next</span>
                        <span className="d-sm-none">Next</span>
                        <i className="fas fa-chevron-right ms-1 d-none d-sm-inline"></i>
                      </button>
                    </div>
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

export default BackupList;