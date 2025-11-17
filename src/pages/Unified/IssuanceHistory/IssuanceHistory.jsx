// src/pages/Unified/GenerateCertificates/IssuanceHistory.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showToast } from "../../../services/notificationService";

const IssuanceHistory = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [issuanceHistory, setIssuanceHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filters, setFilters] = useState({
    certificate_type: "",
    date_from: "",
    date_to: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch issuance history
  const fetchIssuanceHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/certificate-issuance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // FIX: Handle different API response structures
        let history = [];

        if (Array.isArray(data)) {
          // If response is directly an array
          history = data;
        } else if (data.data && Array.isArray(data.data)) {
          // If response has data property that's an array
          history = data.data;
        } else if (data.issuances && Array.isArray(data.issuances)) {
          // If response has issuances property
          history = data.issuances;
        } else {
          // Fallback - try to find any array in the response
          const arrayKeys = Object.keys(data).filter((key) =>
            Array.isArray(data[key])
          );
          if (arrayKeys.length > 0) {
            history = data[arrayKeys[0]];
          } else {
            console.warn("Unexpected API response structure:", data);
            history = [];
          }
        }

        // Ensure history is always an array
        history = Array.isArray(history) ? history : [];

        setIssuanceHistory(history);
        setFilteredHistory(history);

        if (history.length === 0) {
          showToast.info("No issuance records found");
        } else {
          showToast.success(`Loaded ${history.length} issuance records`);
        }
      } else {
        throw new Error("Failed to fetch issuance history");
      }
    } catch (error) {
      console.error("Error fetching issuance history:", error);
      showToast.error("Failed to load issuance history");
      setIssuanceHistory([]);
      setFilteredHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchIssuanceHistory();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...issuanceHistory];

    // Filter by certificate type
    if (filters.certificate_type) {
      filtered = filtered.filter(
        (item) => item.certificate_type === filters.certificate_type
      );
    }

    // Filter by date range
    if (filters.date_from) {
      filtered = filtered.filter(
        (item) => new Date(item.date_paid) >= new Date(filters.date_from)
      );
    }

    if (filters.date_to) {
      filtered = filtered.filter(
        (item) => new Date(item.date_paid) <= new Date(filters.date_to)
      );
    }

    // Filter by search term
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.issued_to?.toLowerCase().includes(searchTerm) ||
          item.certificate_number?.toLowerCase().includes(searchTerm) ||
          item.or_number?.toLowerCase().includes(searchTerm)
      );
    }

    // FIX: Ensure filtered is always an array before setting state
    setFilteredHistory(Array.isArray(filtered) ? filtered : []);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, issuanceHistory]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      certificate_type: "",
      date_from: "",
      date_to: "",
      search: "",
    });
  };

  // Pagination - FIX: Add safety check
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // FIX: Ensure filteredHistory is array before slicing
  const currentRecords = Array.isArray(filteredHistory)
    ? filteredHistory.slice(startIndex, endIndex)
    : [];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Get certificate type badge color
  const getCertificateTypeBadge = (type) => {
    const colors = {
      birth: "success",
      marriage: "primary",
      death: "secondary",
    };
    return colors[type] || "secondary";
  };

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="list-group">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <div
                className="skeleton-line mb-2"
                style={{ height: "16px", width: "60%" }}
              ></div>
              <div
                className="skeleton-line mb-1"
                style={{ height: "14px", width: "40%" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ height: "14px", width: "30%" }}
              ></div>
            </div>
            <div
              className="skeleton-badge"
              style={{ width: "60px", height: "24px", borderRadius: "12px" }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Debug: Log the API response structure
  useEffect(() => {
    if (issuanceHistory.length > 0) {
      console.log("Issuance History Data Structure:", issuanceHistory[0]);
    }
  }, [issuanceHistory]);

  return (
    <div className="container-fluid px-1 fadeIn">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">Certificate Issuance History</h1>
          <p className="text-muted mb-0">
            View and manage all certificate issuance records
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchIssuanceHistory}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow border-0 mb-4">
            <div
              className="card-header py-3 text-white"
              style={{ backgroundColor: "#018181" }}
            >
              <h6 className="card-title mb-0">
                <i className="fas fa-history me-2"></i>
                Issuance Records
              </h6>
            </div>
            <div className="card-body">
              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                  <label className="form-label small fw-semibold">
                    Certificate Type
                  </label>
                  <select
                    className="form-control"
                    value={filters.certificate_type}
                    onChange={(e) =>
                      handleFilterChange("certificate_type", e.target.value)
                    }
                  >
                    <option value="">All Types</option>
                    <option value="birth">Birth Certificate</option>
                    <option value="marriage">Marriage Certificate</option>
                    <option value="death">Death Certificate</option>
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label small fw-semibold">
                    Date From
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date_from}
                    onChange={(e) =>
                      handleFilterChange("date_from", e.target.value)
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label small fw-semibold">
                    Date To
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date_to}
                    onChange={(e) =>
                      handleFilterChange("date_to", e.target.value)
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label small fw-semibold">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, certificate #, OR #..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>

                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearFilters}
                    >
                      <i className="fas fa-times me-2"></i>Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-3 p-2 bg-light rounded">
                <small className="text-muted">
                  Showing <strong>{filteredHistory.length}</strong> of{" "}
                  <strong>{issuanceHistory.length}</strong> records
                  {filters.certificate_type ||
                  filters.date_from ||
                  filters.date_to ||
                  filters.search
                    ? " (filtered)"
                    : ""}
                </small>
              </div>

              {/* Issuance History List */}
              {loading ? (
                <div className="mt-4">
                  <h6 className="fw-semibold mb-3">
                    Loading Issuance History...
                  </h6>
                  <SkeletonLoader />
                </div>
              ) : currentRecords.length > 0 ? (
                <>
                  <div className="list-group">
                    {currentRecords.map((issuance, index) => (
                      <div
                        key={issuance.id || index}
                        className={`list-group-item list-group-item-action ${
                          index % 2 === 0 ? "" : "list-group-item-light"
                        }`}
                        style={{
                          borderLeft: "4px solid #018181",
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <h6 className="fw-semibold text-dark mb-0 me-3">
                                {issuance.issued_to || "Unknown Recipient"}
                              </h6>
                              <span
                                className={`badge bg-${getCertificateTypeBadge(
                                  issuance.certificate_type
                                )}`}
                              >
                                {issuance.certificate_type
                                  ? issuance.certificate_type.toUpperCase()
                                  : "UNKNOWN"}
                              </span>
                            </div>

                            <div className="row text-muted small">
                              <div className="col-12 col-md-4">
                                <i className="fas fa-certificate me-1"></i>
                                <strong>Certificate:</strong>{" "}
                                {issuance.certificate_number || "N/A"}
                              </div>
                              <div className="col-12 col-md-4">
                                <i className="fas fa-receipt me-1"></i>
                                <strong>OR #:</strong>{" "}
                                {issuance.or_number || "N/A"}
                              </div>
                              <div className="col-12 col-md-4">
                                <i className="fas fa-calendar me-1"></i>
                                <strong>Date Paid:</strong>{" "}
                                {formatDate(issuance.date_paid)}
                              </div>
                            </div>

                            {issuance.purpose && (
                              <div className="mt-2">
                                <small className="text-muted">
                                  <strong>Purpose:</strong> {issuance.purpose}
                                </small>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 mt-md-0 text-end">
                            <div className="fw-bold text-success">
                              {formatCurrency(issuance.amount_paid)}
                            </div>
                            <small className="text-muted">
                              {formatDate(issuance.created_at)}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination - Fully Responsive */}
                  {totalPages > 1 && (
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
                      {/* Page Info - Hidden on mobile, shown on desktop */}
                      <small className="text-muted text-center text-md-start d-none d-md-block">
                        Page {currentPage} of {totalPages} •{" "}
                        {filteredHistory.length} records
                      </small>

                      {/* Mobile: Compact Pagination */}
                      <div className="d-flex d-md-none w-100 justify-content-between align-items-center">
                        <button
                          className="btn btn-sm pagination-btn"
                          onClick={() =>
                            handlePageChange(Math.max(currentPage - 1, 1))
                          }
                          disabled={currentPage === 1}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#018181",
                            color: "#018181",
                            width: "100px",
                            fontSize: "0.875rem",
                          }}
                        >
                          <i className="fas fa-chevron-left me-1"></i>
                          Previous
                        </button>

                        {/* Current Page Indicator */}
                        <div className="text-center mx-2">
                          <small className="text-muted fw-semibold">
                            Page {currentPage} of {totalPages}
                          </small>
                        </div>

                        <button
                          className="btn btn-sm pagination-btn"
                          onClick={() =>
                            handlePageChange(
                              Math.min(currentPage + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#018181",
                            color: "#018181",
                            width: "100px",
                            fontSize: "0.875rem",
                          }}
                        >
                          Next
                          <i className="fas fa-chevron-right ms-1"></i>
                        </button>
                      </div>

                      {/* Desktop: Full Pagination with Page Numbers */}
                      <div className="d-none d-md-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm pagination-btn"
                          onClick={() =>
                            handlePageChange(Math.max(currentPage - 1, 1))
                          }
                          disabled={currentPage === 1}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#018181",
                            color: "#018181",
                            width: "100px",
                          }}
                        >
                          <i className="fas fa-chevron-left me-1"></i>
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="d-flex gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  className={`btn btn-sm pagination-page-btn ${
                                    currentPage === pageNum ? "active" : ""
                                  }`}
                                  onClick={() => handlePageChange(pageNum)}
                                  style={
                                    currentPage === pageNum
                                      ? {
                                          backgroundColor: "#018181",
                                          borderColor: "#018181",
                                          width: "40px",
                                          height: "38px",
                                          color: "white",
                                          fontWeight: "600",
                                        }
                                      : {
                                          backgroundColor: "transparent",
                                          borderColor: "#018181",
                                          width: "40px",
                                          height: "38px",
                                          color: "#018181",
                                          fontWeight: "500",
                                        }
                                  }
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          className="btn btn-sm pagination-btn"
                          onClick={() =>
                            handlePageChange(
                              Math.min(currentPage + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#018181",
                            color: "#018181",
                            width: "100px",
                          }}
                        >
                          Next
                          <i className="fas fa-chevron-right ms-1"></i>
                        </button>
                      </div>

                      {/* Mobile Page Info - Shown only on mobile */}
                      <small className="text-muted text-center d-md-none w-100 mt-2">
                        {filteredHistory.length} total records
                      </small>
                    </div>
                  )}
                </>
              ) : (
                !loading && (
                  <div className="text-center py-5">
                    <i className="fas fa-history fa-3x text-muted opacity-50 mb-3"></i>
                    <h6 className="text-muted">No issuance records found</h6>
                    <p className="text-muted small">
                      {issuanceHistory.length === 0
                        ? "No certificates have been issued yet"
                        : "Try adjusting your search criteria"}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuanceHistory;
