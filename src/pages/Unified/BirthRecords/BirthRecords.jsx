// src/pages/BirthRecords/BirthRecords.jsx - UPDATED with client-side filtering
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert, showToast } from "../../../services/notificationService";
import BirthRecordsTable from "./BirthRecordsTable";
import AddBirthRecordModal from "./AddBirthRecordModal";
import EditBirthRecordModal from "./EditBirthRecordModal";
import ViewBirthRecordModal from "./ViewBirthRecordModal";

const BirthRecords = () => {
  const { token } = useAuth();
  const [allRecords, setAllRecords] = useState([]); // Store all records
  const [filteredRecords, setFilteredRecords] = useState([]); // Filtered records for display
  const [loading, setLoading] = useState(true);
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
  }, []);

  // Apply client-side filtering whenever search term, dates, or allRecords change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFrom, dateTo, allRecords]);

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/birth-records?per_page=1000`, // Fetch more records at once
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
        throw new Error("Failed to fetch birth records");
      }
    } catch (error) {
      console.error("Error fetching birth records:", error);
      showAlert.error("Error", "Failed to load birth records");
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering function
  const applyFilters = () => {
    let filtered = [...allRecords];

    // Search filter
    if (searchTerm.trim()) {
      const loweredSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(record => {
        const searchableFields = [
          record.child_first_name,
          record.child_middle_name,
          record.child_last_name,
          record.registry_number,
          record.place_of_birth,
          record.birth_address_city,
          record.birth_address_barangay,
          // Parent names if available
          record.mother?.first_name,
          record.mother?.last_name,
          record.father?.first_name,
          record.father?.last_name,
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some(field => 
          field.toLowerCase().includes(loweredSearch)
        );
      });
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date_of_birth);
        const fromDate = new Date(dateFrom);
        return recordDate >= fromDate;
      });
    }

    if (dateTo) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date_of_birth);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Include entire end date
        return recordDate <= toDate;
      });
    }

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filters change
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
    setShowAddModal(false);
    showToast.success("Birth record saved successfully!");
    // Add new record to the local state and refetch to ensure data consistency
    setAllRecords(prev => [newRecord, ...prev]);
  };

  const handleRecordUpdated = (updatedRecord) => {
    setShowEditModal(false);
    setSelectedRecord(null);
    showToast.success("Birth record updated successfully!");
    // Update the record in local state
    setAllRecords(prev => 
      prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const handleDeleteRecord = async (recordId) => {
    const confirmation = await showAlert.confirm(
      "Delete Birth Record",
      "Are you sure you want to delete this birth record? This action cannot be undone.",
      "Yes, Delete",
      "Cancel",
      "warning"
    );

    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/birth-records/${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        showToast.success("Birth record deleted successfully!");
        // Remove record from local state
        setAllRecords(prev => prev.filter(record => record.id !== recordId));
      } else {
        throw new Error("Failed to delete birth record");
      }
    } catch (error) {
      console.error("Error deleting birth record:", error);
      showAlert.error("Error", "Failed to delete birth record");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Debounced search to prevent too many re-renders
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container-fluid px-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">Birth Records Management</h1>
          <p className="text-muted mb-0">
            Manage and view all birth certificate records
            {filteredRecords.length !== allRecords.length && (
              <span className="text-info ms-2">
                (Showing {filteredRecords.length} of {allRecords.length} records)
              </span>
            )}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={handleAddRecord}
            style={{
              backgroundColor: "#018181",
              borderColor: "#018181",
            }}
          >
            <i className="fas fa-plus me-2"></i>Add Birth Record
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={fetchAllRecords}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
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
      <BirthRecordsTable
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
        <AddBirthRecordModal
          onClose={() => setShowAddModal(false)}
          onSave={handleRecordSaved}
          token={token}
        />
      )}

      {showEditModal && selectedRecord && (
        <EditBirthRecordModal
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
        <ViewBirthRecordModal
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

export default BirthRecords;