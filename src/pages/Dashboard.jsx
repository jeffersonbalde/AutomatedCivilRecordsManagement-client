// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../services/notificationService";

const Dashboard = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBirthRecords: 0,
    totalMarriageRecords: 0,
    totalDeathRecords: 0,
    totalCertificatesIssued: 0,
    todayCertificates: 0,
    monthlyRevenue: 0,
    recentIssuances: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/dashboard/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          setStats({
            totalBirthRecords: data.data.totalBirthRecords || 0,
            totalMarriageRecords: data.data.totalMarriageRecords || 0,
            totalDeathRecords: data.data.totalDeathRecords || 0,
            totalCertificatesIssued: data.data.totalCertificatesIssued || 0,
            todayCertificates: data.data.todayCertificates || 0,
            monthlyRevenue: data.data.monthlyRevenue || 0,
            recentIssuances: data.data.recentIssuances || []
          });
        } else {
          throw new Error(data.message || "Invalid response format");
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showToast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Get certificate type badge color
  const getCertificateTypeBadge = (type) => {
    const colors = {
      birth: "success",
      marriage: "primary",
      death: "secondary"
    };
    return colors[type] || "secondary";
  };

  // Statistics Cards Skeleton - Matching Reports design
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

  // Card Skeleton for other sections
  const CardSkeleton = () => (
    <div className="card shadow border-0 h-100">
      <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
        <div className="skeleton-line" style={{ width: "60%", height: "20px" }}></div>
      </div>
      <div className="card-body">
        <div className="skeleton-chart" style={{ height: "200px", width: "100%" }}></div>
      </div>
    </div>
  );

  // Recent Activity Skeleton
  const RecentActivitySkeleton = () => (
    <div className="card shadow border-0 h-100">
      <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
        <div className="skeleton-line" style={{ width: "60%", height: "20px" }}></div>
      </div>
      <div className="card-body">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="d-flex justify-content-between align-items-center mb-3">
            <div className="flex-grow-1">
              <div className="skeleton-line mb-2" style={{ width: "70%", height: "16px" }}></div>
              <div className="skeleton-line" style={{ width: "50%", height: "14px" }}></div>
            </div>
            <div className="skeleton-line" style={{ width: "80px", height: "14px" }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-1 fadeIn">
      {/* Page Header - Always visible, not dependent on loading state */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">
            {getGreeting()}, {user?.full_name || user?.username || "User"}!
          </h1>
          <p className="text-muted mb-0">
            Welcome to the Civil Registry System Dashboard
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards Section */}
      {loading ? (
        <div className="row mb-4 g-3">
          <StatisticsCardSkeleton />
          <StatisticsCardSkeleton />
          <StatisticsCardSkeleton />
          <StatisticsCardSkeleton />
        </div>
      ) : (
        <div className="row mb-4 g-3">
          {/* Total Birth Records */}
          <div className="col-6 col-md-3">
            <div className="card stats-card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="text-xs fw-semibold text-uppercase mb-1" style={{ color: "#018181" }}>
                      Birth Records
                    </div>
                    <div className="h4 mb-0 fw-bold" style={{ color: "#018181" }}>
                      {stats.totalBirthRecords.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-baby fa-lg" style={{ color: "#018181", opacity: "0.7" }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Marriage Records */}
          <div className="col-6 col-md-3">
            <div className="card stats-card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="text-xs fw-semibold text-uppercase mb-1 text-info">
                      Marriage Records
                    </div>
                    <div className="h4 mb-0 fw-bold text-info">
                      {stats.totalMarriageRecords.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-heart fa-lg text-info opacity-70"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Death Records */}
          <div className="col-6 col-md-3">
            <div className="card stats-card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="text-xs fw-semibold text-uppercase mb-1 text-success">
                      Death Records
                    </div>
                    <div className="h4 mb-0 fw-bold text-success">
                      {stats.totalDeathRecords.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-cross fa-lg text-success opacity-70"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Certificates Issued */}
          <div className="col-6 col-md-3">
            <div className="card stats-card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="text-xs fw-semibold text-uppercase mb-1 text-warning">
                      Certificates Issued
                    </div>
                    <div className="h4 mb-0 fw-bold text-warning">
                      {stats.totalCertificatesIssued.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-certificate fa-lg text-warning opacity-70"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue and Activity Cards Section */}
      {loading ? (
        <div className="row mb-4 g-4">
          <div className="col-xl-4 col-md-6">
            <CardSkeleton />
          </div>
          <div className="col-xl-4 col-md-6">
            <CardSkeleton />
          </div>
          <div className="col-xl-4 col-md-12">
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <div className="row mb-4 g-4">
          {/* Monthly Revenue */}
          <div className="col-xl-4 col-md-6">
            <div className="card shadow border-0 h-100">
              <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
                <h6 className="card-title mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Monthly Revenue
                </h6>
              </div>
              <div className="card-body">
                <div className="text-center py-4">
                  <div className="h2 font-weight-bold text-success">
                    {formatCurrency(stats.monthlyRevenue)}
                  </div>
                  <p className="text-muted mb-0">Total revenue this month</p>
                </div>
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    From certificate issuances
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="col-xl-4 col-md-6">
            <div className="card shadow border-0 h-100">
              <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
                <h6 className="card-title mb-0">
                  <i className="fas fa-calendar-day me-2"></i>
                  Today's Activity
                </h6>
              </div>
              <div className="card-body">
                <div className="text-center py-4">
                  <div className="h2 font-weight-bold text-primary">
                    {stats.todayCertificates}
                  </div>
                  <p className="text-muted mb-0">Certificates issued today</p>
                </div>
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Updated just now
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-xl-4 col-md-12">
            <div className="card shadow border-0 h-100">
              <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
                <h6 className="card-title mb-0">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <a 
                    href="/generate-certificates" 
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: "#018181", borderColor: "#018181" }}
                  >
                    <i className="fas fa-certificate me-2"></i>
                    Generate Certificate
                  </a>
                  <a 
                    href="/birth-records" 
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-baby me-2"></i>
                    Manage Birth Records
                  </a>
                  <a 
                    href="/issuance-history" 
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-history me-2"></i>
                    View Issuance History
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Certificate Issuances Section */}
      {loading ? (
        <div className="row">
          <div className="col-12">
            <RecentActivitySkeleton />
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card shadow border-0">
              <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
                <h6 className="card-title mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Certificate Issuances
                </h6>
              </div>
              <div className="card-body">
                {stats.recentIssuances && stats.recentIssuances.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {stats.recentIssuances.map((issuance, index) => (
                      <div 
                        key={issuance.id} 
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          index % 2 === 0 ? '' : 'bg-light'
                        }`}
                      >
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="mb-0 me-3">{issuance.issued_to}</h6>
                            <span className={`badge bg-${getCertificateTypeBadge(issuance.certificate_type)}`}>
                              {issuance.certificate_type?.toUpperCase() || 'UNKNOWN'}
                            </span>
                          </div>
                          <small className="text-muted">
                            <strong>Certificate:</strong> {issuance.certificate_number} • 
                            <strong> OR #:</strong> {issuance.or_number} • 
                            <strong> Amount:</strong> {formatCurrency(issuance.amount_paid)}
                          </small>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {formatDate(issuance.created_at)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-inbox fa-2x text-muted opacity-50 mb-3"></i>
                    <h6 className="text-muted">No recent issuances</h6>
                    <p className="text-muted small">
                      Certificate issuances will appear here
                    </p>
                  </div>
                )}
                
                {stats.recentIssuances && stats.recentIssuances.length > 0 && (
                  <div className="text-center mt-3">
                    <a 
                      href="/issuance-history" 
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="fas fa-list me-1"></i>
                      View All Issuances
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;