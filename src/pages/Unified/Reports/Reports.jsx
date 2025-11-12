// src/pages/Admin/Reports/Reports.jsx - UPDATED VERSION
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert } from "../../../services/notificationService";
import StatisticsCards from "./StatisticsCards";
import ChartsSection from "./ChartsSection";
import DataExport from "./DataExport";
import ReportFilters from "./ReportFilters";

const Reports = () => {
  const { token } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recordTypeData, setRecordTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    period: 'monthly',
    year: new Date().getFullYear(),
    recordType: 'all' // all, birth, marriage, death
  });

  useEffect(() => {
    fetchAllReportsData();
  }, [filters]);

  const fetchAllReportsData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStatistics(),
        fetchTrendsData(),
        fetchGenderDistribution(),
        fetchMonthlySummary(),
        fetchRecordTypeDistribution()
      ]);
    } catch (error) {
      console.error("Error fetching reports data:", error);
      showAlert.error("Error", "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/reports/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data);
      } else {
        throw new Error("Failed to fetch statistics");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  };

// In src/pages/Admin/Reports/Reports.jsx - Update fetchTrendsData
const fetchTrendsData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_LARAVEL_API}/reports/registrations-trend?period=${filters.period}&year=${filters.year}&recordType=${filters.recordType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setTrendsData(data.data || []);
    } else {
      throw new Error("Failed to fetch trends data");
    }
  } catch (error) {
    console.error("Error fetching trends data:", error);
    throw error;
  }
};

  const fetchGenderDistribution = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/reports/gender-distribution`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGenderData(data.data || []);
      } else {
        throw new Error("Failed to fetch gender distribution");
      }
    } catch (error) {
      console.error("Error fetching gender distribution:", error);
      throw error;
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/reports/monthly-summary?year=${filters.year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMonthlyData(data.data || []);
      } else {
        throw new Error("Failed to fetch monthly summary");
      }
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
      throw error;
    }
  };

  const fetchRecordTypeDistribution = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/reports/record-type-distribution`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecordTypeData(data.data || []);
      } else {
        throw new Error("Failed to fetch record type distribution");
      }
    } catch (error) {
      console.error("Error fetching record type distribution:", error);
      throw error;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const refreshData = () => {
    fetchAllReportsData();
  };

  return (
    <div className="container-fluid px-1 fadeIn">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">Civil Registry Reports & Analytics</h1>
          <p className="text-muted mb-0">
            Comprehensive overview of birth, marriage, and death registrations
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={refreshData}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Statistics Cards */}
      <StatisticsCards 
        statistics={statistics}
        loading={loading}
      />

      {/* Charts Section */}
      <ChartsSection
        trendsData={trendsData}
        genderData={genderData}
        monthlyData={monthlyData}
        recordTypeData={recordTypeData}
        loading={loading}
        filters={filters}
      />

      {/* Data Export */}
      <DataExport 
        token={token}
        filters={filters}
      />
    </div>
  );
};

export default Reports;