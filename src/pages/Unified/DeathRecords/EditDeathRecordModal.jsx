// src/pages/DeathRecords/components/EditDeathRecordModal.jsx
import React, { useState, useEffect } from "react";
import Portal from "../../../components/Portal";
import { showAlert, showToast } from "../../../services/notificationService";

// Import the same step components from AddDeathRecordModal
import {
  Step1PersonalInfo,
  Step2MedicalInfo,
  Step3DeathCertification,
  Step4BurialDetails,
  Step5InformantInfo,
  Step6Finalize,
  formatDate
} from "./DeathRecordStepComponents";

const EditDeathRecordModal = ({ record, onClose, onUpdate, token }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState({ show: false, message: "", similarRecords: [] });
  
  // Form data state - pre-populated with record data
  const [formData, setFormData] = useState({
    // Initialize with empty values first
    first_name: "",
    middle_name: "",
    last_name: "",
    sex: "",
    civil_status: "",
    date_of_death: "",
    date_of_birth: "",
    age_years: "",
    age_months: "",
    age_days: "",
    age_hours: "",
    age_minutes: "",
    age_under_1: false,
    place_of_death: "",
    religion: "",
    citizenship: "Filipino",
    residence: "",
    occupation: "",
    father_name: "",
    mother_maiden_name: "",
    immediate_cause: "",
    antecedent_cause: "",
    underlying_cause: "",
    other_significant_conditions: "",
    maternal_condition: "",
    manner_of_death: "",
    place_of_occurrence: "",
    autopsy: "",
    attendant: "",
    attendant_other: "",
    attended_from: "",
    attended_to: "",
    certifier_signature: "",
    certifier_name: "",
    certifier_title: "",
    certifier_address: "",
    certifier_date: "",
    attended_deceased: "",
    death_occurred_time: "",
    corpse_disposal: "",
    burial_permit_number: "",
    burial_permit_date: "",
    transfer_permit_number: "",
    transfer_permit_date: "",
    cemetery_name: "",
    cemetery_address: "",
    informant_signature: "",
    informant_name: "",
    informant_relationship: "",
    informant_address: "",
    informant_date: "",
  });

  const [errors, setErrors] = useState({});

  // Step configurations
  const steps = [
    { number: 1, title: "Personal Info", completed: false },
    { number: 2, title: "Medical Info", completed: false },
    { number: 3, title: "Certification", completed: false },
    { number: 4, title: "Burial Details", completed: false },
    { number: 5, title: "Informant", completed: false },
    { number: 6, title: "Finalize", completed: false },
  ];

  // Populate form data when record is provided
  useEffect(() => {
    if (record) {
      setFormData({
        // Personal Information
        first_name: record.first_name || "",
        middle_name: record.middle_name || "",
        last_name: record.last_name || "",
        sex: record.sex || "",
        civil_status: record.civil_status || "",
        date_of_death: record.date_of_death || "",
        date_of_birth: record.date_of_birth || "",
        age_years: record.age_years || "",
        age_months: record.age_months || "",
        age_days: record.age_days || "",
        age_hours: record.age_hours || "",
        age_minutes: record.age_minutes || "",
        age_under_1: record.age_under_1 || false,
        place_of_death: record.place_of_death || "",
        religion: record.religion || "",
        citizenship: record.citizenship || "Filipino",
        residence: record.residence || "",
        occupation: record.occupation || "",
        father_name: record.father_name || "",
        mother_maiden_name: record.mother_maiden_name || "",

        // Medical Information
        immediate_cause: record.immediate_cause || "",
        antecedent_cause: record.antecedent_cause || "",
        underlying_cause: record.underlying_cause || "",
        other_significant_conditions: record.other_significant_conditions || "",
        maternal_condition: record.maternal_condition || "",
        manner_of_death: record.manner_of_death || "",
        place_of_occurrence: record.place_of_occurrence || "",
        autopsy: record.autopsy || "",
        attendant: record.attendant || "",
        attendant_other: record.attendant_other || "",
        attended_from: record.attended_from || "",
        attended_to: record.attended_to || "",

        // Death Certification
        certifier_signature: record.certifier_signature || "",
        certifier_name: record.certifier_name || "",
        certifier_title: record.certifier_title || "",
        certifier_address: record.certifier_address || "",
        certifier_date: record.certifier_date || "",
        attended_deceased: record.attended_deceased || "",
        death_occurred_time: record.death_occurred_time || "",

        // Burial Details
        corpse_disposal: record.corpse_disposal || "",
        burial_permit_number: record.burial_permit_number || "",
        burial_permit_date: record.burial_permit_date || "",
        transfer_permit_number: record.transfer_permit_number || "",
        transfer_permit_date: record.transfer_permit_date || "",
        cemetery_name: record.cemetery_name || "",
        cemetery_address: record.cemetery_address || "",

        // Informant Information
        informant_signature: record.informant_signature || "",
        informant_name: record.informant_name || "",
        informant_relationship: record.informant_relationship || "",
        informant_address: record.informant_address || "",
        informant_date: record.informant_date || "",
      });
    }
  }, [record]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    setHasUnsavedChanges(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Check for duplicates on key fields (excluding current record)
    if (['first_name', 'last_name', 'date_of_death', 'date_of_birth'].includes(name)) {
      checkForDuplicates();
    }
  };

  const checkForDuplicates = React.useCallback(
    async (firstName, lastName, dateOfDeath, dateOfBirth) => {
      if (!firstName || !lastName || !dateOfDeath || !dateOfBirth) {
        setDuplicateAlert({ show: false, message: "", similarRecords: [] });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_LARAVEL_API}/death-records/check-duplicate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              date_of_death: dateOfDeath,
              date_of_birth: dateOfBirth,
              exclude_id: record.id, // This should exclude the current record
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          if (data.is_duplicate) {
            setDuplicateAlert({
              show: true,
              message: `⚠️ Another record found! A death record for "${firstName} ${lastName}" died on ${formatDate(dateOfDeath)} already exists in the system.`,
              similarRecords: data.similar_records || [],
              isExactDuplicate: true
            });
          } else if (data.similar_records && data.similar_records.length > 0) {
            setDuplicateAlert({
              show: true,
              message: `ℹ️ Similar records found. Please review to avoid potential duplicates.`,
              similarRecords: data.similar_records,
              isExactDuplicate: false
            });
          } else {
            setDuplicateAlert({ show: false, message: "", similarRecords: [] });
          }
        }
      } catch (error) {
        console.error("Error checking duplicates:", error);
      }
    },
    [token, record.id]
  );

  // Enhanced duplicate alert component
  const DuplicateAlert = () => {
    if (!duplicateAlert.show) return null;

    return (
      <div className={`alert ${duplicateAlert.isExactDuplicate ? 'alert-danger' : 'alert-warning'} mb-4`}>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <i className={`fas ${duplicateAlert.isExactDuplicate ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2`}></i>
              <strong>{duplicateAlert.isExactDuplicate ? 'Duplicate Detected!' : 'Similar Records Found'}</strong>
            </div>
            <div className="mb-2">{duplicateAlert.message}</div>
            
            {duplicateAlert.similarRecords.length > 0 && (
              <div className="mt-2">
                <small className="fw-semibold d-block mb-2">Similar Records:</small>
                <div className="similar-records-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {duplicateAlert.similarRecords.map((similarRecord, index) => (
                    <div key={index} className="card bg-light border-0 mb-2">
                      <div className="card-body py-2">
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <strong>{similarRecord.first_name} {similarRecord.last_name}</strong>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">Died: {formatDate(similarRecord.date_of_death)}</small>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">Registry: {similarRecord.registry_number}</small>
                          </div>
                          <div className="col-md-2">
                            <span className={`badge ${similarRecord.sex === 'Male' ? 'bg-info' : 'bg-pink'}`}>
                              {similarRecord.sex}
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
                  setFormData(prev => ({
                    ...prev,
                    first_name: '',
                    last_name: '',
                    date_of_death: '',
                    date_of_birth: ''
                  }));
                  setDuplicateAlert({ show: false, message: "", similarRecords: [] });
                }}
              >
                <i className="fas fa-times me-1"></i>
                Clear Fields
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced validation to prevent duplicate submission
  const validateBeforeSubmit = () => {
    if (duplicateAlert.isExactDuplicate) {
      showAlert.error(
        "Duplicate Record",
        "Cannot update record. Another record with the same name and dates already exists."
      );
      return false;
    }
    return validateCurrentStep();
  };

  // Enhanced form validation with detailed error messages
  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Personal Information
        if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!formData.sex) newErrors.sex = "Sex is required";
        if (!formData.civil_status) newErrors.civil_status = "Civil status is required";
        if (!formData.date_of_death) newErrors.date_of_death = "Date of death is required";
        if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
        if (!formData.place_of_death.trim()) newErrors.place_of_death = "Place of death is required";
        if (!formData.citizenship.trim()) newErrors.citizenship = "Citizenship is required";
        if (!formData.residence.trim()) newErrors.residence = "Residence is required";
        if (!formData.father_name.trim()) newErrors.father_name = "Father's name is required";
        if (!formData.mother_maiden_name.trim()) newErrors.mother_maiden_name = "Mother's maiden name is required";
        break;

      case 2: // Medical Information
        if (!formData.immediate_cause.trim()) newErrors.immediate_cause = "Immediate cause is required";
        if (!formData.attendant) newErrors.attendant = "Attendant is required";
        break;

      case 3: // Death Certification
        if (!formData.certifier_name.trim()) newErrors.certifier_name = "Certifier name is required";
        break;

      case 5: // Informant Information
        if (!formData.informant_name.trim()) newErrors.informant_name = "Informant name is required";
        if (!formData.informant_relationship.trim()) newErrors.informant_relationship = "Relationship is required";
        break;

      case 6: // Finalize
        // No validation needed for final step, just confirmation
        break;
    }

    setErrors(newErrors);
    
    // Show detailed error alert if there are errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).filter(msg => msg);
      if (errorMessages.length > 0) {
        showAlert.error(
          "Form Validation Error",
          `Please fix the following errors:\n\n• ${errorMessages.join('\n• ')}`
        );
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      // Mark current step as completed
      const updatedSteps = steps.map(step =>
        step.number === currentStep ? { ...step, completed: true } : step
      );
      
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
      "Confirm Update",
      "Are you sure you want to update this death record?",
      "Yes, Update Record",
      "Review Changes"
    );

    if (!confirmation.isConfirmed) return;

    // Show processing alert
    showAlert.processing("Updating Record", "Please wait while we update the death record...");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/death-records/${record.id}`,
        {
          method: "PUT",
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
        
        showToast.success("Death record updated successfully!");
        
        setHasUnsavedChanges(false);
        
        // Wait before closing modal to see toast
        setTimeout(() => {
          onUpdate(data.data);
        }, 2000);
        
      } else {
        // Close the processing alert
        showAlert.close();
        
        if (data.errors) {
          const backendErrors = Object.values(data.errors).flat();
          showAlert.error(
            "Update Error", 
            `Please fix the following errors:\n\n• ${backendErrors.join('\n• ')}`
          );
          setErrors(data.errors);
        } else {
          throw new Error(data.message || "Failed to update death record");
        }
      }
    } catch (error) {
      // Close the processing alert
      showAlert.close();
      
      console.error("Error updating death record:", error);
      showAlert.error("Error", error.message || "Failed to update death record");
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

  // Render step content (using same components as AddDeathRecordModal)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 2:
        return <Step2MedicalInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 3:
        return <Step3DeathCertification formData={formData} errors={errors} onChange={handleInputChange} />;
      case 4:
        return <Step4BurialDetails formData={formData} errors={errors} onChange={handleInputChange} />;
      case 5:
        return <Step5InformantInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 6:
        return <Step6Finalize formData={formData} />;
      default:
        return null;
    }
  };

  if (!record) return null;

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
              id="death-record-modal-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-edit me-2"></i>
                Edit Death Record - {record.registry_number}
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
                {/* Duplicate Alert */}
                <DuplicateAlert />

                {/* Responsive Stepper */}
                <div className="stepper-container mb-4">
                  <div className="stepper-responsive">
                    {steps.map((step) => (
                      <div
                        key={step.number}
                        className={`step-responsive ${currentStep === step.number ? "active" : ""} ${
                          step.completed ? "completed" : ""
                        }`}
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
                    className="btn btn-warning save-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Update Record
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Same styles as AddDeathRecordModal */}
      <style>{`
#death-record-modal-header {
  background-color: #018181 !important;
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
}

        .next-button:hover, .save-button:hover {
          background-color: #018181 !important;
          border-color: #018181 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }

        .next-button:active, .save-button:active {
          background-color: #bd2130 !important;
          border-color: #bd2130 !important;
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

export default EditDeathRecordModal;