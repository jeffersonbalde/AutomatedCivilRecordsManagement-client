// src/pages/Unified/GenerateCertificates/components/CertificateSearch.jsx
import React, { useState } from "react";

const CertificateSearch = ({
  certificateType,
  onCertificateTypeChange,
  onSearch,
  searchResults,
  loading,
  onRecordSelect,
  selectedRecord
}) => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    registry_number: "",
    date_from: "",
    date_to: ""
  });

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchCriteria);
  };

  const clearSearch = () => {
    setSearchCriteria({
      name: "",
      registry_number: "",
      date_from: "",
      date_to: ""
    });
  };

  const getPlaceholder = () => {
    switch (certificateType) {
      case "birth":
        return "Search by child name, parent name, or registry number...";
      case "marriage":
        return "Search by spouse names or registry number...";
      case "death":
        return "Search by deceased name or registry number...";
      default:
        return "Search records...";
    }
  };

  const getDateFieldLabel = () => {
    switch (certificateType) {
      case "birth":
        return "Date of Birth";
      case "marriage":
        return "Date of Marriage";
      case "death":
        return "Date of Death";
      default:
        return "Date";
    }
  };

  const formatRecordDisplay = (record) => {
    switch (certificateType) {
      case "birth":
        return `${record.child_first_name} ${record.child_last_name} - ${record.registry_number}`;
      case "marriage":
        return `${record.husband_name} & ${record.wife_name} - ${record.registry_number}`;
      case "death":
        return `${record.deceased_name} - ${record.registry_number}`;
      default:
        return record.registry_number;
    }
  };

  return (
    <div className="card shadow border-0 mb-4">
      <div className="card-header py-3 text-white" style={{ backgroundColor: "#018181" }}>
        <h6 className="card-title mb-0">
          <i className="fas fa-search me-2"></i>
          Search Records
        </h6>
      </div>
      <div className="card-body">
        {/* Certificate Type Selection */}
        <div className="row mb-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Certificate Type</label>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                name="certificateType"
                id="birthType"
                checked={certificateType === "birth"}
                onChange={() => onCertificateTypeChange("birth")}
              />
              <label className="btn btn-outline-primary" htmlFor="birthType">
                <i className="fas fa-baby me-2"></i>Birth
              </label>

              <input
                type="radio"
                className="btn-check"
                name="certificateType"
                id="marriageType"
                checked={certificateType === "marriage"}
                onChange={() => onCertificateTypeChange("marriage")}
              />
              <label className="btn btn-outline-primary" htmlFor="marriageType">
                <i className="fas fa-heart me-2"></i>Marriage
              </label>

              <input
                type="radio"
                className="btn-check"
                name="certificateType"
                id="deathType"
                checked={certificateType === "death"}
                onChange={() => onCertificateTypeChange("death")}
              />
              <label className="btn btn-outline-primary" htmlFor="deathType">
                <i className="fas fa-cross me-2"></i>Death
              </label>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold">Search Term</label>
              <input
                type="text"
                className="form-control"
                placeholder={getPlaceholder()}
                value={searchCriteria.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Registry Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter registry number..."
                value={searchCriteria.registry_number}
                onChange={(e) => handleInputChange("registry_number", e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">{getDateFieldLabel()} From</label>
              <input
                type="date"
                className="form-control"
                value={searchCriteria.date_from}
                onChange={(e) => handleInputChange("date_from", e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">{getDateFieldLabel()} To</label>
              <input
                type="date"
                className="form-control"
                value={searchCriteria.date_to}
                onChange={(e) => handleInputChange("date_to", e.target.value)}
              />
            </div>

            <div className="col-12">
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-fill"
                  disabled={loading}
                  style={{
                    backgroundColor: "#018181",
                    borderColor: "#018181",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>Search Records
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearSearch}
                >
                  <i className="fas fa-times me-2"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-semibold mb-3">
              Search Results ({searchResults.length} records found)
            </h6>
            <div className="list-group">
              {searchResults.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    selectedRecord?.id === record.id ? 'active' : ''
                  }`}
                  onClick={() => onRecordSelect(record)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{formatRecordDisplay(record)}</span>
                    {selectedRecord?.id === record.id && (
                      <i className="fas fa-check text-success"></i>
                    )}
                  </div>
                  <small className="text-muted">
                    {certificateType === 'birth' && record.date_of_birth && 
                      `Born: ${new Date(record.date_of_birth).toLocaleDateString()}`
                    }
                    {certificateType === 'marriage' && record.date_of_marriage && 
                      `Married: ${new Date(record.date_of_marriage).toLocaleDateString()}`
                    }
                    {certificateType === 'death' && record.date_of_death && 
                      `Died: ${new Date(record.date_of_death).toLocaleDateString()}`
                    }
                  </small>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateSearch;