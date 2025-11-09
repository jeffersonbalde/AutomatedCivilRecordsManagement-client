// components/admin/StaffFormModal.jsx
import React, { useState, useEffect, useRef } from "react";
import Portal from "../../../components/Portal";
import { showAlert, showToast } from "../../../services/notificationService";

const StaffFormModal = ({ staff, onClose, onSave, token }) => {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    contact_number: "",
    address: "",
    password: "",
    password_confirmation: "",
    avatar: null,
    is_active: true, // ADDED: Default to active
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isEdit = !!staff;

  // Use useRef to persist initial state across renders
  const initialFormState = useRef({
    email: "",
    full_name: "",
    contact_number: "",
    address: "",
    password: "",
    password_confirmation: "",
    avatar: null,
    is_active: true, // ADDED: Default to active
  });

  // EXACT SAME getAvatarUrl function as UserDetailsModal
  const getAvatarUrl = (filename) => {
    if (!filename) return null;

    const baseUrl = import.meta.env.VITE_LARAVEL_API || "http://localhost:8000";

    // Clean the filename - EXACT SAME logic
    let cleanFilename = filename;
    if (filename.includes("avatars/")) {
      cleanFilename = filename.replace("avatars/", "");
    }
    if (filename.includes("avatar_")) {
      cleanFilename = filename.replace("avatar_", "");
    }

    // CORRECT URL: http://localhost:8000/avatar/1762566900_690ea2f4d8d0b.jpg
    return `${baseUrl}/avatar/${cleanFilename}`;
  };

  useEffect(() => {
    if (staff) {
      const staffFormState = {
        email: staff.email || "",
        full_name: staff.name || staff.full_name || "",
        contact_number: staff.contact || staff.contact_number || "",
        address: staff.address || "",
        password: "",
        password_confirmation: "",
        avatar: null,
        is_active: staff.is_active !== undefined ? staff.is_active : true, // ADDED: Preserve existing status
      };

      setFormData(staffFormState);

      // Set initial form state for edit mode
      initialFormState.current = { ...staffFormState };

      // Use the SAME avatar logic as UserDetailsModal
      console.log("🔍 StaffFormModal Avatar Debug:", {
        original: staff?.avatar,
        cleaned: staff?.avatar ? getAvatarUrl(staff.avatar) : null,
        user: staff?.name || staff?.full_name,
      });

      if (staff.avatar) {
        setAvatarPreview(getAvatarUrl(staff.avatar));
      } else {
        setAvatarPreview(null);
      }
    } else {
      // Reset for new staff
      setFormData({
        email: "",
        full_name: "",
        contact_number: "",
        address: "",
        password: "",
        password_confirmation: "",
        avatar: null,
        is_active: true, // ADDED: Explicitly set to true for new staff
      });
      setAvatarPreview(null);
      initialFormState.current = {
        email: "",
        full_name: "",
        contact_number: "",
        address: "",
        password: "",
        password_confirmation: "",
        avatar: null,
        is_active: true, // ADDED: Default to active
      };
    }
  }, [staff]);

  // Check if form has unsaved changes
  const checkFormChanges = (currentForm) => {
    return (
      JSON.stringify(currentForm) !==
        JSON.stringify(initialFormState.current) ||
      currentForm.password ||
      currentForm.password_confirmation ||
      currentForm.avatar !== null
    );
  };

  const formatContact = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox differently
    const fieldValue = type === "checkbox" ? checked : value;

    if (name === "contact_number") {
      const numericValue = fieldValue.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => {
        const newForm = { ...prev, [name]: numericValue };
        setHasUnsavedChanges(checkFormChanges(newForm));
        return newForm;
      });
    } else {
      setFormData((prev) => {
        const newForm = { ...prev, [name]: fieldValue };
        setHasUnsavedChanges(checkFormChanges(newForm));
        return newForm;
      });
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    if (!password) return true;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      showAlert.error(
        "Error",
        "Please select a valid image file (JPEG, PNG, GIF)"
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showAlert.error("Error", "Image size should be less than 2MB");
      return;
    }

    setAvatarUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => {
        const newForm = { ...prev, avatar: file };
        setHasUnsavedChanges(checkFormChanges(newForm));
        return newForm;
      });
    } catch (error) {
      console.error("Error processing avatar:", error);
      showAlert.error("Error", "Failed to process image");
    } finally {
      setAvatarUploading(false);
    }
  };

  const removeAvatar = () => {
    console.log("🗑️ Removing avatar - previous state:", {
      hadAvatar: !!staff?.avatar,
      hadPreview: !!avatarPreview,
    });

    setAvatarPreview(null);
    setFormData((prev) => {
      const newForm = {
        ...prev,
        avatar: null, // Explicitly set to null for removal detection
        avatar_removed: true, // Add flag for tracking
      };
      setHasUnsavedChanges(checkFormChanges(newForm));
      return newForm;
    });
    const fileInput = document.getElementById("avatar");
    if (fileInput) fileInput.value = "";
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (
      formData.contact_number &&
      !validatePhoneNumber(formData.contact_number)
    ) {
      newErrors.contact_number =
        "Phone number must be 11 digits starting with 09 (e.g., 09123456789)";
    }

    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, and number";
      }
    }

    if (isEdit && formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Form submission started:", {
      isEdit,
      staffId: staff?.id,
      formData: {
        ...formData,
        password: formData.password ? "***" : "empty",
        password_confirmation: formData.password_confirmation ? "***" : "empty",
        hasAvatar: !!formData.avatar,
        avatarIsFile: formData.avatar instanceof File,
      },
    });

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    const confirmation = await showAlert.confirm(
      isEdit ? "Confirm Staff Update" : "Confirm Create Staff",
      `Are you sure you want to ${
        isEdit ? "update" : "create"
      } this staff member?`,
      `Yes, ${isEdit ? "Update" : "Create"} Staff`,
      "Review Details"
    );

    if (!confirmation.isConfirmed) {
      console.log("❌ User cancelled confirmation");
      return;
    }

    setLoading(true);

    try {
      showAlert.processing(
        isEdit ? "Updating Staff" : "Creating Staff",
        "Please wait while we save the staff information..."
      );

      const url = isEdit
        ? `${import.meta.env.VITE_LARAVEL_API}/admin/staff/${staff.id}`
        : `${import.meta.env.VITE_LARAVEL_API}/admin/staff`;

      // Always use FormData for consistency to avoid boolean conversion issues
      const submitData = new FormData();
      submitData.append("email", formData.email);
      submitData.append("full_name", formData.full_name);
      submitData.append("contact_number", formData.contact_number);
      submitData.append("address", formData.address);

      // Convert boolean to proper format for FormData
      submitData.append("is_active", formData.is_active ? "1" : "0");

      // For PUT requests with FormData
      if (isEdit) {
        submitData.append("_method", "PUT");
      }

      if (formData.password) {
        submitData.append("password", formData.password);
        submitData.append(
          "password_confirmation",
          formData.password_confirmation
        );
      }

      // 🔥 FIX: Proper avatar handling - only include avatar if it's a new file
      // Don't include avatar field if it's null (to preserve existing avatar)
      if (formData.avatar instanceof File) {
        console.log("📸 Adding new avatar file to FormData");
        submitData.append("avatar", formData.avatar);
      }
      // 🔥 FIX: Only send remove_avatar flag if user explicitly removed the avatar
      else if (formData.avatar === null && staff?.avatar && !avatarPreview) {
        console.log("🗑️ User removed existing avatar, sending remove flag");
        submitData.append("remove_avatar", "true");
      } else {
        console.log("🔍 No avatar changes - preserving existing avatar");
        // Don't append anything - existing avatar will be preserved
      }

      // DEBUG: Log all FormData entries
      console.log("📦 FormData contents:");
      for (let [key, value] of submitData.entries()) {
        if (key === "avatar" && value instanceof File) {
          console.log(
            `  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`  ${key}:`, value, `(type: ${typeof value})`);
        }
      }

      const response = await fetch(url, {
        method: "POST", // Always POST with FormData
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: submitData,
      });

      const data = await response.json();
      showAlert.close();

      console.log("📨 API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        data: data,
      });

      if (response.ok) {
        showToast.success(
          isEdit ? "Staff updated successfully!" : "Staff created successfully!"
        );
        console.log("✅ Staff saved successfully:", data.staff || data);

        setHasUnsavedChanges(false);
        onSave(data.staff || data);
      } else {
        console.error("❌ API Error Details:", {
          status: response.status,
          data: data,
          errors: data.errors,
          message: data.message,
        });

        if (data.message === "Unauthenticated.") {
          showAlert.error(
            "Session Expired",
            "Your session has expired. Please log in again."
          );
          return;
        }

        if (data.errors) {
          console.error("📝 Form errors from API:", data.errors);
          setErrors(data.errors);
          throw new Error("Please fix the form errors");
        }
        throw new Error(
          data.message || `Failed to ${isEdit ? "update" : "create"} staff`
        );
      }
    } catch (error) {
      showAlert.close();
      console.error("💥 Error saving staff:", error);

      if (error.message.includes("Unauthenticated")) {
        showAlert.error(
          "Authentication Error",
          "Please log in again to continue."
        );
      } else {
        showAlert.error(
          "Error",
          error.message || `Failed to ${isEdit ? "update" : "create"} staff`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = async (e) => {
    if (e.target === e.currentTarget && !loading) {
      await handleCloseAttempt();
    }
  };

  const handleEscapeKey = async (e) => {
    if (e.key === "Escape" && !loading) {
      e.preventDefault();
      await handleCloseAttempt();
    }
  };

  const handleCloseAttempt = async () => {
    if (hasUnsavedChanges) {
      const result = await showAlert.confirm(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to close without saving?",
        "Yes, Close",
        "Continue Editing"
      );

      if (result.isConfirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleCloseButtonClick = async () => {
    await handleCloseAttempt();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    };
  }, [loading, hasUnsavedChanges]);

  const AvatarPreview = () => {
    console.log(
      "🔍 StaffFormModal AvatarPreview - avatarPreview:",
      avatarPreview
    );

    if (avatarUploading) {
      return (
        <div className="avatar-preview-container">
          <div className="avatar-preview loading d-flex align-items-center justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      );
    }

    if (avatarPreview) {
      return (
        <div className="avatar-preview-container">
          <div className="avatar-preview">
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-100 h-100"
              onLoad={() =>
                console.log(
                  "✅ Avatar loaded in StaffFormModal for:",
                  formData.full_name
                )
              }
              onError={(e) => {
                console.log(
                  "❌ Avatar failed in StaffFormModal for:",
                  formData.full_name,
                  "URL:",
                  avatarPreview
                );
                // Show fallback immediately
                e.target.style.display = "none";
              }}
            />
          </div>
          <button
            type="button"
            className="btn-remove-avatar"
            onClick={removeAvatar}
            title="Remove avatar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      );
    }

    // Fallback - initials avatar (CIRCLE)
    const getInitials = (name) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="avatar-preview-container">
        <div
          className="avatar-preview placeholder d-flex align-items-center justify-content-center text-white"
          style={{
            backgroundColor: "#336b31",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {getInitials(formData.full_name)}
        </div>
      </div>
    );
  };

  return (
    <Portal>
      <div
        id="staff-form-modal"
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content border-0"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header - Using ID and !important to override */}
            <div
              id="staff-form-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className={`fas ${isEdit ? "fa-edit" : "fa-plus"} me-2`}></i>
                {isEdit ? "Edit Staff" : "Add New Staff"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseButtonClick}
                aria-label="Close"
                disabled={loading}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Modal Body with grey background */}
              <div
                className="modal-body"
                style={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  backgroundColor: "#f8f9fa", // Light grey background
                }}
              >
{/* Avatar Upload Section - FIXED MARGINS FOR MOBILE */}
<div className="row mb-4">
  <div className="col-12">
    <div className="card border-0 bg-white">
      <div className="card-body text-center p-3 p-md-4">
        <div className="d-flex flex-column align-items-center">
          <AvatarPreview />
          <div className="mt-4 mt-md-3 d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-center">
            <label 
              htmlFor="avatar" 
              className="btn btn-outline-primary btn-sm"
            >
              <i className="fas fa-upload me-2"></i>
              {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
            </label>
            <input
              type="file"
              id="avatar"
              className="d-none"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleAvatarChange}
              disabled={loading || avatarUploading}
            />
            {avatarPreview && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={removeAvatar}
                disabled={loading || avatarUploading}
              >
                <i className="fas fa-trash me-2"></i>
                Remove
              </button>
            )}
          </div>
          <small className="text-muted mt-2">
            Supported formats: JPG, PNG, GIF (Max 2MB)
          </small>
        </div>
      </div>
    </div>
  </div>
</div>

                <div className="row g-3">
                  {/* Basic Information */}
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark mb-1">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter email address"
                        style={{ backgroundColor: "#ffffff" }} // White background for inputs
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark mb-1">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.full_name ? "is-invalid" : ""
                        }`}
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter full name"
                        style={{ backgroundColor: "#ffffff" }} // White background for inputs
                      />
                      {errors.full_name && (
                        <div className="invalid-feedback">
                          {errors.full_name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark mb-1">
                        Contact Number
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="fas fa-phone"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ps-2 ${
                            errors.contact_number ? "is-invalid" : ""
                          }`}
                          name="contact_number"
                          value={formatContact(formData.contact_number)}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="09XX-XXX-XXXX"
                          maxLength={13}
                          style={{ backgroundColor: "#ffffff" }} // White background for inputs
                        />
                      </div>
                      {errors.contact_number && (
                        <div className="invalid-feedback d-block">
                          {errors.contact_number}
                        </div>
                      )}
                      <small className="text-muted">
                        Format: 09XX-XXX-XXXX (11 digits)
                      </small>
                    </div>
                  </div>

                  {/* Address and Security Information */}
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark mb-1">
                        Address
                      </label>
                      <textarea
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter complete address"
                        rows="4"
                        style={{
                          resize: "vertical",
                          backgroundColor: "#ffffff", // White background for inputs
                        }}
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                      <small className="text-muted">
                        Street, Barangay, City/Municipality, Province
                      </small>
                    </div>

                    {!isEdit && (
                      <>
                        <div className="mb-3 position-relative">
                          <label className="form-label small fw-semibold text-dark mb-1">
                            Password <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span
                              className={`input-group-text bg-white border-end-0 ${
                                errors.password ? "border-danger" : ""
                              }`}
                            >
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`form-control border-start-0 ps-2 ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Enter password"
                              style={{ backgroundColor: "#ffffff" }} // White background for inputs
                            />
                            <span
                              className={`input-group-text bg-white border-start-0 ${
                                errors.password ? "border-danger" : ""
                              }`}
                            >
                              <button
                                type="button"
                                className="btn btn-sm p-0 border-0 bg-transparent text-muted"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                              >
                                <i
                                  className={`fas ${
                                    showPassword ? "fa-eye-slash" : "fa-eye"
                                  }`}
                                ></i>
                              </button>
                            </span>
                          </div>
                          {errors.password ? (
                            <div className="invalid-feedback d-block">
                              {errors.password}
                            </div>
                          ) : (
                            <small className="text-muted">
                              Must be at least 8 characters with uppercase,
                              lowercase, and number
                            </small>
                          )}
                        </div>

                        <div className="mb-3 position-relative">
                          <label className="form-label small fw-semibold text-dark mb-1">
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span
                              className={`input-group-text bg-white border-end-0 ${
                                errors.password_confirmation
                                  ? "border-danger"
                                  : ""
                              }`}
                            >
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className={`form-control border-start-0 ps-2 ${
                                errors.password_confirmation ? "is-invalid" : ""
                              }`}
                              name="password_confirmation"
                              value={formData.password_confirmation}
                              onChange={handleChange}
                              disabled={loading}
                              placeholder="Confirm password"
                              style={{ backgroundColor: "#ffffff" }} // White background for inputs
                            />
                            <span
                              className={`input-group-text bg-white border-start-0 ${
                                errors.password_confirmation
                                  ? "border-danger"
                                  : ""
                              }`}
                            >
                              <button
                                type="button"
                                className="btn btn-sm p-0 border-0 bg-transparent text-muted"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                disabled={loading}
                              >
                                <i
                                  className={`fas ${
                                    showConfirmPassword
                                      ? "fa-eye-slash"
                                      : "fa-eye"
                                  }`}
                                ></i>
                              </button>
                            </span>
                          </div>
                          {errors.password_confirmation && (
                            <div className="invalid-feedback d-block">
                              {errors.password_confirmation}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Password fields for edit mode */}
                {isEdit && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="card border-warning bg-white">
                        <div className="card-header bg-warning bg-opacity-10">
                          <h6 className="mb-0 text-warning">
                            <i className="fas fa-key me-2"></i>
                            Change Password (Optional)
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3 position-relative">
                                <label className="form-label small fw-semibold text-dark mb-1">
                                  New Password
                                </label>
                                <div className="input-group">
                                  <span
                                    className={`input-group-text bg-white border-end-0 ${
                                      errors.password ? "border-danger" : ""
                                    }`}
                                  >
                                    <i className="fas fa-lock"></i>
                                  </span>
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control border-start-0 ps-2 ${
                                      errors.password ? "is-invalid" : ""
                                    }`}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Leave blank to keep current password"
                                    style={{ backgroundColor: "#ffffff" }} // White background for inputs
                                  />
                                  <span
                                    className={`input-group-text bg-white border-start-0 ${
                                      errors.password ? "border-danger" : ""
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-sm p-0 border-0 bg-transparent text-muted"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      disabled={loading}
                                    >
                                      <i
                                        className={`fas ${
                                          showPassword
                                            ? "fa-eye-slash"
                                            : "fa-eye"
                                        }`}
                                      ></i>
                                    </button>
                                  </span>
                                </div>
                                {errors.password ? (
                                  <div className="invalid-feedback d-block">
                                    {errors.password}
                                  </div>
                                ) : (
                                  <small className="text-muted">
                                    Must be at least 8 characters with
                                    uppercase, lowercase, and number
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3 position-relative">
                                <label className="form-label small fw-semibold text-dark mb-1">
                                  Confirm New Password
                                </label>
                                <div className="input-group">
                                  <span
                                    className={`input-group-text bg-white border-end-0 ${
                                      errors.password_confirmation
                                        ? "border-danger"
                                        : ""
                                    }`}
                                  >
                                    <i className="fas fa-lock"></i>
                                  </span>
                                  <input
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    className={`form-control border-start-0 ps-2 ${
                                      errors.password_confirmation
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Confirm new password"
                                    style={{ backgroundColor: "#ffffff" }} // White background for inputs
                                  />
                                  <span
                                    className={`input-group-text bg-white border-start-0 ${
                                      errors.password_confirmation
                                        ? "border-danger"
                                        : ""
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-sm p-0 border-0 bg-transparent text-muted"
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      disabled={loading}
                                    >
                                      <i
                                        className={`fas ${
                                          showConfirmPassword
                                            ? "fa-eye-slash"
                                            : "fa-eye"
                                        }`}
                                      ></i>
                                    </button>
                                  </span>
                                </div>
                                {errors.password_confirmation && (
                                  <div className="invalid-feedback d-block">
                                    {errors.password_confirmation}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer border-top bg-white">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseButtonClick}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn fw-semibold position-relative"
                  disabled={loading || avatarUploading}
                  style={{
                    backgroundColor: loading ? "#6c757d" : "#018181",
                    borderColor: loading ? "#6c757d" : "#018181",
                    color: "white",
                    transition: "all 0.3s ease",
                    minWidth: "140px",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#016767";
                      e.target.style.borderColor = "#016767";
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 8px rgba(1, 129, 129, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#018181";
                      e.target.style.borderColor = "#018181";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={`fas ${isEdit ? "fa-save" : "fa-plus"} me-2`}
                      ></i>
                      {isEdit ? "Update Staff" : "Create Staff"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        /* Nuclear option for header background - using ID and !important */
        #staff-form-header {
          background: #018181 !important;
          background-color: #018181 !important;
          background-image: none !important;
        }
        
        /* Input fields styling */
        #staff-form-modal .form-control {
          background-color: #ffffff !important;
        }
        
        /* Input group text styling */
        #staff-form-modal .input-group-text {
          background-color: #ffffff !important;
        }
        
        /* Card backgrounds */
        #staff-form-modal .card {
          background-color: #ffffff !important;
        }
        
        /* Nuclear option - override ALL focus states to blue */
        #staff-form-modal .form-control:focus,
        #staff-form-modal input:focus,
        #staff-form-modal textarea:focus,
        #staff-form-modal select:focus {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
        
        /* Input groups */
        #staff-form-modal .input-group:focus-within .form-control,
        #staff-form-modal .input-group:focus-within input {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
        
        #staff-form-modal .input-group:focus-within .input-group-text {
          border-color: #0d6efd !important;
        }
        
        /* Specific types that might have different rules */
        #staff-form-modal input[type="email"]:focus,
        #staff-form-modal input[type="text"]:focus,
        #staff-form-modal input[type="password"]:focus,
        #staff-form-modal input[type="tel"]:focus,
        #staff-form-modal textarea:focus {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
        
        /* Bootstrap validation states - override green success state */
        #staff-form-modal .form-control:focus:valid,
        #staff-form-modal .form-control:focus.is-valid,
        #staff-form-modal .was-validated .form-control:focus:valid {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
        
        /* Keep red for invalid states */
        #staff-form-modal .form-control:focus:invalid,
        #staff-form-modal .form-control:focus.is-invalid,
        #staff-form-modal .was-validated .form-control:focus:invalid {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
        }
        
        /* Avatar preview styling */
        .avatar-preview-container {
          position: relative;
          display: inline-block;
        }
        
        .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #dee2e6;
          background-color: #ffffff;
        }
        
        .avatar-preview.placeholder {
          background-color: #f8f9fa;
          border: 2px dashed #dee2e6;
        }
        
        .avatar-preview.loading {
          background-color: #f8f9fa;
        }
        
        .avatar-preview img {
          object-fit: cover;
        }
        
        .btn-remove-avatar {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #dc3545;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
        }
        
        .btn-remove-avatar:hover {
          background-color: #c82333;
        }
      `}</style>
    </Portal>
  );
};

export default StaffFormModal;
