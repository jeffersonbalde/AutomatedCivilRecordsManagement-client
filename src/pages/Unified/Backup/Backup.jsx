// src/pages/Admin/Backup/Backup.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert, showToast } from "../../../services/notificationService";
import BackupInfo from "./BackupInfo";
import BackupActions from "./BackupActions";
import BackupList from "./BackupList";

const Backup = () => {
  const { token } = useAuth();
  const [backupInfo, setBackupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => {
    fetchBackupInfo();
  }, []);

  const fetchBackupInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/backup/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBackupInfo(data.data);
      } else {
        throw new Error("Failed to fetch backup information");
      }
    } catch (error) {
      console.error("Error fetching backup info:", error);
      showAlert.error("Error", "Failed to load backup information");
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (backupType = 'database') => {
    setCreatingBackup(true);
    showAlert.processing("Creating Backup", "Please wait while we create the backup...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/backup/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ type: backupType }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showAlert.close();
        showToast.success("Backup created successfully!");
        fetchBackupInfo(); // Refresh the list
      } else {
        throw new Error(data.message || "Backup creation failed");
      }
    } catch (error) {
      showAlert.close();
      console.error("Error creating backup:", error);
      showAlert.error("Error", error.message || "Failed to create backup");
    } finally {
      setCreatingBackup(false);
    }
  };

  const downloadBackup = async (filename) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/backup/download/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast.success("Backup download started!");
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Error downloading backup:", error);
      showAlert.error("Error", "Failed to download backup");
    }
  };

  const deleteBackup = async (filename) => {
    const confirmation = await showAlert.confirm(
      "Delete Backup",
      `Are you sure you want to delete backup file "${filename}"? This action cannot be undone.`,
      "Yes, Delete",
      "Cancel",
      "warning"
    );

    if (!confirmation.isConfirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/backup/delete/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast.success("Backup deleted successfully!");
        fetchBackupInfo(); // Refresh the list
      } else {
        throw new Error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting backup:", error);
      showAlert.error("Error", error.message || "Failed to delete backup");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container-fluid px-1 fadeIn">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">Data Backup & Recovery</h1>
          <p className="text-muted mb-0">
            Manage database backups and ensure data safety
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={fetchBackupInfo}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      {/* Backup Information */}
      <BackupInfo 
        backupInfo={backupInfo}
        loading={loading}
        formatFileSize={formatFileSize}
      />

      {/* Backup Actions */}
      <BackupActions 
        onCreateBackup={createBackup}
        creatingBackup={creatingBackup}
      />

      {/* Backup List */}
      <BackupList 
        backups={backupInfo?.backups || []}
        loading={loading}
        onDownloadBackup={downloadBackup}
        onDeleteBackup={deleteBackup}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

export default Backup;