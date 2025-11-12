// src/pages/Admin/Reports/components/ReportFilters.jsx - UPDATED VERSION
import React from "react";

const ReportFilters = ({ filters, onFilterChange, loading }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handlePeriodChange = (period) => {
    onFilterChange({ ...filters, period });
  };

  const handleYearChange = (year) => {
    onFilterChange({ ...filters, year: parseInt(year) });
  };

  const handleRecordTypeChange = (recordType) => {
    onFilterChange({ ...filters, recordType });
  };

  return (
    <div className="card shadow border-0 mb-4">
      <div className="card-body p-3">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold mb-1">
              Report Period
            </label>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm ${
                  filters.period === 'monthly' 
                    ? 'btn-primary' 
                    : 'btn-outline-primary'
                }`}
                onClick={() => handlePeriodChange('monthly')}
                disabled={loading}
                style={{
                  backgroundColor: filters.period === 'monthly' ? '#018181' : 'transparent',
                  borderColor: '#018181',
                  color: filters.period === 'monthly' ? 'white' : '#018181'
                }}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  filters.period === 'yearly' 
                    ? 'btn-primary' 
                    : 'btn-outline-primary'
                }`}
                onClick={() => handlePeriodChange('yearly')}
                disabled={loading}
                style={{
                  backgroundColor: filters.period === 'yearly' ? '#018181' : 'transparent',
                  borderColor: '#018181',
                  color: filters.period === 'yearly' ? 'white' : '#018181'
                }}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="col-12 col-md-2">
            <label className="form-label small fw-semibold mb-1">
              Year
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.year}
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={loading}
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold mb-1">
              Record Type
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.recordType}
              onChange={(e) => handleRecordTypeChange(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Records</option>
              <option value="birth">Birth Only</option>
              <option value="marriage">Marriage Only</option>
              <option value="death">Death Only</option>
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold mb-1">
              Quick Actions
            </label>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary flex-fill"
                onClick={() => onFilterChange({
                  period: 'monthly',
                  year: currentYear,
                  recordType: 'all'
                })}
                disabled={loading}
              >
                <i className="fas fa-calendar me-1"></i>
                Current Year
              </button>
              <button
                className="btn btn-sm btn-outline-info flex-fill"
                onClick={() => onFilterChange({
                  period: 'yearly',
                  year: currentYear,
                  recordType: 'all'
                })}
                disabled={loading}
              >
                <i className="fas fa-chart-line me-1"></i>
                Yearly View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;