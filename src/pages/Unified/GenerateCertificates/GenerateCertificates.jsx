// src/pages/Unified/GenerateCertificates/GenerateCertificates.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { showAlert, showToast } from "../../../services/notificationService";
import CertificateSearch from "./CertificateSearch";
import CertificatePreview from "./CertificatePreview";
import CertificateIssuanceForm from "./CertificateIssuanceForm";
import PrintableCertificate from "./PrintableCertificate";

const GenerateCertificates = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [certificateType, setCertificateType] = useState("birth");
  const [showPreview, setShowPreview] = useState(false);
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);
  const [showPrintableCertificate, setShowPrintableCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [issuedCertificateData, setIssuedCertificateData] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionLock, setActionLock] = useState(false);

  const isActionDisabled = (actionId = null) => {
    return actionLock || (actionLoading && actionLoading !== actionId);
  };

  // Load all records when certificate type changes
  useEffect(() => {
    fetchAllRecords();
  }, [certificateType]);

  // Filter records when search criteria change
  const handleSearch = (searchCriteria) => {
    if (isActionDisabled()) {
      showToast.warning("Please wait until the current action completes");
      return;
    }

    let filtered = [...allRecords];

    // Search by name
    if (searchCriteria.name.trim()) {
      const searchTerm = searchCriteria.name.toLowerCase();
      filtered = filtered.filter((record) => {
        const searchFields = getSearchFields(record);
        return searchFields.some(
          (field) => field && field.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Search by registry number
    if (searchCriteria.registry_number.trim()) {
      const registrySearch = searchCriteria.registry_number.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.registry_number &&
          record.registry_number.toLowerCase().includes(registrySearch)
      );
    }

    // Filter by date range
    if (searchCriteria.date_from || searchCriteria.date_to) {
      filtered = filtered.filter((record) => {
        const recordDate = getRecordDate(record);
        if (!recordDate) return false;

        const recordDateObj = new Date(recordDate);
        const fromDate = searchCriteria.date_from
          ? new Date(searchCriteria.date_from)
          : null;
        const toDate = searchCriteria.date_to
          ? new Date(searchCriteria.date_to)
          : null;

        if (fromDate && recordDateObj < fromDate) return false;
        if (toDate && recordDateObj > toDate) return false;
        return true;
      });
    }

    setFilteredRecords(filtered);
  };

  const getSearchFields = (record) => {
    switch (certificateType) {
      case "birth":
        return [
          record.child_first_name,
          record.child_last_name,
          record.child_middle_name,
          record.mother?.first_name,
          record.mother?.last_name,
          record.father?.first_name,
          record.father?.last_name,
        ];
      case "marriage":
        return [
          record.husband_name,
          record.wife_name,
          record.husband_first_name,
          record.husband_last_name,
          record.wife_first_name,
          record.wife_last_name,
        ];
      case "death":
        return [
          record.first_name,
          record.middle_name,
          record.last_name,
        ];
      default:
        return [];
    }
  };

  const getRecordDate = (record) => {
    switch (certificateType) {
      case "birth":
        return record.date_of_birth;
      case "marriage":
        return record.date_of_marriage;
      case "death":
        return record.date_of_death;
      default:
        return null;
    }
  };

  const fetchAllRecords = async () => {
    if (isActionDisabled()) {
      showToast.warning("Please wait until the current action completes");
      return;
    }

    setLoading(true);
    setActionLock(true);
    try {
      const endpoint = getSearchEndpoint(certificateType);
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const records = data.data || [];
        setAllRecords(records);
        setFilteredRecords(records);
        setSelectedRecord(null);
        setCertificateData(null);

        if (records.length === 0) {
          showToast.info(`No ${certificateType} records found`);
        } else {
          showToast.success(
            `Loaded ${records.length} ${certificateType} records`
          );
        }
      } else {
        throw new Error("Failed to fetch records");
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      showAlert.error("Error", `Failed to load ${certificateType} records`);
      setAllRecords([]);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
      setActionLock(false);
    }
  };

  const getSearchEndpoint = (type) => {
    const endpoints = {
      birth: "birth-records",
      marriage: "marriage-records",
      death: "death-records",
    };
    return endpoints[type] || "birth-records";
  };

  const handleCertificateTypeChange = (newType) => {
    if (isActionDisabled()) {
      showToast.warning("Please wait until the current action completes");
      return;
    }
    setCertificateType(newType);
    setSelectedRecord(null);
    setCertificateData(null);
  };

const handleRecordSelect = (record) => {
  if (isActionDisabled()) {
    showToast.warning("Please wait until the current action completes");
    return;
  }
  setSelectedRecord(record);
  generateCertificateData(record);
};

  // Helper function to calculate age
  const calculateAge = (birthdate) => {
    if (!birthdate) return "______";
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const generateCertificateData = (record) => {
    const baseData = {
      certificate_type: certificateType,
      record: record,
      issued_date: new Date().toISOString().split("T")[0],
      certificate_number: generateCertificateNumber(),
    };

    switch (certificateType) {
      case "birth":
        setCertificateData({
          ...baseData,
          template_data: generateBirthCertificateData(record),
        });
        break;
      case "marriage":
        setCertificateData({
          ...baseData,
          template_data: generateMarriageCertificateData(record),
        });
        break;
      case "death":
        setCertificateData({
          ...baseData,
          template_data: generateDeathCertificateData(record),
        });
        break;
      default:
        setCertificateData(baseData);
    }
  };

const generateCertificateNumber = () => {
  const prefix = {
    birth: "BTC",
    marriage: "MTC",
    death: "DTC",
  }[certificateType];

  // Add a random component to ensure uniqueness even for same record
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

  const generateBirthCertificateData = (record) => {
    return {
      // Header
      form_number: "Civil Registry Form No. 1A (Birth-Available)",
      office_name: "CITY CIVIL REGISTRY OFFICE PAGADIAN CITY",
      office_address:
        "City Hall Complex, Pagadian City Tel. No. (062) 214-1886",
      current_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),

      // Record details
      page_number: record.page_number || "______",
      book_number: record.book_number || "______",
      registry_number: record.registry_number,
      date_of_registration: formatDate(record.date_registered),
      prn: record.prn || "NONE",

      // Child information
      child_name: `${record.child_first_name || ""} ${
        record.child_middle_name || ""
      } ${record.child_last_name || ""}`.trim(),
      sex: record.sex || "______",
      date_of_birth: formatDate(record.date_of_birth),
      place_of_birth: record.place_of_birth || "______",

      // Parent information
      mother_name: record.mother?.first_name
        ? `${record.mother.first_name} ${record.mother.middle_name || ""} ${
            record.mother.last_name || ""
          }`.trim()
        : "______",
      mother_citizenship: record.mother?.citizenship || "Filipino",

      father_name: record.father?.first_name
        ? `${record.father.first_name} ${record.father.middle_name || ""} ${
            record.father.last_name || ""
          }`.trim()
        : "______",
      father_citizenship: record.father?.citizenship || "Filipino",

      // Marriage details
      marriage_date: record.parents_marriage?.marriage_date
        ? formatDate(record.parents_marriage.marriage_date)
        : "______",
      marriage_place: record.parents_marriage?.marriage_place_city
        ? `${record.parents_marriage.marriage_place_city}, ${
            record.parents_marriage.marriage_place_province || ""
          }`.trim()
        : "______",

      // Issuance details (to be filled in issuance form)
      issued_to: "__________________________",
      amount_paid: "______",
      or_number: "______",
      date_paid: "______",

      // Signatories
      verified_by: "JUNALYN R. TUBIGON",
      verified_by_title: "Clerk",
      approved_by: "ELMERA V. BROCA",
      approved_by_title: "OIC-CITY CIVIL REGISTRAR",
    };
  };

  const generateMarriageCertificateData = (record) => {
    const husbandAge = calculateAge(record.husband_birthdate);
    const wifeAge = calculateAge(record.wife_birthdate);

    return {
      form_number: "Civil Registry Form No. 3A (Marriage-Available)",
      office_name: "CITY CIVIL REGISTRY OFFICE CITY OF PAGADIAN",
      office_address:
        "City Hall Complex, Pagadian City Tel. No. (062) 214-1886",
      current_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),

      // Record details
      page_number: record.page_number || "______",
      book_number: record.book_number || "______",
      registry_number: record.registry_number,
      date_of_registration: formatDate(record.date_registered),
      date_of_marriage: formatDate(record.date_of_marriage),
      place_of_marriage: record.place_of_marriage || "______",

      // Husband information
      husband_name: record.husband_first_name || record.husband_name || "______",
      husband_age: husbandAge,
      husband_citizenship: record.husband_citizenship || "Filipino",
      husband_civil_status: record.husband_civil_status || "______",
      husband_mother: record.husband_mother_name || "______",
      husband_father: record.husband_father_name || "______",

      // Wife information
      wife_name: record.wife_first_name || record.wife_name || "______",
      wife_age: wifeAge,
      wife_citizenship: record.wife_citizenship || "Filipino",
      wife_civil_status: record.wife_civil_status || "______",
      wife_mother: record.wife_mother_name || "______",
      wife_father: record.wife_father_name || "______",

      // Issuance details
      issued_to: "__________________________",
      amount_paid: "______",
      or_number: "______",
      date_paid: "______",

      // Signatories
      verified_by: "JUNALYN R. TUBIGON",
      verified_by_title: "Clerk",
      approved_by: "ELMERA V. BROCA",
      approved_by_title: "OIC-CITY CIVIL REGISTRAR",
    };
  };

  const generateDeathCertificateData = (record) => {
    const age = calculateAge(record.date_of_birth);

    return {
      form_number: "Civil Registry Form No. 2A (Death-Available)",
      office_name: "CITY CIVIL REGISTRY OFFICE CITY OF PAGADIAN",
      office_address:
        "City Hall Complex, Pagadian City Tel. No. (062) 214-1886",
      current_date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),

      // Record details
      page_number: record.page_number || "______",
      book_number: record.book_number || "______",
      registry_number: record.registry_number,
      date_of_registration: formatDate(record.date_registered),

      // Deceased information
      deceased_name: `${record.first_name || ""} ${record.middle_name || ""} ${record.last_name || ""}`.trim(),
      sex: record.sex || "______",
      age: age,
      civil_status: record.civil_status || "______",
      citizenship: record.citizenship || "Filipino",
      date_of_death: formatDate(record.date_of_death),
      place_of_death: record.place_of_death || "______",
      cause_of_death: record.immediate_cause || "______",

      // Issuance details
      issued_to: "__________________________",
      amount_paid: "______",
      or_number: "______",
      date_paid: "______",

      // Signatories
      verified_by: "JUNALYN R. TUBIGON",
      verified_by_title: "Clerk",
      approved_by: "ELMERA V. BROCA",
      approved_by_title: "OIC-CITY CIVIL REGISTRAR",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "______";
    try {
      return new Date(dateString)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        .toUpperCase();
    } catch (error) {
      return "______";
    }
  };

  const handlePreview = () => {
    if (isActionDisabled()) {
      showToast.warning("Please wait until the current action completes");
      return;
    }
    if (!selectedRecord) {
      showToast.warning("Please select a record first");
      return;
    }
    setShowPreview(true);
  };

  const handleGenerateCertificate = () => {
    if (isActionDisabled()) {
      showToast.warning("Please wait until the current action completes");
      return;
    }
    if (!selectedRecord) {
      showToast.warning("Please select a record first");
      return;
    }
    setShowIssuanceForm(true);
  };

// Also update the handleCertificateIssued function to handle backend validation better
const handleCertificateIssued = async (issuanceData) => {
  setActionLoading("issuance");
  setActionLock(true);

  try {
    // Generate a NEW certificate number for each issuance (even for same record)
    const newCertificateNumber = generateCertificateNumber();
    
    // Update certificate data with issuance details and new certificate number
    const updatedCertificateData = {
      ...certificateData,
      certificate_number: newCertificateNumber, // Use new unique number
      issuance: issuanceData,
      template_data: {
        ...certificateData.template_data,
        issued_to: issuanceData.issued_to,
        amount_paid: issuanceData.amount_paid.toString(),
        or_number: issuanceData.or_number,
        date_paid: formatDate(issuanceData.date_paid),
        verified_by: issuanceData.verified_by,
      },
    };

    setCertificateData(updatedCertificateData);
    setIssuedCertificateData({
      certificateData: updatedCertificateData,
      issuanceData: issuanceData
    });

    // Log the issuance to database with the new certificate number
    await logCertificateIssuance({
      ...issuanceData,
      certificate_number: newCertificateNumber // Use new number here too
    });

    setShowIssuanceForm(false);
    setShowPrintableCertificate(true);
    showToast.success("Certificate issued successfully!");
  } catch (error) {
    console.error("Error in certificate issuance:", error);
    
    // More specific error handling
    if (error.errors && error.errors.certificate_number) {
      showToast.error("Certificate number already exists. Please try again.");
    } else if (error.message) {
      showToast.error(error.message);
    } else {
      showToast.error("Failed to issue certificate. Please try again.");
    }
    throw error;
  } finally {
    setActionLoading(null);
    setActionLock(false);
  }
};

// Also update the logCertificateIssuance function to handle errors better
const logCertificateIssuance = async (issuanceData) => {
  try {
    const payload = {
      certificate_type: certificateType,
      record_id: selectedRecord.id,
      certificate_number: issuanceData.certificate_number, // Use the passed certificate number
      issued_to: issuanceData.issued_to,
      amount_paid: issuanceData.amount_paid,
      or_number: issuanceData.or_number,
      date_paid: issuanceData.date_paid,
      purpose: issuanceData.purpose,
    };

    const response = await fetch(
      `${import.meta.env.VITE_LARAVEL_API}/certificate-issuance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", responseText);
      throw new Error("Server returned invalid response");
    }

    if (!response.ok) {
      console.error("Backend Validation Errors:", result.errors);
      const error = new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
      error.errors = result.errors;
      throw error;
    }

    return result;
  } catch (error) {
    console.error("❌ Error logging certificate issuance:", error);
    throw error;
  }
};

  const clearSelection = () => {
    if (isActionDisabled()) {
      showToast.warning("Please wait until the current action completes");
      return;
    }
    setSelectedRecord(null);
    setCertificateData(null);
  };

  return (
    <div className="container-fluid px-1 fadeIn">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 mb-1 text-dark">Generate Certificates</h1>
          <p className="text-muted mb-0">
            Search records and generate certified true copies
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {selectedRecord && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearSelection}
              disabled={isActionDisabled()}
            >
              <i className="fas fa-times me-1"></i>Clear Selection
            </button>
          )}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchAllRecords}
            disabled={isActionDisabled()}
          >
            <i className="fas fa-sync-alt me-1"></i>Refresh
          </button>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Search and Results */}
        <div className="col-12 col-lg-6">
          <CertificateSearch
            certificateType={certificateType}
            onCertificateTypeChange={handleCertificateTypeChange}
            onSearch={handleSearch}
            searchResults={filteredRecords}
            loading={loading}
            onRecordSelect={handleRecordSelect}
            selectedRecord={selectedRecord}
            isActionDisabled={isActionDisabled}
            totalRecords={allRecords.length}
            filteredRecordsCount={filteredRecords.length}
          />
        </div>

        {/* Right Column - Preview and Actions */}
        <div className="col-12 col-lg-6">
          <div className="card shadow border-0 h-100">
            <div
              className="card-header py-3 text-white"
              style={{ backgroundColor: "#018181" }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                <h6 className="card-title mb-0">
                  <i className="fas fa-certificate me-2"></i>
                  Certificate Generation
                </h6>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={fetchAllRecords}
                  disabled={isActionDisabled()}
                  style={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                  }}
                >
                  <i className="fas fa-sync-alt me-1"></i>Refresh
                </button>
              </div>
            </div>
            <div className="card-body">
              {!selectedRecord ? (
                <div className="text-center py-5">
                  <i className="fas fa-certificate fa-4x text-muted opacity-50 mb-4"></i>
                  <h5 className="text-muted mb-3">No Record Selected</h5>
                  <p className="text-muted">
                    Select a record from the list to generate a certificate
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                    <h5 className="text-success">Record Selected</h5>
                    <p className="text-muted">
                      {certificateType.toUpperCase()} Record -{" "}
                      {selectedRecord.registry_number}
                    </p>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handlePreview}
                      disabled={isActionDisabled()}
                      style={{
                        backgroundColor: "#018181",
                        borderColor: "#018181",
                      }}
                    >
                      <i className="fas fa-eye me-2"></i>Preview Certificate
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={handleGenerateCertificate}
                      disabled={isActionDisabled()}
                      style={{
                        backgroundColor: "#198754",
                        borderColor: "#198754",
                      }}
                    >
                      <i className="fas fa-print me-2"></i>Generate Certificate
                    </button>
                  </div>

                  {certificateData && (
                    <div className="mt-4 p-3 bg-light rounded">
                      <small className="text-muted">
                        <strong>Certificate Number:</strong>{" "}
                        {certificateData.certificate_number}
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Action Lock Overlay */}
      {actionLock && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div className="bg-white rounded p-3 shadow-sm d-flex align-items-center">
            <div
              className="spinner-border me-2"
              style={{ color: "#018181" }}
              role="status"
            ></div>
            <span className="text-muted">Processing action...</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPreview && certificateData && (
        <CertificatePreview
          certificateData={certificateData}
          onClose={() => setShowPreview(false)}
          onGenerate={() => {
            setShowPreview(false);
            setShowIssuanceForm(true);
          }}
        />
      )}

      {showIssuanceForm && certificateData && (
        <CertificateIssuanceForm
          certificateData={certificateData}
          onClose={() => setShowIssuanceForm(false)}
          onIssue={handleCertificateIssued}
          loading={actionLoading === "issuance"}
        />
      )}

      {showPrintableCertificate && issuedCertificateData && (
        <PrintableCertificate
          certificateData={issuedCertificateData.certificateData}
          issuanceData={issuedCertificateData.issuanceData}
          onClose={() => setShowPrintableCertificate(false)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default GenerateCertificates;