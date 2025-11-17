// src/pages/Unified/DocumentScanning/DocumentScanning.jsx - UPDATED VERSION
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert, showToast } from "../../../services/notificationService";
import DocumentRecordsTable from "./DocumentRecordsTable";
import UploadDocumentModal from "./UploadDocumentModal";
import ViewDocumentModal from "./ViewDocumentModal";
import DocumentInfoModal from "./DocumentInfoModal";

const DocumentScanning = () => {
  const { token } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchRecordType, setSearchRecordType] = useState("all");

  // Fetch all records on component mount
  useEffect(() => {
    fetchAllRecords();
    fetchStatistics();
  }, []);

  // Apply client-side filtering whenever search term, dates, or allRecords change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFrom, dateTo, searchRecordType, allRecords]);

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      console.log("Fetching all document records...");

      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/document-scanning/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);

        // Debug: Check the first record's structure
        if (data.data && data.data.length > 0) {
          console.log("First record structure:", data.data[0]);
          console.log("File size in first record:", data.data[0].file_size);
          console.log("Type of file_size:", typeof data.data[0].file_size);
        }

        setAllRecords(data.data || []);
      } else {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(
          `Failed to fetch document records: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error fetching document records:", error);
      showAlert.error(
        "Error",
        `Failed to load document records: ${error.message}`
      );
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      // Calculate statistics from local data
      calculateStatisticsFromLocalData();
    } catch (error) {
      console.error("Error fetching statistics:", error);
      calculateStatisticsFromLocalData();
    } finally {
      setStatisticsLoading(false);
    }
  };

  const calculateStatisticsFromLocalData = () => {
    const totalRecords = allRecords.length;
    const birthCount = allRecords.filter(
      (record) => record.record_type === "birth"
    ).length;
    const marriageCount = allRecords.filter(
      (record) => record.record_type === "marriage"
    ).length;
    const deathCount = allRecords.filter(
      (record) => record.record_type === "death"
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = allRecords.filter((record) => {
      const recordDate = new Date(record.uploaded_at);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    }).length;

    setStatistics({
      total_records: totalRecords,
      birth_count: birthCount,
      marriage_count: marriageCount,
      death_count: deathCount,
      this_month: thisMonth,
    });
  };

  // Recalculate statistics when allRecords changes
  useEffect(() => {
    if (allRecords.length > 0 && !statisticsLoading) {
      calculateStatisticsFromLocalData();
    }
  }, [allRecords]);

  // Client-side filtering function
  const applyFilters = () => {
    let filtered = [...allRecords];

    // Record type filter
    if (searchRecordType !== "all") {
      filtered = filtered.filter(
        (record) => record.record_type === searchRecordType
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const loweredSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((record) => {
        const searchableFields = [
          record.original_filename,
          record.record_type,
          record.uploaded_by,
        ].filter(Boolean);

        return searchableFields.some((field) =>
          field.toLowerCase().includes(loweredSearch)
        );
      });
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.uploaded_at);
        const fromDate = new Date(dateFrom);
        return recordDate >= fromDate;
      });
    }

    if (dateTo) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.uploaded_at);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        return recordDate <= toDate;
      });
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  // Calculate paginated records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    return {
      data: paginatedRecords,
      current_page: currentPage,
      last_page: Math.ceil(filteredRecords.length / itemsPerPage),
      per_page: itemsPerPage,
      from: (currentPage - 1) * itemsPerPage + 1,
      to: Math.min(currentPage * itemsPerPage, filteredRecords.length),
      total: filteredRecords.length,
    };
  }, [paginatedRecords, currentPage, itemsPerPage, filteredRecords.length]);

  // Modal handlers
  const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleViewInfo = (document) => {
    setSelectedDocument(document);
    setShowInfoModal(true);
  };

  const handleDocumentUploaded = (newDocument) => {
    console.log("Document uploaded successfully");
    setShowUploadModal(false);
    setAllRecords((prev) => [newDocument, ...prev]);
    fetchStatistics();
  };

  const handleDeleteRecord = async (
    documentId,
    documentName = "this document"
  ) => {
    const confirmation = await showAlert.confirm(
      "Delete Document",
      `Are you sure you want to delete ${documentName}? This action cannot be undone.`,
      "Yes, Delete",
      "Cancel",
      "warning"
    );

    if (!confirmation.isConfirmed) return;

    // Show processing alert with loading state
    showAlert.processing(
      "Deleting Document",
      "Please wait while we delete the document..."
    );

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_LARAVEL_API
        }/document-scanning/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Close the processing alert
        showAlert.close();

        showToast.success("Document deleted successfully!");

        // Update state
        setAllRecords((prev) =>
          prev.filter((record) => record.id !== documentId)
        );
        fetchStatistics();
      } else {
        // Close the processing alert
        showAlert.close();

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server returned ${response.status}`
        );
      }
    } catch (error) {
      // Close the processing alert
      showAlert.close();

      console.error("Error deleting document:", error);
      showAlert.error(
        "Delete Error",
        error.message || "Failed to delete document. Please try again."
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setSearchRecordType("all");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Skeleton Loader for Statistics Cards
  const StatisticsCardSkeleton = () => (
    <div className="col-6 col-md-3">
      <div className="card stats-card h-100 border-0 shadow-sm">
        <div className="card-body p-3">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <div
                className="skeleton-line mb-2"
                style={{ width: "80%", height: "14px" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ width: "60%", height: "24px" }}
              ></div>
            </div>
            <div className="col-auto">
              <div
                className="skeleton-icon"
                style={{ width: "24px", height: "24px", borderRadius: "4px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-1 fadeIn">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">Logbook Documents</h1>
          <p className="text-muted mb-0">
            Manage and view all uploaded logbook documents
            {filteredRecords.length !== allRecords.length && (
              <span className="text-info ms-2">
                (Showing {filteredRecords.length} of {allRecords.length}{" "}
                records)
              </span>
            )}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div
            className="badge px-3 py-2 text-white"
            style={{ backgroundColor: "#018181" }}
          >
            <i className="fas fa-file me-2"></i>
            Total Documents: {loading ? "..." : allRecords.length}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleUploadDocument}
            style={{
              backgroundColor: "#018181",
              borderColor: "#018181",
            }}
          >
            <i className="fas fa-upload me-2"></i>Upload Document
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              fetchAllRecords();
              fetchStatistics();
            }}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4 g-3">
        {statisticsLoading ? (
          <>
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
          </>
        ) : statistics ? (
          <>
            <div className="col-6 col-md-3">
              <div className="card stats-card h-100 border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div
                        className="text-xs fw-semibold text-uppercase mb-1"
                        style={{ color: "#018181" }}
                      >
                        Total Documents
                      </div>
                      <div
                        className="h4 mb-0 fw-bold"
                        style={{ color: "#018181" }}
                      >
                        {statistics.total_records || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i
                        className="fas fa-file fa-lg"
                        style={{ color: "#018181", opacity: "0.7" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card stats-card h-100 border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-xs fw-semibold text-uppercase mb-1 text-success">
                        Birth Records
                      </div>
                      <div className="h4 mb-0 fw-bold text-success">
                        {statistics.birth_count || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-baby fa-lg text-success opacity-70"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card stats-card h-100 border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-xs fw-semibold text-uppercase mb-1 text-info">
                        Marriage Records
                      </div>
                      <div className="h4 mb-0 fw-bold text-info">
                        {statistics.marriage_count || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-ring fa-lg text-info opacity-70"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card stats-card h-100 border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <div className="text-xs fw-semibold text-uppercase mb-1 text-warning">
                        This Month
                      </div>
                      <div className="h4 mb-0 fw-bold text-warning">
                        {statistics.this_month || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar-alt fa-lg text-warning opacity-70"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
          </>
        )}
      </div>

      {/* Search and Filter Card */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 g-md-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold mb-1">
                Search Documents
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by filename, type..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">
                Record Type
              </label>
              <select
                className="form-select form-select-sm"
                value={searchRecordType}
                onChange={(e) => setSearchRecordType(e.target.value)}
              >
                <option value="all">All Records</option>
                <option value="birth">Birth Records</option>
                <option value="marriage">Marriage Records</option>
                <option value="death">Death Records</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">
                Date From
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">
                Date To
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Items</label>
              <select
                className="form-select form-select-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>
          {(searchTerm || dateFrom || dateTo || searchRecordType !== "all") && (
            <div className="row mt-3">
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearFilters}
                  >
                    <i className="fas fa-times me-1"></i>Clear Filters
                  </button>
                  <small className="text-muted">
                    Found {filteredRecords.length} documents matching your
                    criteria
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <DocumentRecordsTable
        records={paginationInfo}
        loading={loading}
        onViewRecord={handleViewDocument}
        onViewInfo={handleViewInfo}
        onDeleteRecord={handleDeleteRecord}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onSave={handleDocumentUploaded}
          token={token}
        />
      )}

      {showViewModal && selectedDocument && (
        <ViewDocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {showInfoModal && selectedDocument && (
        <DocumentInfoModal
          document={selectedDocument}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedDocument(null);
          }}
          onViewDocument={() => {
            setShowInfoModal(false);
            setShowViewModal(true);
          }}
        />
      )}
    </div>
  );
};

export default DocumentScanning;
