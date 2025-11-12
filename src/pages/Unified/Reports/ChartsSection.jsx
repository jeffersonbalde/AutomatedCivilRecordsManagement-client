// src/pages/Admin/Reports/components/ChartsSection.jsx - UPDATED VERSION
import React from "react";
import RegistrationTrendChart from "./RegistrationTrendChart";
import GenderDistributionChart from "./GenderDistributionChart";
import MonthlySummaryChart from "./MonthlySummaryChart";
import RecordTypeDistributionChart from "./RecordTypeDistributionChart";

const ChartsSection = ({ 
  trendsData, 
  genderData, 
  monthlyData, 
  recordTypeData, 
  loading, 
  filters 
}) => {
  const ChartsSkeleton = () => (
    <div className="col-12 col-lg-6">
      <div className="card shadow border-0 h-100">
        <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
          <div className="skeleton-line" style={{ width: "60%", height: "20px" }}></div>
        </div>
        <div className="card-body">
          <div className="skeleton-chart" style={{ height: "300px", width: "100%" }}></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="row mb-4 g-4">
        <ChartsSkeleton />
        <ChartsSkeleton />
        <ChartsSkeleton />
        <ChartsSkeleton />
      </div>
    );
  }

  return (
    <div className="row mb-4 g-4">
      {/* Registration Trends Chart */}
      <div className="col-12 col-lg-8">
        <div className="card shadow border-0 h-100">
          <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
            <h6 className="card-title mb-0">
              <i className="fas fa-chart-line me-2"></i>
              Registration Trends - {filters.recordType === 'all' ? 'All Records' : filters.recordType} ({filters.period === 'monthly' ? 'Monthly' : 'Yearly'})
            </h6>
          </div>
          <div className="card-body">
            <RegistrationTrendChart 
              data={trendsData} 
              period={filters.period}
              recordType={filters.recordType}
            />
          </div>
        </div>
      </div>

      {/* Record Type Distribution Chart */}
      <div className="col-12 col-lg-4">
        <div className="card shadow border-0 h-100">
          <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
            <h6 className="card-title mb-0">
              <i className="fas fa-chart-pie me-2"></i>
              Record Type Distribution
            </h6>
          </div>
          <div className="card-body">
            <RecordTypeDistributionChart data={recordTypeData} />
          </div>
        </div>
      </div>

      {/* Gender Distribution Chart */}
      <div className="col-12 col-lg-6">
        <div className="card shadow border-0 h-100">
          <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
            <h6 className="card-title mb-0">
              <i className="fas fa-venus-mars me-2"></i>
              Gender Distribution (Birth Records)
            </h6>
          </div>
          <div className="card-body">
            <GenderDistributionChart data={genderData} />
          </div>
        </div>
      </div>

      {/* Monthly Summary Chart */}
      <div className="col-12 col-lg-6">
        <div className="card shadow border-0 h-100">
          <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
            <h6 className="card-title mb-0">
              <i className="fas fa-calendar-alt me-2"></i>
              Monthly Summary for {filters.year}
            </h6>
          </div>
          <div className="card-body">
            <MonthlySummaryChart data={monthlyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;