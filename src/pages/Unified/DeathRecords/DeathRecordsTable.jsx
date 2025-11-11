// src/pages/DeathRecords/components/DeathRecordsTable.jsx
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const DeathRecordsTable = ({
  records,
  loading,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  currentPage,
  itemsPerPage,
  onPageChange
}) => {
  const { isAdmin, isStaff } = useAuth();
  const [sortField, setSortField] = useState("date_of_death");
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

  // Calculate age at death
  const calculateAgeAtDeath = (dateOfBirth, dateOfDeath) => {
    if (!dateOfBirth || !dateOfDeath) return 'N/A';
    
    const birthDate = new Date(dateOfBirth);
    const deathDate = new Date(dateOfDeath);
    
    let years = deathDate.getFullYear() - birthDate.getFullYear();
    let months = deathDate.getMonth() - birthDate.getMonth();
    let days = deathDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      // Get the last day of the previous month
      const lastDayOfMonth = new Date(deathDate.getFullYear(), deathDate.getMonth(), 0).getDate();
      days += lastDayOfMonth;
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years}y`;
    } else if (months > 0) {
      return `${months}m`;
    } else {
      return `${days}d`;
    }
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
        <div className="skeleton-line mb-1" style={{ height: "16px", width: "120px" }}></div>
        <div className="skeleton-line" style={{ height: "14px", width: "80px" }}></div>
      </td>
      <td>
        <div className="skeleton-line mb-1" style={{ height: "16px" }}></div>
        <div className="skeleton-line" style={{ height: "14px", width: "60%" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-badge" style={{ width: "60px", height: "24px", borderRadius: "12px", margin: "0 auto" }}></div>
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
            <i className="fas fa-cross me-2"></i>
            Death Records
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead style={{ backgroundColor: "var(--background-light)" }}>
                <tr>
                  <th className="text-center" style={{ width: "60px", fontSize: "0.875rem" }}>#</th>
                  <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Actions</th>
                  <th style={{ minWidth: "200px", fontSize: "0.875rem" }}>Deceased Information</th>
                  <th style={{ minWidth: "150px", fontSize: "0.875rem" }}>Death Details</th>
                  <th className="text-center" style={{ width: "90px", fontSize: "0.875rem" }}>Sex</th>
                  <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Registry No.</th>
                  <th className="text-center" style={{ minWidth: "130px", fontSize: "0.875rem" }}>Date of Death</th>
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
            <span className="text-muted">Loading death records...</span>
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
            <i className="fas fa-cross me-2"></i>
            Death Records
            <small className="opacity-75 ms-2">
              ({records?.data?.length || 0} of {records?.total || 0} records)
            </small>
          </h6>
          <div className="text-white small">
            Page {records?.current_page || 1} of {records?.last_page || 1}
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        {!records?.data?.length ? (
          <div className="text-center py-5">
            <i className="fas fa-cross fa-4x text-muted opacity-50 mb-4"></i>
            <h5 className="text-muted mb-3">No Death Records Found</h5>
            <p className="text-muted mb-4">
              {records?.total === 0 
                ? "No death records have been added yet. Click 'Add Death Record' to create the first one."
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
                        onClick={() => handleSort("first_name")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Deceased Information <i className={`ms-1 ${getSortIcon("first_name")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th style={{ minWidth: "150px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold text-start w-100" 
                        onClick={() => handleSort("place_of_death")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Death Details <i className={`ms-1 ${getSortIcon("place_of_death")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th className="text-center" style={{ width: "90px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold" 
                        onClick={() => handleSort("sex")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Sex <i className={`ms-1 ${getSortIcon("sex")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold" 
                        onClick={() => handleSort("registry_number")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Registry No. <i className={`ms-1 ${getSortIcon("registry_number")}`}></i>
                        </span>
                      </button>
                    </th>
                    <th className="text-center" style={{ minWidth: "130px", fontSize: "0.875rem" }}>
                      <button 
                        className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold" 
                        onClick={() => handleSort("date_of_death")}
                        style={{ fontSize: "0.875rem" }}
                      >
                        <span className="d-flex align-items-center justify-content-between">
                          Date of Death <i className={`ms-1 ${getSortIcon("date_of_death")}`}></i>
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.data.map((record, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    const fullName = `${record.first_name} ${record.middle_name ? record.middle_name + ' ' : ''}${record.last_name}`.trim();
                    
                    return (
                      <tr key={record.id} className="align-middle" style={{ height: "70px" }}>
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
                              onClick={() => onViewRecord(record)}
                              title="View Details"
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
                                e.target.style.backgroundColor = "#018181";
                                e.target.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#018181";
                                e.target.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            
                            {/* Edit Button - Show for both Admin and Staff */}
                            {(isAdmin || isStaff) && (
                              <button
                                className="btn btn-sm action-btn"
                                onClick={() => onEditRecord(record)}
                                title="Edit Record"
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
                                <i className="fas fa-edit"></i>
                              </button>
                            )}
                            
                            {/* Delete Button - Only for Admin */}
                            {isAdmin && (
                              <button
                                className="btn btn-sm action-btn"
                                onClick={() => onDeleteRecord(record.id, fullName)}
                                title="Delete Record"
                                style={{
                                  backgroundColor: "#6c757d",
                                  borderColor: "#6c757d",
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
                                  e.target.style.backgroundColor = "#5a6268";
                                  e.target.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "#6c757d";
                                  e.target.style.transform = "scale(1)";
                                }}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Deceased Information - FIXED HEIGHT WITH ELLIPSIS */}
                        <td style={{ minWidth: "200px", maxWidth: "200px" }}>
                          <div className="d-flex align-items-center h-100">
                            <div className="flex-shrink-0">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: record.sex === 'Male' ? '#007bff' : '#e83e8c',
                                  fontSize: "14px",
                                  fontWeight: 'bold'
                                }}
                              >
                                {record.sex === 'Male' ? 'M' : 'F'}
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3 min-w-0">
                              {/* Full Name - With ellipsis for long text */}
                              <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.9rem", lineHeight: "1.3" }} title={fullName}>
                                {record.first_name} {record.middle_name} {record.last_name}
                              </div>
                              
                              {/* Age at Death - With ellipsis for long text */}
                              <small className="text-info d-block text-truncate mt-1" style={{ fontSize: "0.8rem", lineHeight: "1.2" }}>
                                Age: {calculateAgeAtDeath(record.date_of_birth, record.date_of_death)}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Death Details - FIXED HEIGHT WITH ELLIPSIS */}
                        <td style={{ minWidth: "150px", maxWidth: "150px" }}>
                          <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.9rem", lineHeight: "1.3" }} title={record.place_of_death}>
                            {record.place_of_death}
                          </div>
                          {record.immediate_cause && (
                            <small className="text-muted d-block mt-1" style={{ fontSize: "0.8rem", lineHeight: "1.2" }}>
                              {record.immediate_cause}
                            </small>
                          )}
                        </td>

                        {/* Sex - IMPROVED CONTRAST */}
                        <td className="text-center">
                          <span
                            className={`badge ${record.sex === 'Male' ? 'bg-primary' : 'bg-pink'}`}
                            style={{ 
                              fontSize: "0.75rem",
                              backgroundColor: record.sex === 'Male' ? '#007bff' : '#e83e8c',
                              color: 'white'
                            }}
                          >
                            {record.sex}
                          </span>
                        </td>

                        {/* Registry Number */}
                        <td className="text-center">
                          <span className="badge bg-danger bg-opacity-10 text-danger text-truncate" style={{ fontSize: "0.75rem", maxWidth: "100px",  color: "#018181", backgroundColor: "rgba(1, 129, 129, 0.1)" }} title={record.registry_number}>
                            {record.registry_number}
                          </span>
                        </td>

                        {/* Date of Death - RESPONSIVE FIX */}
                        <td className="text-center" style={{ minWidth: "130px", maxWidth: "130px" }}>
                          <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.85rem", lineHeight: "1.3" }} title={formatDate(record.date_of_death)}>
                            {formatDate(record.date_of_death)}
                          </div>
                          <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem", lineHeight: "1.2" }}>
                            Born: {formatDate(record.date_of_birth)}
                          </small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {records.last_page > 1 && (
              <div className="card-footer bg-white border-top-0 py-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="text-center text-md-start">
                    <small className="text-muted">
                      Showing <span className="fw-semibold">{records.from}</span> to{" "}
                      <span className="fw-semibold">{records.to}</span> of{" "}
                      <span className="fw-semibold">{records.total}</span> entries
                    </small>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm pagination-btn"
                      onClick={() => onPageChange(records.current_page - 1)}
                      disabled={records.current_page === 1}
                      style={{
                        backgroundColor: records.current_page === 1 ? "#f8f9fa" : "white",
                        borderColor: "#018181",
                        color: records.current_page === 1 ? "#6c757d" : "#018181",
                        minWidth: "80px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (records.current_page !== 1) {
                          e.target.style.backgroundColor = "#018181";
                          e.target.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (records.current_page !== 1) {
                          e.target.style.backgroundColor = "white";
                          e.target.style.color = "#018181";
                        }
                      }}
                    >
                      <i className="fas fa-chevron-left me-1"></i>
                      Previous
                    </button>
                    
                    <div className="d-none d-md-flex gap-1">
                      {Array.from({ length: records.last_page }, (_, i) => i + 1)
                        .filter((page) => {
                          if (records.last_page <= 7) return true;
                          if (page === 1 || page === records.last_page) return true;
                          if (Math.abs(page - records.current_page) <= 1) return true;
                          return false;
                        })
                        .map((page, index, array) => {
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && <span className="px-2 text-muted">...</span>}
                              <button
                                className={`btn btn-sm pagination-page-btn ${
                                  records.current_page === page ? "active" : ""
                                }`}
                                onClick={() => onPageChange(page)}
                                style={
                                  records.current_page === page
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
                                  if (records.current_page !== page) {
                                    e.target.style.backgroundColor = "#ffe6e6";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (records.current_page !== page) {
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
                        Page <span className="fw-bold">{records.current_page}</span> of{" "}
                        <span className="fw-bold">{records.last_page}</span>
                      </small>
                    </div>
                    
                    <button
                      className="btn btn-sm pagination-btn"
                      onClick={() => onPageChange(records.current_page + 1)}
                      disabled={records.current_page === records.last_page}
                      style={{
                        backgroundColor: records.current_page === records.last_page ? "#f8f9fa" : "white",
                        borderColor: "#018181",
                        color: records.current_page === records.last_page ? "#6c757d" : "#018181",
                        minWidth: "80px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (records.current_page !== records.last_page) {
                          e.target.style.backgroundColor = "#018181";
                          e.target.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (records.current_page !== records.last_page) {
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

export default DeathRecordsTable;   