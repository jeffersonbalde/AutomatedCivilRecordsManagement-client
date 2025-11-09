// components/admin/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert, showToast } from "../../../services/notificationService";
import UserDetailsModal from "./UserDetailsModal";
import StaffFormModal from "./StaffFormModal";
import DeactivateModal from "./DeactivateModal";

const UserManagement = () => {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionLock, setActionLock] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivity, setFilterActivity] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Simple avatar URL formatter
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    const baseUrl = import.meta.env.VITE_LARAVEL_API || 'http://localhost:8000';
    return `${baseUrl}/storage/${avatarPath}`;
  };

// FIXED normalizeStaff function
const normalizeStaff = (staff) => {
  if (!staff) return null;

  // CORRECT avatar URL construction
  const getAvatarUrl = (filename) => {
    if (!filename) return null;
    
    const baseUrl = import.meta.env.VITE_LARAVEL_API || 'http://localhost:8000';
    
    // Clean the filename
    let cleanFilename = filename;
    if (filename.includes('avatars/')) {
      cleanFilename = filename.replace('avatars/', '');
    }
    if (filename.includes('avatar_')) {
      cleanFilename = filename.replace('avatar_', '');
    }
    
    return `${baseUrl}/api/avatar/${cleanFilename}`;
  };

  // Handle is_active properly - ensure it's always a boolean
  let isActive = true; // Default to true for new staff
  if (staff.is_active !== undefined && staff.is_active !== null) {
    // Handle both number (1/0) and boolean values
    isActive = staff.is_active === 1 || staff.is_active === true;
  }

  console.log('🔄 Normalizing staff is_active:', {
    original: staff.is_active,
    normalized: isActive,
    staffName: staff.full_name
  });

  return {
    id: staff.id,
    name: staff.full_name || "",
    email: staff.email || "",
    username: staff.username || (staff.email ? staff.email.split("@")[0] : ""),
    position: staff.position || "Staff Member",
    contact: staff.contact_number || "",
    address: staff.address || "",
    avatar: staff.avatar,
    avatar_url: getAvatarUrl(staff.avatar),
    is_active: isActive, // Use the properly normalized value
    last_login_at: staff.last_login_at || null,
    created_at: staff.created_at || null,
    created_by: staff.creator || null,
  };
};

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, filterActivity, sortField, sortDirection]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/admin/staff`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const transformedUsers = Array.isArray(data)
          ? data.map((staff) => normalizeStaff(staff)).filter(Boolean)
          : [];
        setUsers(transformedUsers);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert.error("Error", "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/admin/staff/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm.trim()) {
      const loweredSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        const fieldsToSearch = [
          user.name,
          user.email,
          user.contact,
          user.address,
          user.username,
          user.position,
        ];
        return fieldsToSearch.some(
          (field) =>
            typeof field === "string" &&
            field.toLowerCase().includes(loweredSearch)
        );
      });
    }

    // Activity filter
    if (filterActivity !== "all") {
      if (filterActivity === "active") {
        filtered = filtered.filter((user) => user.is_active);
      } else if (filterActivity === "inactive") {
        filtered = filtered.filter((user) => !user.is_active);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === "created_at" || sortField === "last_login_at") {
        const aDate = a[sortField] ? new Date(a[sortField]) : new Date(0);
        const bDate = b[sortField] ? new Date(b[sortField]) : new Date(0);

        if (aDate < bDate) return sortDirection === "asc" ? -1 : 1;
        if (aDate > bDate) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      const aValue = String(a[sortField] || "").toLowerCase();
      const bValue = String(b[sortField] || "").toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (actionLock) return;
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

// FIXED UserAvatar component
const UserAvatar = ({ user, size = 40 }) => {
// This part is CORRECT - keep it as is
const getAvatarUrl = (filename) => {
  if (!filename) return null;
  
  const baseUrl = import.meta.env.VITE_LARAVEL_API || 'http://localhost:8000';
  
  // Clean the filename
  let cleanFilename = filename;
  if (filename.includes('avatars/')) {
    cleanFilename = filename.replace('avatars/', '');
  }
  if (filename.includes('avatar_')) {
    cleanFilename = filename.replace('avatar_', '');
  }
  
  // CORRECT URL: http://localhost:8000/api/avatar/1762566900_690ea2f4d8d0b.jpg
  return `${baseUrl}/avatar/${cleanFilename}`;
};

  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  console.log('🔄 Avatar URL Debug:', {
    original: user?.avatar,
    cleaned: avatarUrl,
    user: user?.name
  });

  if (avatarUrl) {
    return (
      <div
        className="rounded-circle overflow-hidden border"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          backgroundColor: '#f8f9fa',
          flexShrink: 0
        }}
      >
        <img
          src={avatarUrl}
          alt={`${user?.name || "Staff"} avatar`}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover"
          }}
          onLoad={() => console.log('✅ Avatar loaded for:', user?.name)}
          onError={(e) => {
            console.log('❌ Avatar failed for:', user?.name, 'URL:', avatarUrl);
            // Show fallback
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Fallback - initials avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center text-white border"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#018181',
        fontSize: `${size * 0.35}px`,
        fontWeight: 'bold',
        flexShrink: 0
      }}
    >
      {getInitials(user?.name)}
    </div>
  );
};


  const handleViewDetails = (user) => {
    if (actionLock) {
      showToast.warning("Please wait until the current action completes");
      return;
    }
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeactivate = (user) => {
    if (actionLock) {
      showToast.warning("Please wait until the current action completes");
      return;
    }
    if (user.id === currentUser.id) {
      showAlert.error("Error", "You cannot deactivate your own account");
      return;
    }
    setSelectedUser(user);
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = async (deactivateReason) => {
    if (!selectedUser) return;

    setActionLock(true);
    setActionLoading(selectedUser.id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/admin/staff/${selectedUser.id}/deactivate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            deactivate_reason: deactivateReason
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast.success("Account deactivated successfully!");
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, is_active: false } : u))
        );
        setShowDeactivateModal(false);
        setSelectedUser(null);
        fetchStatistics();
      } else {
        throw new Error(data.message || "Failed to deactivate account");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      showAlert.error(
        "Deactivation Failed",
        error.message || "Failed to deactivate account"
      );
    } finally {
      setActionLoading(null);
      setActionLock(false);
    }
  };

  const handleReactivate = async (user) => {
    if (actionLock) {
      showToast.warning("Please wait until the current action completes");
      return;
    }

    const result = await showAlert.confirm(
      "Reactivate Account",
      `Are you sure you want to reactivate ${user.name}'s account?`,
      "Yes, Reactivate",
      "Cancel"
    );

    if (!result.isConfirmed) return;

    setActionLock(true);
    setActionLoading(user.id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/admin/staff/${user.id}/reactivate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast.success("Account reactivated successfully!");
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: true } : u))
        );
        fetchStatistics();
      } else {
        throw new Error(data.message || "Failed to reactivate account");
      }
    } catch (error) {
      console.error("Error reactivating user:", error);
      showAlert.error(
        "Reactivation Failed",
        error.message || "Failed to reactivate account"
      );
    } finally {
      setActionLoading(null);
      setActionLock(false);
    }
  };

  const handleDeleteStaff = async (user) => {
    if (actionLock) {
      showToast.warning("Please wait until the current action completes");
      return;
    }

    if (user.id === currentUser.id) {
      showAlert.error("Error", "You cannot delete your own account");
      return;
    }

    const confirmation = await showAlert.confirm(
      "Delete Staff Account",
      `Are you sure you want to permanently delete ${user.name}'s account?`,
      "Yes, Delete",
      "Cancel",
      "warning"
    );

    if (!confirmation.isConfirmed) return;

    setActionLock(true);
    setActionLoading(user.id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/admin/staff/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        showToast.success("Staff account deleted successfully!");
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        fetchStatistics();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete staff account");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      showAlert.error(
        "Deletion Failed",
        error.message || "Failed to delete staff account"
      );
    } finally {
      setActionLoading(null);
      setActionLock(false);
    }
  };

  const handleAddStaff = () => {
    setEditingUser(null);
    setShowStaffForm(true);
  };

