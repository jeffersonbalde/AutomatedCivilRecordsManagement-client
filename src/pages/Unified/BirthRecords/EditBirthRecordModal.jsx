// src/pages/BirthRecords/components/EditBirthRecordModal.jsx
import React, { useState, useEffect } from "react";
import Portal from "../../../components/Portal";
import { showAlert, showToast } from "../../../services/notificationService";

// Import the same step components from AddBirthRecordModal
import {
  Step1ChildInfo,
  Step2MotherInfo,
  Step3FatherInfo,
  Step4ParentsMarriage,
  Step5BirthDetails,
  Step6AttendantInfo,
  Step7InformantInfo,
  Step8Finalize
} from "./BirthRecordStepComponents";

const EditBirthRecordModal = ({ record, onClose, onUpdate, token }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState({ show: false, message: "", similarRecords: [] });
  
  // Form data state - pre-populated with record data
  const [formData, setFormData] = useState({
    // Initialize with empty values first
    child_first_name: "",
    child_middle_name: "",
    child_last_name: "",
    sex: "",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    birth_address_house: "",
    birth_address_barangay: "",
    birth_address_city: "",
    birth_address_province: "",
    type_of_birth: "Single",
    multiple_birth_order: "",
    birth_order: 1,
    birth_weight: "",
    birth_notes: "",

    // Mother Information
    mother_first_name: "",
    mother_middle_name: "",
    mother_last_name: "",
    mother_citizenship: "Filipino",
    mother_religion: "",
    mother_occupation: "",
    mother_age_at_birth: "",
    mother_children_born_alive: 0,
    mother_children_still_living: 0,
    mother_children_deceased: 0,
    mother_house_no: "",
    mother_barangay: "",
    mother_city: "",
    mother_province: "",
    mother_country: "Philippines",

    // Father Information
    father_first_name: "",
    father_middle_name: "",
    father_last_name: "",
    father_citizenship: "Filipino",
    father_religion: "",
    father_occupation: "",
    father_age_at_birth: "",
    father_house_no: "",
    father_barangay: "",
    father_city: "",
    father_province: "",
    father_country: "Philippines",

    // Parents Marriage
    marriage_date: "",
    marriage_place_city: "",
    marriage_place_province: "",
    marriage_place_country: "Philippines",

    // Attendant Information
    attendant_type: "",
    attendant_name: "",
    attendant_license: "",
    attendant_certification: "I hereby certify that I attended the birth of the child who was born alive at the time and date specified above.",
    attendant_address: "",
    attendant_title: "",

    // Informant Information
    informant_first_name: "",
    informant_middle_name: "",
    informant_last_name: "",
    informant_relationship: "",
    informant_address: "",
    informant_certification_accepted: false,
  });

  const [errors, setErrors] = useState({});

  // Step configurations
  const steps = [
    { number: 1, title: "Child Info", completed: false },
    { number: 2, title: "Mother", completed: false },
    { number: 3, title: "Father", completed: false },
    { number: 4, title: "Parents Marriage", completed: false },
    { number: 5, title: "Birth Details", completed: false },
    { number: 6, title: "Attendant", completed: false },
    { number: 7, title: "Informant", completed: false },
    { number: 8, title: "Finalize", completed: false },
  ];

  // Populate form data when record is provided
  useEffect(() => {
    if (record) {
      const formatTimeForInput = (timeString) => {
        if (!timeString) return '';
        // Ensure time is in HH:MM format for input[type="time"]
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toTimeString().slice(0, 5);
      };

      setFormData({
        // Child Information
        child_first_name: record.child_first_name || "",
        child_middle_name: record.child_middle_name || "",
        child_last_name: record.child_last_name || "",
        sex: record.sex || "",
        date_of_birth: record.date_of_birth || "",
        time_of_birth: formatTimeForInput(record.time_of_birth),
        place_of_birth: record.place_of_birth || "",
        birth_address_house: record.birth_address_house || "",
        birth_address_barangay: record.birth_address_barangay || "",
        birth_address_city: record.birth_address_city || "",
        birth_address_province: record.birth_address_province || "",
        type_of_birth: record.type_of_birth || "Single",
        multiple_birth_order: record.multiple_birth_order || "",
        birth_order: record.birth_order || 1,
        birth_weight: record.birth_weight || "",
        birth_notes: record.birth_notes || "",

        // Mother Information
        mother_first_name: record.mother?.first_name || "",
        mother_middle_name: record.mother?.middle_name || "",
        mother_last_name: record.mother?.last_name || "",
        mother_citizenship: record.mother?.citizenship || "Filipino",
        mother_religion: record.mother?.religion || "",
        mother_occupation: record.mother?.occupation || "",
        mother_age_at_birth: record.mother?.age_at_birth || "",
        mother_children_born_alive: record.mother?.children_born_alive || 0,
        mother_children_still_living: record.mother?.children_still_living || 0,
        mother_children_deceased: record.mother?.children_deceased || 0,
        mother_house_no: record.mother?.house_no || "",
        mother_barangay: record.mother?.barangay || "",
        mother_city: record.mother?.city || "",
        mother_province: record.mother?.province || "",
        mother_country: record.mother?.country || "Philippines",

        // Father Information
        father_first_name: record.father?.first_name || "",
        father_middle_name: record.father?.middle_name || "",
        father_last_name: record.father?.last_name || "",
        father_citizenship: record.father?.citizenship || "Filipino",
        father_religion: record.father?.religion || "",
        father_occupation: record.father?.occupation || "",
        father_age_at_birth: record.father?.age_at_birth || "",
        father_house_no: record.father?.house_no || "",
        father_barangay: record.father?.barangay || "",
        father_city: record.father?.city || "",
        father_province: record.father?.province || "",
        father_country: record.father?.country || "Philippines",

        // Parents Marriage
        marriage_date: record.parents_marriage?.marriage_date || "",
        marriage_place_city: record.parents_marriage?.marriage_place_city || "",
        marriage_place_province: record.parents_marriage?.marriage_place_province || "",
        marriage_place_country: record.parents_marriage?.marriage_place_country || "Philippines",

        // Attendant Information
        attendant_type: record.attendant?.attendant_type || "",
        attendant_name: record.attendant?.attendant_name || "",
        attendant_license: record.attendant?.attendant_license || "",
        attendant_certification: record.attendant?.attendant_certification || "I hereby certify that I attended the birth of the child who was born alive at the time and date specified above.",
        attendant_address: record.attendant?.attendant_address || "",
        attendant_title: record.attendant?.attendant_title || "",

        // Informant Information
        informant_first_name: record.informant?.first_name || "",
        informant_middle_name: record.informant?.middle_name || "",
        informant_last_name: record.informant?.last_name || "",
        informant_relationship: record.informant?.relationship || "",
        informant_address: record.informant?.address || "",
        informant_certification_accepted: record.informant?.certification_accepted || false,
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

    // Check for duplicates on key child fields (excluding current record)
    if (['child_first_name', 'child_last_name', 'date_of_birth'].includes(name)) {
      checkForDuplicates();
    }
  };

  // Check for duplicates (excluding current record)
  const checkForDuplicates = async () => {
    if (!formData.child_first_name || !formData.child_last_name || !formData.date_of_birth) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/birth-records/check-duplicate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            child_first_name: formData.child_first_name,
            child_last_name: formData.child_last_name,
            date_of_birth: formData.date_of_birth,
            exclude_id: record.id // Exclude current record from duplicate check
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.is_duplicate) {
          setDuplicateAlert({
            show: true,
            message: `⚠️ Another record found! A birth record for "${formData.child_first_name} ${formData.child_last_name}" born on ${formatDate(formData.date_of_birth)} already exists in the system.`,
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
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Form validation for current step (same as AddBirthRecordModal)
  const validateCurrentStep = () => {
    const newErrors = {};
    // ... same validation logic as AddBirthRecordModal
    // Copy the validation logic from AddBirthRecordModal
    switch (currentStep) {
      case 1: // Child Information
        if (!formData.child_first_name.trim()) newErrors.child_first_name = "First name is required";
        if (!formData.child_last_name.trim()) newErrors.child_last_name = "Last name is required";
        if (!formData.sex) newErrors.sex = "Sex is required";
        if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
        if (!formData.place_of_birth.trim()) newErrors.place_of_birth = "Place of birth is required";
        if (!formData.birth_address_city.trim()) newErrors.birth_address_city = "City is required";
        if (!formData.type_of_birth) newErrors.type_of_birth = "Type of birth is required";
        if (!formData.birth_order || formData.birth_order < 1) newErrors.birth_order = "Valid birth order is required";
        break;

      case 2: // Mother Information
        if (!formData.mother_first_name.trim()) newErrors.mother_first_name = "First name is required";
        if (!formData.mother_last_name.trim()) newErrors.mother_last_name = "Last name is required";
        if (!formData.mother_citizenship.trim()) newErrors.mother_citizenship = "Citizenship is required";
        if (!formData.mother_age_at_birth || formData.mother_age_at_birth < 15) newErrors.mother_age_at_birth = "Valid age is required";
        if (!formData.mother_barangay.trim()) newErrors.mother_barangay = "Barangay is required";
        if (!formData.mother_city.trim()) newErrors.mother_city = "City is required";
        break;

      case 3: // Father Information
        if (!formData.father_first_name.trim()) newErrors.father_first_name = "First name is required";
        if (!formData.father_last_name.trim()) newErrors.father_last_name = "Last name is required";
        if (!formData.father_citizenship.trim()) newErrors.father_citizenship = "Citizenship is required";
        if (!formData.father_age_at_birth || formData.father_age_at_birth < 15) newErrors.father_age_at_birth = "Valid age is required";
        if (!formData.father_barangay.trim()) newErrors.father_barangay = "Barangay is required";
        if (!formData.father_city.trim()) newErrors.father_city = "City is required";
        break;

      case 6: // Attendant Information
        if (!formData.attendant_type) newErrors.attendant_type = "Attendant type is required";
        if (!formData.attendant_name.trim()) newErrors.attendant_name = "Attendant name is required";
        if (!formData.attendant_certification.trim()) newErrors.attendant_certification = "Certification is required";
        if (!formData.attendant_address.trim()) newErrors.attendant_address = "Address is required";
        if (!formData.attendant_title.trim()) newErrors.attendant_title = "Title is required";
        break;

      case 7: // Informant Information
        if (!formData.informant_first_name.trim()) newErrors.informant_first_name = "First name is required";
        if (!formData.informant_last_name.trim()) newErrors.informant_last_name = "Last name is required";
        if (!formData.informant_relationship.trim()) newErrors.informant_relationship = "Relationship is required";
        if (!formData.informant_address.trim()) newErrors.informant_address = "Address is required";
        if (!formData.informant_certification_accepted) newErrors.informant_certification_accepted = "Certification must be accepted";
        break;

      case 8: // Finalize
        // No validation needed for final step, just confirmation
        break;
    }

    setErrors(newErrors);
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

  // Handle form submission for update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      showAlert.error("Validation Error", "Please fix all errors before updating.");
      return;
    }

    if (duplicateAlert.isExactDuplicate) {
      showAlert.error(
        "Duplicate Record",
        "Cannot update record. Another record with the same child name and date of birth already exists."
      );
      return;
    }

    const confirmation = await showAlert.confirm(
      "Confirm Update",
      "Are you sure you want to update this birth record?",
      "Yes, Update Record",
      "Review Changes"
    );

    if (!confirmation.isConfirmed) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LARAVEL_API}/birth-records/${record.id}`,
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
        showToast.success("Birth record updated successfully!");
        setHasUnsavedChanges(false);
        onUpdate(data.data);
      } else {
        if (data.errors) {
          setErrors(data.errors);
          throw new Error("Please fix the form errors");
        }
        throw new Error(data.message || "Failed to update birth record");
      }
    } catch (error) {
      console.error("Error updating birth record:", error);
      showAlert.error("Error", error.message || "Failed to update birth record");
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

  // Duplicate Alert Component
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
                            <strong>{similarRecord.child_first_name} {similarRecord.child_last_name}</strong>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">Born: {formatDate(similarRecord.date_of_birth)}</small>
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
        </div>
      </div>
    );
  };

  // Render step content (using same components as AddBirthRecordModal)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1ChildInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 2:
        return <Step2MotherInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 3:
        return <Step3FatherInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 4:
        return <Step4ParentsMarriage formData={formData} errors={errors} onChange={handleInputChange} />;
      case 5:
        return <Step5BirthDetails formData={formData} errors={errors} onChange={handleInputChange} />;
      case 6:
        return <Step6AttendantInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 7:
        return <Step7InformantInfo formData={formData} errors={errors} onChange={handleInputChange} />;
      case 8:
        return <Step8Finalize formData={formData} />;
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
              className="modal-header border-0 text-white"
              style={{ backgroundColor: "#018181" }}
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-edit me-2"></i>
                Edit Birth Record - {record.registry_number}
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

                {/* Stepper */}
                <div className="stepper mb-4">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className={`step ${currentStep === step.number ? "active" : ""} ${
                        step.completed ? "completed" : ""
                      }`}
                      data-step={step.number}
                    >
                      <span>{step.title}</span>
                    </div>
                  ))}
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
                    className="btn btn-primary"
                    onClick={nextStep}
                    disabled={loading}
                    style={{
                      backgroundColor: "#018181",
                      borderColor: "#018181",
                    }}
                  >
                    Next <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-warning"
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

      {/* Same styles as AddBirthRecordModal */}
      <style>{`
        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          position: relative;
        }

        .stepper::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: #dee2e6;
          z-index: 1;
        }

        .step {
          position: relative;
          z-index: 2;
          text-align: center;
          flex: 1;
        }

        .step::before {
          content: attr(data-step);
          width: 40px;
          height: 40px;
          background: white;
          border: 2px solid #dee2e6;
          border-radius: 50%;
          display: block;
          margin: 0 auto 10px;
          line-height: 36px;
          font-weight: bold;
          transition: all 0.3s;
        }

        .step.active::before {
          background: #018181;
          border-color: #018181;
          color: white;
        }

        .step.completed::before {
          background: #28a745;
          border-color: #28a745;
          color: white;
        }

        .step span {
          font-size: 0.8rem;
          color: #6c757d;
          transition: all 0.3s;
        }

        .step.active span {
          color: #018181;
          font-weight: 600;
        }

        .step.completed span {
          color: #28a745;
          font-weight: 600;
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
      `}</style>
    </Portal>
  );
};

export default EditBirthRecordModal;