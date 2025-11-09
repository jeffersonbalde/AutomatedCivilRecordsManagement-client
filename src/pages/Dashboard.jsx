import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, isAdmin, isStaff } = useAuth();

  return (
    <div className="fadeIn">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <h1 className="h2">Dashboard</h1>
          <p className="mb-0">
            Welcome back, <strong>{user?.full_name || user?.username}</strong>!
          </p>
        </div>
      </div>

      <div className="row">
        {/* Quick Stats */}
        <div className="col-xl-3 col-sm-6 col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between px-md-1">
                <div>
                  <h3 className="text-primary">1,248</h3>
                  <p className="mb-0">Total Birth Records</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-birthday-cake text-primary fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between px-md-1">
                <div>
                  <h3 className="text-info">856</h3>
                  <p className="mb-0">Total Marriage Records</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-heart text-info fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between px-md-1">
                <div>
                  <h3 className="text-warning">723</h3>
                  <p className="mb-0">Total Death Records</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-cross text-warning fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between px-md-1">
                <div>
                  <h3 className="text-success">45</h3>
                  <p className="mb-0">Certificates Today</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-certificate text-success fa-3x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Recent Activities</h5>
            </div>
            <div className="card-body">
              <p>System overview and recent activities will be displayed here.</p>
              <div className="alert alert-info">
                <strong>System Status:</strong> Automated Civil Records Management & Certification Issuance System is running normally.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;   