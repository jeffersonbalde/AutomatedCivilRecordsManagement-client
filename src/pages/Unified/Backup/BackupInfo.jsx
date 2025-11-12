// src/pages/Admin/Backup/components/BackupInfo.jsx
import React from "react";

const BackupInfo = ({ backupInfo, loading, formatFileSize }) => {
  const InfoCardSkeleton = () => (
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
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
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
                  Database Size
                </div>
                <div className="h4 mb-0 fw-bold" style={{ color: "#018181" }}>
                  {formatFileSize(backupInfo?.database_size || 0)}
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
                  Backup Files
                </div>
                <div className="h4 mb-0 fw-bold text-info">
                  {backupInfo?.backup_count || 0}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-copy fa-lg text-info opacity-70"></i>
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
                  Last Backup
                </div>
                <div className="h6 mb-0 fw-bold text-success">
                  {backupInfo?.last_backup 
                    ? new Date(backupInfo.last_backup).toLocaleDateString()
                    : 'Never'
                  }
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-history fa-lg text-success opacity-70"></i>
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
                  Total Backup Size
                </div>
                <div className="h4 mb-0 fw-bold text-warning">
                  {formatFileSize(
                    backupInfo?.backups?.reduce((total, backup) => total + backup.size, 0) || 0
                  )}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-hdd fa-lg text-warning opacity-70"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupInfo;