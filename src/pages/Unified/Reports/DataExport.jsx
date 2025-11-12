// src/pages/Admin/Reports/components/DataExport.jsx - FIXED STYLING
import React, { useState } from "react";
import { showAlert, showToast } from "../../../services/notificationService";

const DataExport = ({ token, filters }) => {
  const [exporting, setExporting] = useState(false);
  const [exportingType, setExportingType] = useState('');

  const handleExport = async (format, type = 'all') => {
    setExporting(true);
    setExportingType(type);
    showAlert.processing("Exporting Data", "Please wait while we prepare your export...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/reports/export-data?format=${format}&year=${filters.year}&type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        
        // Check if blob is empty
        if (blob.size === 0) {
          throw new Error("Export returned empty file");
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `civil-registry-${type}-${filters.year}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showAlert.close();
        showToast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully as ${format.toUpperCase()}!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Export failed");
      }
    } catch (error) {
      showAlert.close();
      console.error("Error exporting data:", error);
      showAlert.error("Error", error.message || "Failed to export data");
    } finally {
      setExporting(false);
      setExportingType('');
    }
  };

  const ExportCard = ({ type, icon, color, title }) => (
    <div className="col-md-4 mb-3">
      <div className="card border h-100">
        <div className="card-body text-center d-flex flex-column">
          <i className={`${icon} fa-2x mb-2`} style={{ color }}></i>
          <h6 className="flex-grow-1">{title}</h6>
          <button
            className={`btn btn-sm w-100 ${exporting && exportingType === type ? 'btn-secondary' : `btn-outline-${color}`}`}
            onClick={() => handleExport('csv', type)}
            disabled={exporting}
            style={{
              borderColor: color,
              color: exporting && exportingType === type ? '#6c757d' : color
            }}
          >
            {exporting && exportingType === type ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Exporting...
              </>
            ) : (
              `Export ${title} Data`
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card shadow border-0">
      <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
        <h6 className="card-title mb-0">
          <i className="fas fa-download me-2"></i>
          Data Export
        </h6>
      </div>
      <div className="card-body">
        <div className="row align-items-center mb-4">
          <div className="col-md-8">
            <h6 className="mb-1">Export All Data</h6>
            <p className="text-muted mb-0 small">
              Download comprehensive reports for all record types in various formats.
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleExport('csv', 'all')}
                disabled={exporting}
              >
                <i className="fas fa-file-csv me-1"></i>
                CSV
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleExport('pdf', 'all')}
                disabled={exporting}
              >
                <i className="fas fa-file-pdf me-1"></i>
                PDF
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleExport('excel', 'all')}
                disabled={exporting}
              >
                <i className="fas fa-file-excel me-1"></i>
                Excel
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <ExportCard 
            type="birth" 
            icon="fas fa-baby" 
            color="primary" 
            title="Birth Records" 
          />
          <ExportCard 
            type="marriage" 
            icon="fas fa-heart" 
            color="pink" 
            title="Marriage Records" 
          />
          <ExportCard 
            type="death" 
            icon="fas fa-cross" 
            color="secondary" 
            title="Death Records" 
          />
        </div>
        
        {exporting && (
          <div className="mt-3">
            <div className="progress">
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                style={{ backgroundColor: "#018181", width: "100%" }}
              ></div>
            </div>
            <small className="text-muted mt-1 d-block text-center">
              Preparing your export file... This may take a few moments.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExport;