import React from 'react';

const LoadingAuthentication = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">Checking authentication...</h5>
      </div>
    </div>
  );
};

export default LoadingAuthentication;