const handleEditStaff = (user) => {
  console.log('✏️ Editing staff:', user);
  setEditingUser(user);
  setShowStaffForm(true);
};
  const handleStaffSave = (savedStaff) => {
    const normalizedStaff = normalizeStaff(savedStaff);
    if (!normalizedStaff) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === normalizedStaff.id ? normalizedStaff : user
        )
      );
    } else {
      setUsers((prev) => [...prev, normalizedStaff]);
    }
    setShowStaffForm(false);
    setEditingUser(null);
    fetchStatistics();
  };

  const getActivityBadge = (user) => {
    if (user.is_active) {
      return <span className="badge bg-success">Active</span>;
    } else {
      return <span className="badge bg-danger">Inactive</span>;
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "fas fa-sort";
    return sortDirection === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
  };

  const isActionDisabled = (userId = null) => {
    return actionLock || (actionLoading && actionLoading !== userId);
  };

  const formatLocalDateTime = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { date: "Invalid Date", time: "" };
      return {
        date: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (error) {
      return { date: "Date Error", time: "" };
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Skeleton Loader
  const TableRowSkeleton = () => (
    <tr className="align-middle" style={{ height: "70px" }}>
      <td className="text-center fw-bold text-muted">
        <div className="skeleton-box" style={{ width: "20px", height: "20px", margin: "0 auto" }}></div>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-1">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="skeleton-box" style={{ width: "32px", height: "32px", borderRadius: "4px" }}></div>
          ))}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="skeleton-avatar me-3" style={{ width: "40px", height: "40px", borderRadius: "50%" }}></div>
          <div className="flex-grow-1">
            <div className="skeleton-line mb-1" style={{ height: "16px" }}></div>
            <div className="skeleton-line" style={{ width: "60%", height: "14px" }}></div>
          </div>
        </div>
      </td>
      <td>
        <div className="skeleton-line mb-1" style={{ height: "16px" }}></div>
        <div className="skeleton-line" style={{ width: "80%", height: "14px" }}></div>
      </td>
      <td>
        <div className="skeleton-badge" style={{ width: "60px", height: "24px", borderRadius: "12px" }}></div>
      </td>
      <td className="text-center">
        <div className="skeleton-line" style={{ width: "80%", height: "16px", margin: "0 auto" }}></div>
      </td>
    </tr>
  );

  return (
    <div className="container-fluid px-1 fadeIn" >
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">User Management</h1>
          <p className="text-muted mb-0">Manage system staff and account status</p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="badge px-3 py-2 text-white" style={{ backgroundColor: "#018181" }}>
            <i className="fas fa-users me-2"></i>
            Total Staff: {loading ? "..." : users.length}
          </div>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleAddStaff} 
            disabled={isActionDisabled()}
            style={{ 
              backgroundColor: "#018181", 
              borderColor: "#018181" 
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#016767"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#018181"}
          >
            <i className="fas fa-plus me-1"></i>Add Staff
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchUsers} disabled={isActionDisabled()}>
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="row mb-4 g-3">
          <div className="col-6 col-md-3">
            <div className="card stats-card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="text-xs fw-semibold text-uppercase mb-1" style={{ color: "#018181" }}>Total Staff</div>
                    <div className="h4 mb-0 fw-bold" style={{ color: "#018181" }}>{statistics.total_staff}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-users fa-lg" style={{ color: "#018181", opacity: "0.7" }}></i>
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
                    <div className="text-xs fw-semibold text-uppercase mb-1 text-success">Active</div>
                    <div className="h4 mb-0 fw-bold text-success">{statistics.active_staff}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-check fa-lg text-success opacity-70"></i>
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
                    <div className="text-xs fw-semibold text-uppercase mb-1 text-danger">Inactive</div>
                    <div className="h4 mb-0 fw-bold text-danger">{statistics.inactive_staff}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-slash fa-lg text-danger opacity-70"></i>
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
                    <div className="text-xs fw-semibold text-uppercase mb-1 text-info">Recent (30d)</div>
                    <div className="h4 mb-0 fw-bold text-info">{statistics.recent_staff}</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-plus fa-lg text-info opacity-70"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 g-md-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold mb-1">Search Staff</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0"><i className="fas fa-search"></i></span>
                <input type="text" className="form-control border-start-0" placeholder="Search by name, email, position..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isActionDisabled()} />
                {searchTerm && (
                  <button className="btn btn-outline-secondary border-start-0" type="button" onClick={() => setSearchTerm("")} disabled={isActionDisabled()}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Activity</label>
              <select className="form-select form-select-sm" value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)} disabled={loading || isActionDisabled()}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold mb-1">Items</label>
              <select className="form-select form-select-sm" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} disabled={loading || isActionDisabled()}>
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card shadow border-0">
        <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
            <h6 className="card-title mb-0">
              <i className="fas fa-users me-2"></i>
              System Staff
              {!loading && <small className="opacity-75 ms-2">({filteredUsers.length} found{searchTerm || filterActivity !== "all" ? " after filtering" : ""})</small>}
            </h6>
            <button 
              className="btn btn-outline-light btn-sm" 
              onClick={fetchUsers} 
              disabled={loading || isActionDisabled()}
              style={{ 
                borderColor: "rgba(255,255,255,0.5)",
                color: "white"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.borderColor = "rgba(255,255,255,0.8)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "rgba(255,255,255,0.5)";
              }}
            >
              <i className="fas fa-sync-alt me-1"></i>Refresh
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead style={{ backgroundColor: "var(--background-light)" }}>
                  <tr>
                    <th className="text-center fw-bold" style={{ width: "50px", fontSize: "0.875rem" }}>#</th>
                    <th className="text-center" style={{ width: "180px", fontSize: "0.875rem" }}>Actions</th>
                    <th style={{ fontSize: "0.875rem" }}>Staff</th>
                    <th style={{ fontSize: "0.875rem" }}>Contact & Address</th>
                    <th style={{ fontSize: "0.875rem" }}>Activity</th>
                    <th className="text-center" style={{ fontSize: "0.875rem" }}>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </tbody>
              </table>
              <div className="text-center py-4">
                <div className="spinner-border me-2" style={{ color: "#018181" }} role="status"></div>
                <span className="text-muted">Fetching staff data...</span>
              </div>
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users fa-4x text-muted opacity-50 mb-4"></i>
              <h5 className="text-muted mb-3">No Staff Found</h5>
              <p className="text-muted mb-4">
                {users.length === 0 ? "No staff registered in the system" : "Try adjusting your search or filter criteria"}
              </p>
              {(searchTerm || filterActivity !== "all") && (
                <button className="btn btn-outline-secondary" onClick={() => { setSearchTerm(""); setFilterActivity("all"); }} disabled={isActionDisabled()}>
                  <i className="fas fa-times me-2"></i>Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead style={{ backgroundColor: "var(--background-light)" }}>
                    <tr>
                      <th className="text-center fw-bold" style={{ width: "50px", fontSize: "0.875rem" }}>#</th>
                      <th className="text-center" style={{ width: "180px", fontSize: "0.875rem" }}>Actions</th>
                      <th style={{ fontSize: "0.875rem" }}>
                        <button className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold text-start w-100" onClick={() => handleSort("name")} disabled={isActionDisabled()} style={{ fontSize: "0.875rem" }}>
                          <span className="d-flex align-items-center justify-content-between">
                            Staff <i className={`ms-1 ${getSortIcon("name")}`}></i>
                          </span>
                        </button>
                      </th>
                      <th style={{ fontSize: "0.875rem" }}>Contact & Address</th>
                      <th style={{ fontSize: "0.875rem" }}>
                        <button className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold text-start w-100" onClick={() => handleSort("is_active")} disabled={isActionDisabled()} style={{ fontSize: "0.875rem" }}>
                          <span className="d-flex align-items-center justify-content-between">
                            Activity <i className={`ms-1 ${getSortIcon("is_active")}`}></i>
                          </span>
                        </button>
                      </th>
                      <th className="text-center" style={{ fontSize: "0.9rem" }}>
                        <button className="btn btn-link p-0 border-0 text-decoration-none text-dark fw-semibold" onClick={() => handleSort("created_at")} disabled={isActionDisabled()} style={{ fontSize: "0.9rem" }}>
                          <span className="d-flex flex-column align-items-center">
                            <span>Registered</span>
                            <i className={`ms-1 ${getSortIcon("created_at")}`}></i>
                          </span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user.id} className="align-middle" style={{ height: "70px" }}>
                        <td className="text-center fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
                          {startIndex + index + 1}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            {/* View Button */}
                            <button 
                              className="btn action-btn" 
                              onClick={() => handleViewDetails(user)} 
                              disabled={isActionDisabled(user.id)} 
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
                                border: "1px solid" 
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = "#016767"}
                              onMouseOut={(e) => e.target.style.backgroundColor = "#018181"}
                            >
                              {actionLoading === user.id ? <span className="spinner-border spinner-border-sm" role="status"></span> : <i className="fas fa-eye"></i>}
                            </button>
                            {/* Edit Button */}
                            <button 
                              className="btn action-btn" 
                              onClick={() => handleEditStaff(user)} 
                              disabled={isActionDisabled(user.id)} 
                              title="Edit Staff" 
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
                                border: "1px solid" 
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = "#016767"}
                              onMouseOut={(e) => e.target.style.backgroundColor = "#018181"}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {/* Deactivate/Reactivate Button */}
                            {user.is_active ? (
                              <button 
                                className="btn action-btn" 
                                onClick={() => handleDeactivate(user)} 
                                disabled={isActionDisabled(user.id) || user.id === currentUser.id} 
                                title={user.id === currentUser.id ? "Cannot deactivate your own account" : "Deactivate Account"} 
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
                                  border: "1px solid" 
                                }}
                              >
                                {actionLoading === user.id ? <span className="spinner-border spinner-border-sm" role="status"></span> : <i className="fas fa-user-slash"></i>}
                              </button>
                            ) : (
                              <button 
                                className="btn action-btn" 
                                onClick={() => handleReactivate(user)} 
                                disabled={isActionDisabled(user.id)} 
                                title="Reactivate Account" 
                                style={{ 
                                  backgroundColor: "#198754", 
                                  borderColor: "#198754", 
                                  color: "white", 
                                  width: "32px", 
                                  height: "32px", 
                                  borderRadius: "4px", 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center", 
                                  fontSize: "0.875rem", 
                                  padding: "0", 
                                  border: "1px solid" 
                                }}
                              >
                                {actionLoading === user.id ? <span className="spinner-border spinner-border-sm" role="status"></span> : <i className="fas fa-user-check"></i>}
                              </button>
                            )}
                            {/* Delete Button */}
                            <button 
                              className="btn action-btn" 
                              onClick={() => handleDeleteStaff(user)} 
                              disabled={isActionDisabled(user.id) || user.id === currentUser.id} 
                              title={user.id === currentUser.id ? "Cannot delete your own account" : "Delete Account"} 
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
                                border: "1px solid" 
                              }}
                            >
                              {actionLoading === user.id ? <span className="spinner-border spinner-border-sm" role="status"></span> : <i className="fas fa-trash"></i>}
                            </button>
                          </div>
                        </td>
                        <td style={{ maxWidth: "250px", minWidth: "250px" }}>
                          <div className="d-flex align-items-center">
                            <div className="position-relative me-3 flex-shrink-0">
                              <UserAvatar user={user} size={40} />
                            </div>
                            <div className="flex-grow-1 min-w-0">
                              <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.9rem", lineHeight: "1.3" }} title={user.name}>
                                {user.name}
                              </div>
                              <small className="text-muted d-block text-truncate" style={{ fontSize: "0.8rem", lineHeight: "1.3" }} title={user.email}>
                                {user.email}
                              </small>
                              {user.position && (
                                <small className="text-info d-block text-truncate" style={{ fontSize: "0.75rem", lineHeight: "1.3" }} title={user.position}>
                                  {user.position}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ maxWidth: "200px", minWidth: "200px" }}>
                          <div className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }} title={user.contact || "No contact number"}>
                            {user.contact || "N/A"}
                          </div>
                          <small className="text-muted d-block text-truncate" style={{ fontSize: "0.8rem" }} title={user.address || "No address"}>
                            {user.address || "N/A"}
                          </small>
                        </td>
                        <td style={{ width: "100px" }}>
                          {getActivityBadge(user)}
                        </td>
                        <td className="text-center" style={{ width: "130px" }}>
                          {(() => {
                            const { date, time } = formatLocalDateTime(user.created_at);
                            return (
                              <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }} title={`${date}${time ? ` ${time}` : ""}`}>
                                <span className="d-block">{date}</span>
                                {time && <span className="d-block text-muted" style={{ fontSize: "0.8rem" }}>{time}</span>}
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer bg-white border-top-0 py-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="text-center text-md-start">
                      <small className="text-muted">
                        Showing <span className="fw-semibold">{startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}</span> of <span className="fw-semibold">{filteredUsers.length}</span> entries
                      </small>
                    </div>
                    <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm pagination-btn" 
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                          disabled={currentPage === 1 || isActionDisabled()} 
                          style={{ 
                            backgroundColor: "transparent", 
                            borderColor: "#018181", 
                            color: "#018181", 
                            minWidth: "80px" 
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#f0f9f9";
                            e.target.style.color = "#016767";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#018181";
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
                                  disabled={isActionDisabled()} 
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
                          disabled={currentPage === totalPages || isActionDisabled()} 
                          style={{ 
                            backgroundColor: "transparent", 
                            borderColor: "#018181", 
                            color: "#018181", 
                            minWidth: "80px" 
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#f0f9f9";
                            e.target.style.color = "#016767";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "#018181";
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

      {/* Global Action Lock Overlay */}
      {actionLock && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", zIndex: 9999, pointerEvents: "none" }}>
          <div className="bg-white rounded p-3 shadow-sm d-flex align-items-center">
            <div className="spinner-border me-2" style={{ color: "#018181" }} role="status"></div>
            <span className="text-muted">Processing action...</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => { setShowDetailsModal(false); setSelectedUser(null); }} />
      )}
      {showStaffForm && (
        <StaffFormModal staff={editingUser} onClose={() => { setShowStaffForm(false); setEditingUser(null); }} onSave={handleStaffSave} token={token} />
      )}
      {showDeactivateModal && selectedUser && (
        <DeactivateModal user={selectedUser} onClose={() => { setShowDeactivateModal(false); setSelectedUser(null); }} onDeactivate={handleDeactivateConfirm} loading={actionLoading === selectedUser.id} />
      )}
    </div>
  );
};

export default UserManagement;