// src/pages/DeathRecords/DeathRecords.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert, showToast } from "../../../services/notificationService";
import DeathRecordsTable from "./DeathRecordsTable";
import AddDeathRecordModal from "./AddDeathRecordModal";
import EditDeathRecordModal from "./EditDeathRecordModal";
import ViewDeathRecordModal from "./ViewDeathRecordModal";

const DeathRecords = () => {
  const { token } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all records once on component mount
  useEffect(() => {
    fetchAllRecords();
    fetchStatistics();
  }, []);

  // Apply client-side filtering whenever search term, dates, or allRecords change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFrom, dateTo, allRecords]);

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/death-records?per_page=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllRecords(data.data || []);
      } else {
        throw new Error("Failed to fetch death records");
      }
    } catch (error) {
      console.error("Error fetching death records:", error);
      showAlert.error("Error", "Failed to load death records");
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/death-records/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data || data);
      } else {
        calculateStatisticsFromLocalData();
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      calculateStatisticsFromLocalData();
    } finally {
      setStatisticsLoading(false);
    }
  };

  const calculateStatisticsFromLocalData = () => {
    const totalRecords = allRecords.length;
    const maleCount = allRecords.filter(record => record.sex === 'Male').length;
    const femaleCount = allRecords.filter(record => record.sex === 'Female').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = allRecords.filter(record => {
      const recordDate = new Date(record.date_of_death || record.created_at);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;

    setStatistics({
      total_records: totalRecords,
      male_count: maleCount,
      female_count: femaleCount,
      this_month: thisMonth
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

    // Search filter
    if (searchTerm.trim()) {
      const loweredSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(record => {
        const searchableFields = [
          record.first_name,
          record.middle_name,
          record.last_name,
          record.registry_number,
          record.place_of_death,
          record.father_name,
          record.mother_maiden_name,
        ].filter(Boolean);

        return searchableFields.some(field => 
          field.toLowerCase().includes(loweredSearch)
        );
      });
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date_of_death);
        const fromDate = new Date(dateFrom);
        return recordDate >= fromDate;
      });
    }

    if (dateTo) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date_of_death);
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

  const handleAddRecord = () => {
    setShowAddModal(true);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleRecordSaved = (newRecord) => {
    console.log("Death record saved successfully");
    setShowAddModal(false);
    setAllRecords(prev => [newRecord, ...prev]);
    fetchStatistics();
  };

  const handleRecordUpdated = (updatedRecord) => {
    console.log("Death record updated successfully");
    setShowEditModal(false);
    setSelectedRecord(null);
    setAllRecords(prev => 
      prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    fetchStatistics();
  };

  const handleDeleteRecord = async (recordId, recordName = "this record") => {
    const confirmation = await showAlert.confirm(
      "Delete Death Record",
      `Are you sure you want to delete ${recordName}? This action cannot be undone.`,
      "Yes, Delete",
      "Cancel",
      "warning"
    );

    if (!confirmation.isConfirmed) return;

    showAlert.processing("Deleting Record", "Please wait while we delete the death record...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/death-records/${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        showAlert.close();
        showToast.success("Death record deleted successfully!");
        
        setAllRecords(prev => prev.filter(record => record.id !== recordId));
        fetchStatistics();
      } else {
        showAlert.close();
        throw new Error("Failed to delete death record");
      }
    } catch (error) {
      showAlert.close();
      console.error("Error deleting death record:", error);
      showAlert.error("Error", "Failed to delete death record");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
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
              <div className="skeleton-line mb-2" style={{ width: "80%", height: "14px" }}></div>
              <div className="skeleton-line" style={{ width: "60%", height: "24px" }}></div>
            </div>
            <div className="col-auto">
              <div className="skeleton-icon" style={{ width: "24px", height: "24px", borderRadius: "4px" }}></div>
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
          <h1 className="h3 mb-1 text-dark">Death Records Management</h1>
          <p className="text-muted mb-0">
            Manage and view all death certificate records
            {filteredRecords.length !== allRecords.length && (
              <span className="text-info ms-2">
                (Showing {filteredRecords.length} of {allRecords.length} records)
              </span>
            )}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="badge px-3 py-2 text-white" style={{ backgroundColor: "#018181" }}>
            <i className="fas fa-cross me-2"></i>
            Total Records: {loading ? "..." : allRecords.length}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddRecord}
            style={{
              backgroundColor: "#018181",
              borderColor: "#018181",
            }}
          >
            <i className="fas fa-plus me-2"></i>Add Death Record
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
                      <div className="text-xs fw-semibold text-uppercase mb-1" style={{ color: "#018181" }}>Total Records</div>
                      <div className="h4 mb-0 fw-bold" style={{ color: "#018181" }}>{statistics.total_records || 0}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-cross fa-lg" style={{ color: "#018181", opacity: "0.7" }}></i>
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
                      <div className="text-xs fw-semibold text-uppercase mb-1 text-primary">Male</div>
                      <div className="h4 mb-0 fw-bold text-primary">{statistics.male_count || 0}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-male fa-lg text-primary opacity-70"></i>
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
                      <div className="text-xs fw-semibold text-uppercase mb-1 text-info">Female</div>
                      <div className="h4 mb-0 fw-bold text-info">{statistics.female_count || 0}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-female fa-lg text-info opacity-70"></i>
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
                      <div className="text-xs fw-semibold text-uppercase mb-1 text-warning">This Month</div>
                      <div className="h4 mb-0 fw-bold text-warning">{statistics.this_month || 0}</div>
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
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold mb-1">
                Search Records
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, registry number, place..."
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
            <div className="col-6 col-md-3">
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
            <div className="col-6 col-md-3">
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
            <div className="col-12 col-md-2">
              <label className="form-label small fw-semibold mb-1">
                Items
              </label>
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
          {(searchTerm || dateFrom || dateTo) && (
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
                    Found {filteredRecords.length} records matching your criteria
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <DeathRecordsTable
        records={paginationInfo}
        loading={loading}
        onViewRecord={handleViewRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      {showAddModal && (
        <AddDeathRecordModal
          onClose={() => setShowAddModal(false)}
          onSave={handleRecordSaved}
          token={token}
        />
      )}

      {showEditModal && selectedRecord && (
        <EditDeathRecordModal
          record={selectedRecord}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRecord(null);
          }}
          onUpdate={handleRecordUpdated}
          token={token}
        />
      )}

      {showViewModal && selectedRecord && (
        <ViewDeathRecordModal
          record={selectedRecord}
          onClose={() => {
            setShowViewModal(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default DeathRecords;