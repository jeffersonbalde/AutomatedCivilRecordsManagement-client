// src/pages/Admin/Reports/components/StatisticsCards.jsx
import React from "react";

const StatisticsCards = ({ statistics, loading }) => {
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

  if (loading) {
    return (
      <div className="row mb-4 g-3">
        <StatisticsCardSkeleton />
        <StatisticsCardSkeleton />
        <StatisticsCardSkeleton />
        <StatisticsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="row mb-4 g-3">
      <div className="col-6 col-md-3">
        <div className="card stats-card h-100 border-0 shadow-sm">
          <div className="card-body p-3">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <div className="text-xs fw-semibold text-uppercase mb-1" style={{ color: "#018181" }}>
                  Total Records
                </div>
                <div className="h4 mb-0 fw-bold" style={{ color: "#018181" }}>
                  {statistics?.total_records || 0}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-database fa-lg" style={{ color: "#018181", opacity: "0.7" }}></i>
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
                  Birth Records
                </div>
                <div className="h4 mb-0 fw-bold text-info">
                  {statistics?.total_births || 0}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-baby fa-lg text-info opacity-70"></i>
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
                  Marriage Records
                </div>
                <div className="h4 mb-0 fw-bold text-success">
                  {statistics?.total_marriages || 0}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-heart fa-lg text-success opacity-70"></i>
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
                  Death Records
                </div>
                <div className="h4 mb-0 fw-bold text-warning">
                  {statistics?.total_deaths || 0}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-cross fa-lg text-warning opacity-70"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;