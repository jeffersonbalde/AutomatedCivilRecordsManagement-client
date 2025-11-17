// src/pages/Unified/GenerateCertificates/components/CertificateSearch.jsx
import React, { useState, useEffect } from "react";

const CertificateSearch = ({
  certificateType,
  onCertificateTypeChange,
  onSearch,
  searchResults,
  loading,
  onRecordSelect,
  selectedRecord,
  isActionDisabled,
  totalRecords,
  filteredRecordsCount,
}) => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    registry_number: "",
    date_from: "",
    date_to: "",
  });

  // Maintain separate pagination state for each certificate type
  const [paginationState, setPaginationState] = useState({
    birth: { currentPage: 1, itemsPerPage: 10 },
    marriage: { currentPage: 1, itemsPerPage: 10 },
    death: { currentPage: 1, itemsPerPage: 10 },
  });

  // Get current pagination for the active certificate type
  const currentPagination = paginationState[certificateType] || {
    currentPage: 1,
    itemsPerPage: 10,
  };
  const [currentPage, setCurrentPage] = useState(currentPagination.currentPage);
  const [itemsPerPage, setItemsPerPage] = useState(
    currentPagination.itemsPerPage
  );

  // Update local state when certificate type changes
  useEffect(() => {
    const newPagination = paginationState[certificateType] || {
      currentPage: 1,
      itemsPerPage: 10,
    };
    setCurrentPage(newPagination.currentPage);
    setItemsPerPage(newPagination.itemsPerPage);
  }, [certificateType, paginationState]);

  const updatePaginationState = (type, updates) => {
    setPaginationState((prev) => ({
      ...prev,
      [type]: {
        ...(prev[type] || { currentPage: 1, itemsPerPage: 10 }),
        ...updates,
      },
    }));
  };

  // Auto-search when criteria changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchCriteria);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchCriteria, onSearch]);

  const handleInputChange = (field, value) => {
    setSearchCriteria((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Only reset to page 1 for the current type
    const newPage = 1;
    setCurrentPage(newPage);
    updatePaginationState(certificateType, { currentPage: newPage });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updatePaginationState(certificateType, { currentPage: newPage });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    updatePaginationState(certificateType, {
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    });
  };

  const clearSearch = () => {
    if (isActionDisabled()) return;
    setSearchCriteria({
      name: "",
      registry_number: "",
      date_from: "",
      date_to: "",
    });
    const newPage = 1;
    setCurrentPage(newPage);
    updatePaginationState(certificateType, { currentPage: newPage });
  };

  const getPlaceholder = () => {
    switch (certificateType) {
      case "birth":
        return "Search by child or parent names...";
      case "marriage":
        return "Search by spouse names...";
      case "death":
        return "Search by deceased name...";
      default:
        return "Search records...";
    }
  };

  const getDateFieldLabel = () => {
    switch (certificateType) {
      case "birth":
        return "Date of Birth";
      case "marriage":
        return "Date of Marriage";
      case "death":
        return "Date of Death";
      default:
        return "Date";
    }
  };

  // Fix for undefined values in search results
  const formatRecordDisplay = (record) => {
    switch (certificateType) {
      case "birth":
        const childFirstName = record.child_first_name || "";
        const childLastName = record.child_last_name || "";
        const childName = `${childFirstName} ${childLastName}`.trim();
        return childName || `Birth Record - ${record.registry_number || "N/A"}`;
      case "marriage":
        const husbandName =
          record.husband_first_name || record.husband_name || "Husband";
        const wifeName = record.wife_first_name || record.wife_name || "Wife";
        return `${husbandName} & ${wifeName} - ${
          record.registry_number || "N/A"
        }`;
      case "death":
        // Fix: Use first_name, middle_name, last_name instead of deceased_name
        const deceasedFirstName = record.first_name || "";
        const deceasedMiddleName = record.middle_name || "";
        const deceasedLastName = record.last_name || "";
        const deceasedName =
          `${deceasedFirstName} ${deceasedMiddleName} ${deceasedLastName}`.trim();
        return (
          deceasedName || `Death Record - ${record.registry_number || "N/A"}`
        );
      default:
        return `Record - ${record.registry_number || "N/A"}`;
    }
  };

  const getRecordDate = (record) => {
    switch (certificateType) {
      case "birth":
        return record.date_of_birth;
      case "marriage":
        return record.date_of_marriage;
      case "death":
        return record.date_of_death;
      default:
        return null;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = searchResults.slice(startIndex, endIndex);

  // DON'T reset pagination when search results change - this was the problem
  // Only reset when search criteria actually change (handled in handleInputChange)

  // Skeleton Loader for Search Results
  const SearchResultSkeleton = () => (
    <div className="list-group">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <div
                className="skeleton-line mb-2"
                style={{ height: "16px", width: "80%" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ height: "14px", width: "60%" }}
              ></div>
            </div>
            <div
              className="skeleton-badge"
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="card shadow border-0 mb-4">
      <div
        className="card-header py-3 text-white"
        style={{ backgroundColor: "#018181" }}
      >
        <h6 className="card-title mb-0">
          <i className="fas fa-search me-2"></i>
          Search Records - {certificateType.toUpperCase()}
        </h6>
      </div>
      <div className="card-body">
        {/* Certificate Type Selection */}
        <div className="row mb-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Certificate Type</label>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                name="certificateType"
                id="birthType"
                checked={certificateType === "birth"}
                onChange={() => onCertificateTypeChange("birth")}
                disabled={isActionDisabled()}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="birthType"
                style={{
                  borderColor: "#018181",
                  color: certificateType === "birth" ? "white" : "#018181",
                  backgroundColor:
                    certificateType === "birth" ? "#018181" : "transparent",
                }}
              >
                <i className="fas fa-baby me-2"></i>Birth
              </label>

              <input
                type="radio"
                className="btn-check"
                name="certificateType"
                id="marriageType"
                checked={certificateType === "marriage"}
                onChange={() => onCertificateTypeChange("marriage")}
                disabled={isActionDisabled()}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="marriageType"
                style={{
                  borderColor: "#018181",
                  color: certificateType === "marriage" ? "white" : "#018181",
                  backgroundColor:
                    certificateType === "marriage" ? "#018181" : "transparent",
                }}
              >
                <i className="fas fa-heart me-2"></i>Marriage
              </label>

              <input
                type="radio"
                className="btn-check"
                name="certificateType"
                id="deathType"
                checked={certificateType === "death"}
                onChange={() => onCertificateTypeChange("death")}
                disabled={isActionDisabled()}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="deathType"
                style={{
                  borderColor: "#018181",
                  color: certificateType === "death" ? "white" : "#018181",
                  backgroundColor:
                    certificateType === "death" ? "#018181" : "transparent",
                }}
              >
                <i className="fas fa-cross me-2"></i>Death
              </label>
            </div>
          </div>
        </div>

        {/* Search Form - No Search Button Needed */}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small fw-semibold">Search Term</label>
            <input
              type="text"
              className="form-control"
              placeholder={getPlaceholder()}
              value={searchCriteria.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isActionDisabled()}
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold">
              Registry Number
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter registry number..."
              value={searchCriteria.registry_number}
              onChange={(e) =>
                handleInputChange("registry_number", e.target.value)
              }
              disabled={isActionDisabled()}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              {getDateFieldLabel()} From
            </label>
            <input
              type="date"
              className="form-control"
              value={searchCriteria.date_from}
              onChange={(e) => handleInputChange("date_from", e.target.value)}
              disabled={isActionDisabled()}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              {getDateFieldLabel()} To
            </label>
            <input
              type="date"
              className="form-control"
              value={searchCriteria.date_to}
              onChange={(e) => handleInputChange("date_to", e.target.value)}
              disabled={isActionDisabled()}
            />
          </div>

          <div className="col-12">
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={clearSearch}
                disabled={isActionDisabled()}
              >
                <i className="fas fa-times me-2"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            Showing <strong>{filteredRecordsCount}</strong> of{" "}
            <strong>{totalRecords}</strong> records
            {searchCriteria.name ||
            searchCriteria.registry_number ||
            searchCriteria.date_from ||
            searchCriteria.date_to
              ? " (filtered)"
              : ""}
            {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
          </small>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="mt-4">
            <h6 className="fw-semibold mb-3">Loading Records...</h6>
            <SearchResultSkeleton />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0">
                Records ({searchResults.length} found)
              </h6>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Show:</small>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            {/* Records List with Striped Styling */}
            <div className="list-group">
              {currentRecords.map((record, index) => (
                <button
                  key={record.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    index % 2 === 0 ? "" : "list-group-item-light"
                  }`}
                  onClick={() => onRecordSelect(record)}
                  disabled={isActionDisabled()}
                  style={{
                    borderLeft:
                      selectedRecord?.id === record.id
                        ? "4px solid #018181"
                        : "4px solid transparent",
                    backgroundColor:
                      selectedRecord?.id === record.id ? "#e6f7f7" : "inherit",
                    borderColor:
                      selectedRecord?.id === record.id ? "#018181" : "#dee2e6",
                    borderWidth:
                      selectedRecord?.id === record.id
                        ? "1px 1px 1px 4px"
                        : "1px",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1 text-start">
                      <div className="fw-semibold text-dark">
                        {formatRecordDisplay(record)}
                      </div>
                      <small className="text-muted">
                        {getRecordDate(record) &&
                          `${
                            certificateType === "birth"
                              ? "Born"
                              : certificateType === "marriage"
                              ? "Married"
                              : "Died"
                          }: ${new Date(
                            getRecordDate(record)
                          ).toLocaleDateString()}`}
                        {!getRecordDate(record) && "Date not available"}
                      </small>
                    </div>
                    {selectedRecord?.id === record.id && (
                      <i
                        className="fas fa-check"
                        style={{ color: "#018181" }}
                      ></i>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {/* Pagination - Clean and Responsive */}
{totalPages > 1 && (
  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
    {/* Page Info */}
    <small className="text-muted text-center text-md-start">
      Page {currentPage} of {totalPages} • {searchResults.length} items
    </small>
    
    {/* Pagination Controls */}
    <div className="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-center">
      {/* Mobile: Compact Pagination */}
      <div className="d-flex gap-2 d-md-none w-100 justify-content-between align-items-center">
        <button
          className="btn btn-sm pagination-btn"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || isActionDisabled()}
          style={{
            backgroundColor: "transparent",
            borderColor: "#018181",
            color: "#018181",
            width: "80px"
          }}
        >
          <i className="fas fa-chevron-left me-1"></i>
          Prev
        </button>
        
        {/* Current Page Indicator */}
        <div className="text-center">
          <small className="text-muted fw-semibold">
            {currentPage} / {totalPages}
          </small>
        </div>
        
        <button
          className="btn btn-sm pagination-btn"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || isActionDisabled()}
          style={{
            backgroundColor: "transparent",
            borderColor: "#018181",
            color: "#018181",
            width: "80px"
          }}
        >
          Next
          <i className="fas fa-chevron-right ms-1"></i>
        </button>
      </div>

      {/* Desktop: Full Pagination */}
      <div className="d-none d-md-flex gap-2 align-items-center">
        <button
          className="btn btn-sm pagination-btn"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || isActionDisabled()}
          style={{
            backgroundColor: "transparent",
            borderColor: "#018181",
            color: "#018181",
            width: "100px"
          }}
        >
          <i className="fas fa-chevron-left me-1"></i>
          Previous
        </button>
        
        {/* Page Numbers */}
        <div className="d-flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                className={`btn btn-sm pagination-page-btn ${currentPage === pageNum ? "active" : ""}`}
                onClick={() => handlePageChange(pageNum)}
                disabled={isActionDisabled()}
                style={
                  currentPage === pageNum
                    ? { 
                        backgroundColor: "#018181", 
                        borderColor: "#018181", 
                        width: "40px", 
                        color: "white" 
                      }
                    : { 
                        backgroundColor: "transparent", 
                        borderColor: "#018181", 
                        width: "40px", 
                        color: "#018181" 
                      }
                }
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          className="btn btn-sm pagination-btn"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || isActionDisabled()}
          style={{
            backgroundColor: "transparent",
            borderColor: "#018181",
            color: "#018181",
            width: "100px"
          }}
        >
          Next
          <i className="fas fa-chevron-right ms-1"></i>
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-4">
              <i className="fas fa-search fa-2x text-muted opacity-50 mb-3"></i>
              <h6 className="text-muted">No records found</h6>
              <p className="text-muted small">
                {totalRecords === 0
                  ? `No ${certificateType} records available`
                  : "Try adjusting your search criteria"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CertificateSearch;
