// src/pages/Admin/Backup/components/BackupActions.jsx
import React, { useState } from "react";

const BackupActions = ({ onCreateBackup, creatingBackup }) => {
  const handleCreateBackup = () => {
    onCreateBackup('database');
  };

  return (
    <div className="card shadow border-0 mb-4">
      <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
        <h6 className="card-title mb-0">
          <i className="fas fa-plus-circle me-2"></i>
          Create New Backup
        </h6>
      </div>
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold mb-1">
              Backup Type
            </label>
            <input
              type="text"
              className="form-control"
              value="Database Only"
              readOnly
              disabled
              style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
            />
            <small className="text-muted">
              Backup only database records
            </small>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold mb-1">
              Backup Schedule
            </label>
            <input
              type="text"
              className="form-control"
              value="Manual Backup"
              readOnly
              disabled
              style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
            />
            <small className="text-muted">
              Manual backup creation
            </small>
          </div>

          <div className="col-12 col-md-4">
            <button
              className="btn btn-success w-100"
              onClick={handleCreateBackup}
              disabled={creatingBackup}
              style={{
                backgroundColor: creatingBackup ? '#6c757d' : '#018181',
                borderColor: creatingBackup ? '#6c757d' : '#018181'
              }}
              onMouseOver={(e) => {
                if (!creatingBackup) {
                  e.target.style.backgroundColor = '#016767';
                  e.target.style.borderColor = '#016767';
                }
              }}
              onMouseOut={(e) => {
                if (!creatingBackup) {
                  e.target.style.backgroundColor = '#018181';
                  e.target.style.borderColor = '#018181';
                }
              }}
            >
              {creatingBackup ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Backup...
                </>
              ) : (
                <>
                  <i className="fas fa-database me-2"></i>
                  Create Backup Now
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 p-3 bg-light rounded">
          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold text-primary">Secure</div>
              <small className="text-muted">Encrypted backups</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-info">Reliable</div>
              <small className="text-muted">Verified integrity</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-success">Fast</div>
              <small className="text-muted">Quick restoration</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupActions;