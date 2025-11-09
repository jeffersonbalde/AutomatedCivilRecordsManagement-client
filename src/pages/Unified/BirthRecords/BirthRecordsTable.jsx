// src/pages/BirthRecords/components/BirthRecordsTable.jsx - UPDATED
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";

const BirthRecordsTable = ({
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate age in days
  const calculateAgeInDays = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Skeleton loader for table rows
  const TableRowSkeleton = () => (
    <tr className="align-middle">
      <td className="text-center">
        <div className="skeleton-box" style={{ width: "100px", height: "20px", margin: "0 auto" }}></div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="skeleton-avatar me-3" style={{ width: "40px", height: "40px", borderRadius: "50%" }}></div>
          <div className="flex-grow-1">
            <div className="skeleton-line mb-1" style={{ height: "16px", width: "120px" }}></div>
            <div className="skeleton-line" style={{ height: "14px", width: "80px" }}></div>
          </div>
        </div>
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
        <div className="d-flex justify-content-center gap-1">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton-box" style={{ width: "32px", height: "32px", borderRadius: "4px" }}></div>
          ))}
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="card shadow border-0">
        <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
          <h6 className="card-title mb-0">
            <i className="fas fa-baby me-2"></i>
            Birth Records
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead style={{ backgroundColor: "var(--background-light)" }}>
                <tr>
                  <th className="text-center" style={{ width: "120px" }}>Registry No.</th>
                  <th style={{ minWidth: "200px" }}>Child Information</th>
                  <th style={{ minWidth: "150px" }}>Birth Details</th>
                  <th className="text-center" style={{ width: "100px" }}>Sex</th>
                  <th className="text-center" style={{ width: "120px" }}>Date of Birth</th>
                  <th className="text-center" style={{ width: "140px" }}>Actions</th>
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
            <span className="text-muted">Loading birth records...</span>
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
            <i className="fas fa-baby me-2"></i>
            Birth Records
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
            <i className="fas fa-baby fa-4x text-muted opacity-50 mb-4"></i>
            <h5 className="text-muted mb-3">No Birth Records Found</h5>
            <p className="text-muted mb-4">
              {records?.total === 0 
                ? "No birth records have been added yet. Click 'Add Birth Record' to create the first one."
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
                    <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Registry No.</th>
                    <th style={{ minWidth: "200px", fontSize: "0.875rem" }}>Child Information</th>
                    <th style={{ minWidth: "150px", fontSize: "0.875rem" }}>Birth Details</th>
                    <th className="text-center" style={{ width: "100px", fontSize: "0.875rem" }}>Sex</th>
                    <th className="text-center" style={{ width: "120px", fontSize: "0.875rem" }}>Date of Birth</th>
                    <th className="text-center" style={{ width: "140px", fontSize: "0.875rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.data.map((record, index) => (
                    <tr key={record.id} className="align-middle">
                      <td className="text-center">
                        <span className="badge bg-primary bg-opacity-10 text-primary fs-6">
                          {record.registry_number}
                        </span>
                      </td>
                      <td style={{ minWidth: "200px" }}>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white"
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: record.sex === 'Male' ? '#018181' : '#e83e8c',
                                fontSize: "14px",
                                fontWeight: 'bold'
                              }}
                            >
                              {record.sex === 'Male' ? 'M' : 'F'}
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <div className="fw-semibold text-dark text-truncate" title={record.full_name}>
                              {record.child_first_name} {record.child_last_name}
                            </div>
                            {record.child_middle_name && (
                              <small className="text-muted d-block text-truncate" title={record.child_middle_name}>
                                {record.child_middle_name}
                              </small>
                            )}
                            <small className="text-info d-block text-truncate" title={record.place_of_birth}>
                              {record.place_of_birth}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td style={{ minWidth: "150px" }}>
                        <div className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
                          {record.type_of_birth}
                        </div>
                        {record.birth_weight && (
                          <small className="text-muted d-block" style={{ fontSize: "0.8rem" }}>
                            {record.birth_weight} kg
                          </small>
                        )}
                        {record.time_of_birth && (
                          <small className="text-muted d-block" style={{ fontSize: "0.8rem" }}>
                            {formatTime(record.time_of_birth)}
                          </small>
                        )}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${record.sex === 'Male' ? 'bg-info' : 'bg-pink'}`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          {record.sex}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                          {formatDate(record.date_of_birth)}
                        </div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                          {calculateAgeInDays(record.date_of_birth)} days old
                        </small>
                      </td>
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
                              padding: "0"
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
                                padding: "0"
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          
                          {/* Delete Button - Only for Admin */}
                          {isAdmin && (
                            <button
                              className="btn btn-sm action-btn"
                              onClick={() => onDeleteRecord(record.id)}
                              title="Delete Record"
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
                                padding: "0"
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
                        backgroundColor: "transparent",
                        borderColor: "#018181",
                        color: "#018181",
                        minWidth: "80px"
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
                                        backgroundColor: "transparent",
                                        borderColor: "#018181",
                                        color: "#018181",
                                        minWidth: "40px"
                                      }
                                }
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
                        backgroundColor: "transparent",
                        borderColor: "#018181",
                        color: "#018181",
                        minWidth: "80px"
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

export default BirthRecordsTable;