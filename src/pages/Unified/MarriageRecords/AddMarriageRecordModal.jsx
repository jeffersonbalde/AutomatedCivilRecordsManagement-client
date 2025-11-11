import React, { useState, useEffect } from "react";
import Portal from "../../../components/Portal";
import { showAlert, showToast } from "../../../services/notificationService";

// Import step components
import {
  Step1BasicInfo,
  Step2HusbandInfo,
  Step3WifeInfo,
  Step4CeremonyDetails,
  Step5WitnessInfo,
  Step6Finalize,
  formatDate,
} from "./MarriageRecordStepComponents";

const AddMarriageRecordModal = ({ onClose, onSave, token }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState({
    show: false,
    message: "",
    similarRecords: [],
  });
  const [savingState, setSavingState] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    province: "",
    city_municipality: "",
    date_of_marriage: "",
    time_of_marriage: "",
    place_of_marriage: "",
    marriage_type: "",
    license_number: "",
    license_date: "",
    license_place: "",
    property_regime: "",

    // Step 2: Husband Information
    husband_first_name: "",
    husband_middle_name: "",
    husband_last_name: "",
    husband_birthdate: "",
    husband_birthplace: "",
    husband_sex: "",
    husband_citizenship: "Filipino",
    husband_religion: "",
    husband_civil_status: "",
    husband_occupation: "",
    husband_address: "",
    husband_father_name: "",
    husband_father_citizenship: "Filipino",
    husband_mother_name: "",
    husband_mother_citizenship: "Filipino",
    husband_consent_giver: "",
    husband_consent_relationship: "",
    husband_consent_address: "",

    // Step 3: Wife Information
    wife_first_name: "",
    wife_middle_name: "",
    wife_last_name: "",
    wife_birthdate: "",
    wife_birthplace: "",
    wife_sex: "",
    wife_citizenship: "Filipino",
    wife_religion: "",
    wife_civil_status: "",
    wife_occupation: "",
    wife_address: "",
    wife_father_name: "",
    wife_father_citizenship: "Filipino",
    wife_mother_name: "",
    wife_mother_citizenship: "Filipino",
    wife_consent_giver: "",
    wife_consent_relationship: "",
    wife_consent_address: "",

    // Step 4: Ceremony Details
    officiating_officer: "",
    officiant_title: "",
    officiant_license: "",
    legal_basis: "",
    legal_basis_article: "",
    marriage_remarks: "",

    // Step 5: Witness Information
    witness1_name: "",
    witness1_address: "",
    witness1_relationship: "",
    witness2_name: "",
    witness2_address: "",
    witness2_relationship: "",
  });

  const [errors, setErrors] = useState({});

  // Step configurations
  const steps = [
    { number: 1, title: "Basic Info", completed: false },
    { number: 2, title: "Husband", completed: false },
    { number: 3, title: "Wife", completed: false },
    { number: 4, title: "Ceremony", completed: false },
    { number: 5, title: "Witnesses", completed: false },
    { number: 6, title: "Finalize", completed: false },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setHasUnsavedChanges(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check for duplicates on key fields
    if (
      ["husband_first_name", "husband_last_name", "wife_first_name", "wife_last_name", "date_of_marriage"].includes(name)
    ) {
      checkForDuplicates();
    }
  };

  // Enhanced duplicate check with debouncing
  const checkForDuplicates = React.useCallback(
    async (husbandFirstName, husbandLastName, wifeFirstName, wifeLastName, dateOfMarriage) => {
      if (!husbandFirstName || !husbandLastName || !wifeFirstName || !wifeLastName || !dateOfMarriage) {
        setDuplicateAlert({ show: false, message: "", similarRecords: [] });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_LARAVEL_API}/marriage-records/check-duplicate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({
              husband_first_name: husbandFirstName,
              husband_last_name: husbandLastName,
              wife_first_name: wifeFirstName,
              wife_last_name: wifeLastName,
              date_of_marriage: dateOfMarriage,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          if (data.is_duplicate) {
            setDuplicateAlert({
              show: true,
              message: `⚠️ Duplicate record found! A marriage record for "${husbandFirstName} ${husbandLastName}" and "${wifeFirstName} ${wifeLastName}" married on ${formatDate(
                dateOfMarriage
              )} already exists in the system.`,
              similarRecords: data.similar_records || [],
              isExactDuplicate: true,
            });
          } else if (data.similar_records && data.similar_records.length > 0) {
            setDuplicateAlert({
              show: true,
              message: `ℹ️ Similar records found. Please review to avoid potential duplicates.`,
              similarRecords: data.similar_records,
              isExactDuplicate: false,
            });
          } else {
            setDuplicateAlert({ show: false, message: "", similarRecords: [] });
          }
        }
      } catch (error) {
        console.error("Error checking duplicates:", error);
      }
    },
    [token]
  );

  // Debounced duplicate check
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkForDuplicates(
        formData.husband_first_name,
        formData.husband_last_name,
        formData.wife_first_name,
        formData.wife_last_name,
        formData.date_of_marriage
      );
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    formData.husband_first_name,
    formData.husband_last_name,
    formData.wife_first_name,
    formData.wife_last_name,
    formData.date_of_marriage,
    checkForDuplicates,
  ]);

  // Enhanced duplicate alert component
  const DuplicateAlert = () => {
    if (!duplicateAlert.show) return null;

    return (
      <div
        className={`alert ${
          duplicateAlert.isExactDuplicate ? "alert-danger" : "alert-warning"
        } mb-4`}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <i
                className={`fas ${
                  duplicateAlert.isExactDuplicate
                    ? "fa-exclamation-triangle"
                    : "fa-info-circle"
                } me-2`}
              ></i>
              <strong>
                {duplicateAlert.isExactDuplicate
                  ? "Duplicate Detected!"
                  : "Similar Records Found"}
              </strong>
            </div>
            <div className="mb-2">{duplicateAlert.message}</div>

            {duplicateAlert.similarRecords.length > 0 && (
              <div className="mt-2">
                <small className="fw-semibold d-block mb-2">
                  Similar Records:
                </small>
                <div
                  className="similar-records-list"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                >
                  {duplicateAlert.similarRecords.map((record, index) => (
                    <div key={index} className="card bg-light border-0 mb-2">
                      <div className="card-body py-2">
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <strong>
                              {record.husband_first_name} {record.husband_last_name} & {record.wife_first_name} {record.wife_last_name}
                            </strong>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">
                              Married: {formatDate(record.date_of_marriage)}
                            </small>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">
                              Registry: {record.registry_number}
                            </small>
                          </div>
                          <div className="col-md-2">
                            <span className="badge bg-info">
                              {record.marriage_type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ms-3">
            {duplicateAlert.isExactDuplicate && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  // Clear the conflicting fields
                  setFormData((prev) => ({
                    ...prev,
                    husband_first_name: "",
                    husband_last_name: "",
                    wife_first_name: "",
                    wife_last_name: "",
                    date_of_marriage: "",
                  }));
                  setDuplicateAlert({
                    show: false,
                    message: "",
                    similarRecords: [],
                  });
                }}
              >
                <i className="fas fa-times me-1"></i>
                Clear Fields
              </button>
            )}
          </div>
        </div>

        {/* Mobile responsive styles */}
        <style>{`
        @media (max-width: 768px) {
          .alert .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
          }
          
          .alert .ms-3 {
            margin-left: 0 !important;
            align-self: flex-end;
          }
          
          .similar-records-list .card-body {
            padding: 0.75rem;
          }
          
          .similar-records-list .row > div {
            margin-bottom: 0.5rem;
          }
          
          .similar-records-list .col-md-4,
          .similar-records-list .col-md-3,
          .similar-records-list .col-md-2 {
            width: 100%;
          }
          
          .similar-records-list .col-md-2 {
            text-align: left;
          }
        }
      `}</style>
      </div>
    );
  };

  // Enhanced validation to prevent duplicate submission
  const validateBeforeSubmit = () => {
    if (duplicateAlert.isExactDuplicate) {
      showAlert.error(
        "Duplicate Record",
        "Cannot save record. An exact duplicate already exists in the system. Please modify the couple's names or marriage date."
      );
      return false;
    }
    return validateCurrentStep();
  };

  // Enhanced form validation with detailed error messages
  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.province.trim()) newErrors.province = "Province is required";
        if (!formData.city_municipality.trim()) newErrors.city_municipality = "City/Municipality is required";
        if (!formData.date_of_marriage) newErrors.date_of_marriage = "Date of marriage is required";
        if (!formData.time_of_marriage) newErrors.time_of_marriage = "Time of marriage is required";
        if (!formData.place_of_marriage.trim()) newErrors.place_of_marriage = "Place of marriage is required";
        if (!formData.marriage_type) newErrors.marriage_type = "Type of marriage is required";
        if (!formData.license_number.trim()) newErrors.license_number = "License number is required";
        if (!formData.license_date) newErrors.license_date = "License date is required";
        if (!formData.license_place.trim()) newErrors.license_place = "License place is required";
        if (!formData.property_regime) newErrors.property_regime = "Property regime is required";
        break;

      case 2: // Husband Information
        if (!formData.husband_first_name.trim()) newErrors.husband_first_name = "First name is required";
        if (!formData.husband_last_name.trim()) newErrors.husband_last_name = "Last name is required";
        if (!formData.husband_birthdate) newErrors.husband_birthdate = "Date of birth is required";
        if (!formData.husband_birthplace.trim()) newErrors.husband_birthplace = "Place of birth is required";
        if (!formData.husband_sex) newErrors.husband_sex = "Sex is required";
        if (!formData.husband_citizenship.trim()) newErrors.husband_citizenship = "Citizenship is required";
        if (!formData.husband_civil_status) newErrors.husband_civil_status = "Civil status is required";
        if (!formData.husband_address.trim()) newErrors.husband_address = "Address is required";
        if (!formData.husband_father_name.trim()) newErrors.husband_father_name = "Father's name is required";
        if (!formData.husband_father_citizenship.trim()) newErrors.husband_father_citizenship = "Father's citizenship is required";
        if (!formData.husband_mother_name.trim()) newErrors.husband_mother_name = "Mother's name is required";
        if (!formData.husband_mother_citizenship.trim()) newErrors.husband_mother_citizenship = "Mother's citizenship is required";
        break;

      case 3: // Wife Information
        if (!formData.wife_first_name.trim()) newErrors.wife_first_name = "First name is required";
        if (!formData.wife_last_name.trim()) newErrors.wife_last_name = "Last name is required";
        if (!formData.wife_birthdate) newErrors.wife_birthdate = "Date of birth is required";
        if (!formData.wife_birthplace.trim()) newErrors.wife_birthplace = "Place of birth is required";
        if (!formData.wife_sex) newErrors.wife_sex = "Sex is required";
        if (!formData.wife_citizenship.trim()) newErrors.wife_citizenship = "Citizenship is required";
        if (!formData.wife_civil_status) newErrors.wife_civil_status = "Civil status is required";
        if (!formData.wife_address.trim()) newErrors.wife_address = "Address is required";
        if (!formData.wife_father_name.trim()) newErrors.wife_father_name = "Father's name is required";
        if (!formData.wife_father_citizenship.trim()) newErrors.wife_father_citizenship = "Father's citizenship is required";
        if (!formData.wife_mother_name.trim()) newErrors.wife_mother_name = "Mother's name is required";
        if (!formData.wife_mother_citizenship.trim()) newErrors.wife_mother_citizenship = "Mother's citizenship is required";
        break;

      case 4: // Ceremony Details
        if (!formData.officiating_officer.trim()) newErrors.officiating_officer = "Officiating officer is required";
        break;

      case 5: // Witness Information
        if (!formData.witness1_name.trim()) newErrors.witness1_name = "Witness 1 name is required";
        if (!formData.witness1_address.trim()) newErrors.witness1_address = "Witness 1 address is required";
        if (!formData.witness2_name.trim()) newErrors.witness2_name = "Witness 2 name is required";
        if (!formData.witness2_address.trim()) newErrors.witness2_address = "Witness 2 address is required";
        break;

      case 6: // Finalize
        // No validation needed for final step, just confirmation
        break;
    }

    setErrors(newErrors);

    // Show detailed error alert if there are errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).filter((msg) => msg);
      if (errorMessages.length > 0) {
        showAlert.error(
          "Form Validation Error",
          `Please fix the following errors:\n\n• ${errorMessages.join("\n• ")}`
        );
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      // Mark current step as completed
      const updatedSteps = steps.map((step) =>
        step.number === currentStep ? { ...step, completed: true } : step
      );

      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Show saving state modal
  const showSavingModal = () => {
    setSavingState(true);
  };

  // Hide saving state modal
  const hideSavingModal = () => {
    setSavingState(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    const confirmation = await showAlert.confirm(
      "Confirm Submission",
      "Are you sure you want to save this marriage record? This action cannot be undone.",
      "Yes, Save Record",
      "Review Details"
    );

    if (!confirmation.isConfirmed) return;

    // Show processing alert for loading state
    showAlert.processing(
      "Saving Record",
      "Please wait while we save the marriage record..."
    );
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/marriage-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Close the processing alert
        showAlert.close();

        showToast.success("Marriage record saved successfully!");

        setHasUnsavedChanges(false);

        // Wait a bit before closing modal to see toast
        setTimeout(() => {
          onSave(data.data);
        }, 2000);
      } else {
        // Close the processing alert
        showAlert.close();

        if (data.errors) {
          const backendErrors = Object.values(data.errors).flat();
          showAlert.error(
            "Submission Error",
            `Please fix the following errors:\n\n• ${backendErrors.join(
              "\n• "
            )}`
          );
          setErrors(data.errors);
        } else {
          throw new Error(data.message || "Failed to save marriage record");
        }
      }
    } catch (error) {
      // Close the processing alert
      showAlert.close();

      console.error("Error saving marriage record:", error);
      showAlert.error("Error", error.message || "Failed to save marriage record");
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = async () => {
    if (hasUnsavedChanges) {
      const result = await showAlert.confirm(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to close without saving?",
        "Yes, Close",
        "Continue Editing"
      );

      if (!result.isConfirmed) return;
    }

    onClose();
  };

  // Effect for escape key and body scroll
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && !loading) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    };
  }, [loading, hasUnsavedChanges]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 2:
        return (
          <Step2HusbandInfo
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <Step3WifeInfo
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 4:
        return (
          <Step4CeremonyDetails
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 5:
        return (
          <Step5WitnessInfo
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 6:
        return <Step6Finalize formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Portal>
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div
            className="modal-content border-0"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              id="marriage-record-modal-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-plus me-2"></i>
                Add New Marriage Record
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
                aria-label="Close"
                disabled={loading}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Modal Body */}
              <div
                className="modal-body"
                style={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <DuplicateAlert />

                {/* Responsive Stepper */}
                <div className="stepper-container mb-4">
                  <div className="stepper-responsive">
                    {steps.map((step) => (
                      <div
                        key={step.number}
                        className={`step-responsive ${
                          currentStep === step.number ? "active" : ""
                        } ${step.completed ? "completed" : ""}`}
                        data-step={step.number}
                      >
                        <div className="step-circle">
                          <span>{step.number}</span>
                        </div>
                        <div className="step-title">{step.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                {renderStepContent()}
              </div>

              {/* Footer */}
              <div className="modal-footer border-top bg-white">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={currentStep === 1 ? handleClose : prevStep}
                  disabled={loading}
                >
                  {currentStep === 1 ? "Cancel" : "Previous"}
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    className="btn btn-primary next-button"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    Next <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success save-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Record
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Saving State Modal */}
      {savingState && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0">
              <div className="modal-body text-center p-4">
                <div
                  className="spinner-border text-primary mb-3"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Saving...</span>
                </div>
                <h5 className="mb-2">Saving Record</h5>
                <p className="text-muted mb-0">
                  Please wait while we save the marriage record...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
  /* Force solid color header with maximum specificity */
  #marriage-record-modal-header {
    background: #018181 !important;
    background-image: none !important;
    background-color: #018181 !important;
  }
  
  /* Override any potential gradient from parent or Bootstrap classes */
  .modal-header#marriage-record-modal-header {
    background: #018181 !important;
    background-image: none !important;
    background-color: #018181 !important;
  }
  
  /* Nuclear option - target any modal header with this ID */
  div#marriage-record-modal-header.modal-header {
    background: #018181 !important;
    background-image: none !important;
    background-color: #018181 !important;
  }
  
  /* Remove any gradient images or overlays */
  #marriage-record-modal-header::before,
  #marriage-record-modal-header::after {
    display: none !important;
    background-image: none !important;
  }
  
  /* Ensure no background images are applied */
  #marriage-record-modal-header {
    background-image: none !important;
  }

  /* Responsive Stepper Styles */
  .stepper-container {
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .stepper-responsive {
    display: flex;
    justify-content: space-between;
    min-width: 600px;
    position: relative;
    padding: 0 20px;
  }

  .stepper-responsive::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50px;
    right: 50px;
    height: 2px;
    background: #dee2e6;
    z-index: 1;
  }

  .step-responsive {
    position: relative;
    z-index: 2;
    text-align: center;
    flex: 1;
    min-width: 80px;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    background: white;
    border: 2px solid #dee2e6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
    font-weight: bold;
    transition: all 0.3s;
  }

  .step-responsive.active .step-circle {
    background: #018181;
    border-color: #018181;
    color: white;
  }

  .step-responsive.completed .step-circle {
    background: #018181;
    border-color: #018181;
    color: white;
  }

  .step-title {
    font-size: 0.75rem;
    color: #6c757d;
    transition: all 0.3s;
    font-weight: 500;
  }

  .step-responsive.active .step-title {
    color: #018181;
    font-weight: 600;
  }

  .step-responsive.completed .step-title {
    color: #018181;
    font-weight: 600;
  }

  /* Button Styles */
  .next-button, .save-button {
    background-color: #018181 !important;
    border-color: #018181 !important;
    color: white !important;
    transition: all 0.3s ease;
  }

  .next-button:hover, .save-button:hover {
    background-color: #016767 !important;
    border-color: #016767 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(1, 129, 129, 0.3);
  }

  .next-button:active, .save-button:active {
    background-color: #015555 !important;
    border-color: #015555 !important;
    transform: translateY(0);
  }

  .next-button:disabled, .save-button:disabled {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
    transform: none;
    box-shadow: none;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .modal-xl {
      max-width: 95%;
      margin: 10px auto;
    }
    
    .stepper-responsive {
      min-width: 500px;
      padding: 0 10px;
    }
    
    .step-responsive {
      min-width: 60px;
    }
    
    .step-circle {
      width: 35px;
      height: 35px;
      font-size: 0.9rem;
    }
    
    .step-title {
      font-size: 0.7rem;
    }
    
    .stepper-responsive::before {
      left: 30px;
      right: 30px;
      top: 17px;
    }
  }

  @media (max-width: 576px) {
    .modal-xl {
      max-width: 100%;
      margin: 0;
    }
    
    .stepper-responsive {
      min-width: 400px;
    }
    
    .step-responsive {
      min-width: 50px;
    }
    
    .step-circle {
      width: 30px;
      height: 30px;
      font-size: 0.8rem;
    }
    
    .step-title {
      font-size: 0.65rem;
    }
    
    .stepper-responsive::before {
      left: 25px;
      right: 25px;
      top: 15px;
    }
    
    .modal-body {
      padding: 15px;
    }
  }

  .form-step {
    display: none;
  }

  .form-step.active {
    display: block;
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Custom scrollbar for stepper */
  .stepper-container::-webkit-scrollbar {
    height: 6px;
  }

  .stepper-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .stepper-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .stepper-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`}</style>
    </Portal>
  );
};

export default AddMarriageRecordModal;