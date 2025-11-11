import React from "react";

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time for display
export const formatTime = (timeString) => {
  if (!timeString) return 'Not specified';
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Step 1: Basic Marriage Information
export const Step1BasicInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Basic Marriage Information</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Date of Marriage <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.date_of_marriage ? "is-invalid" : ""}`}
          name="date_of_marriage"
          value={formData.date_of_marriage}
          onChange={onChange}
          required
        />
        {errors.date_of_marriage && (
          <div className="invalid-feedback">{errors.date_of_marriage}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Time of Marriage <span className="text-danger">*</span>
        </label>
        <input
          type="time"
          className={`form-control ${errors.time_of_marriage ? "is-invalid" : ""}`}
          name="time_of_marriage"
          value={formData.time_of_marriage}
          onChange={onChange}
          required
        />
        {errors.time_of_marriage && (
          <div className="invalid-feedback">{errors.time_of_marriage}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Province <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.province ? "is-invalid" : ""}`}
          name="province"
          value={formData.province}
          onChange={onChange}
          placeholder="Enter province"
          required
        />
        {errors.province && (
          <div className="invalid-feedback">{errors.province}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          City/Municipality <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.city_municipality ? "is-invalid" : ""}`}
          name="city_municipality"
          value={formData.city_municipality}
          onChange={onChange}
          placeholder="Enter city/municipality"
          required
        />
        {errors.city_municipality && (
          <div className="invalid-feedback">{errors.city_municipality}</div>
        )}
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">
          Place of Marriage (Church/Municipality) <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.place_of_marriage ? "is-invalid" : ""}`}
          name="place_of_marriage"
          value={formData.place_of_marriage}
          onChange={onChange}
          placeholder="e.g., St. Peter's Church, Pagadian City Hall"
          required
        />
        {errors.place_of_marriage && (
          <div className="invalid-feedback">{errors.place_of_marriage}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Type of Marriage <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.marriage_type ? "is-invalid" : ""}`}
          name="marriage_type"
          value={formData.marriage_type}
          onChange={onChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Civil">Civil</option>
          <option value="Church">Church</option>
          <option value="Tribal">Tribal</option>
          <option value="Other">Other</option>
        </select>
        {errors.marriage_type && (
          <div className="invalid-feedback">{errors.marriage_type}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Marriage License Number <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.license_number ? "is-invalid" : ""}`}
          name="license_number"
          value={formData.license_number}
          onChange={onChange}
          placeholder="Enter license number"
          required
        />
        {errors.license_number && (
          <div className="invalid-feedback">{errors.license_number}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          License Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.license_date ? "is-invalid" : ""}`}
          name="license_date"
          value={formData.license_date}
          onChange={onChange}
          required
        />
        {errors.license_date && (
          <div className="invalid-feedback">{errors.license_date}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Place Issued <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.license_place ? "is-invalid" : ""}`}
          name="license_place"
          value={formData.license_place}
          onChange={onChange}
          placeholder="e.g., Pagadian City Civil Registry"
          required
        />
        {errors.license_place && (
          <div className="invalid-feedback">{errors.license_place}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Property Regime <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.property_regime ? "is-invalid" : ""}`}
          name="property_regime"
          value={formData.property_regime}
          onChange={onChange}
          required
        >
          <option value="">Select Property Regime</option>
          <option value="Absolute Community">Absolute Community</option>
          <option value="Conjugal Partnership">Conjugal Partnership</option>
          <option value="Separation of Property">Separation of Property</option>
          <option value="Other">Other</option>
        </select>
        {errors.property_regime && (
          <div className="invalid-feedback">{errors.property_regime}</div>
        )}
      </div>
    </div>
  </div>
);

// Step 2: Husband's Information
export const Step2HusbandInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Husband's Information</h5>
    <div className="row g-3">
      {/* Husband's Name */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_first_name ? "is-invalid" : ""}`}
          name="husband_first_name"
          value={formData.husband_first_name}
          onChange={onChange}
          placeholder="Enter first name"
          required
        />
        {errors.husband_first_name && (
          <div className="invalid-feedback">{errors.husband_first_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Middle Name</label>
        <input
          type="text"
          className="form-control"
          name="husband_middle_name"
          value={formData.husband_middle_name}
          onChange={onChange}
          placeholder="Enter middle name"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Last Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_last_name ? "is-invalid" : ""}`}
          name="husband_last_name"
          value={formData.husband_last_name}
          onChange={onChange}
          placeholder="Enter last name"
          required
        />
        {errors.husband_last_name && (
          <div className="invalid-feedback">{errors.husband_last_name}</div>
        )}
      </div>

      {/* Husband's Birth Details */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Date of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.husband_birthdate ? "is-invalid" : ""}`}
          name="husband_birthdate"
          value={formData.husband_birthdate}
          onChange={onChange}
          required
        />
        {errors.husband_birthdate && (
          <div className="invalid-feedback">{errors.husband_birthdate}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Place of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_birthplace ? "is-invalid" : ""}`}
          name="husband_birthplace"
          value={formData.husband_birthplace}
          onChange={onChange}
          placeholder="Enter place of birth"
          required
        />
        {errors.husband_birthplace && (
          <div className="invalid-feedback">{errors.husband_birthplace}</div>
        )}
      </div>

      {/* Husband's Personal Details */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Sex <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.husband_sex ? "is-invalid" : ""}`}
          name="husband_sex"
          value={formData.husband_sex}
          onChange={onChange}
          required
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.husband_sex && (
          <div className="invalid-feedback">{errors.husband_sex}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_citizenship ? "is-invalid" : ""}`}
          name="husband_citizenship"
          value={formData.husband_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
          required
        />
        {errors.husband_citizenship && (
          <div className="invalid-feedback">{errors.husband_citizenship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Religion</label>
        <input
          type="text"
          className="form-control"
          name="husband_religion"
          value={formData.husband_religion}
          onChange={onChange}
          placeholder="e.g., Roman Catholic"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Civil Status at Time of Marriage <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.husband_civil_status ? "is-invalid" : ""}`}
          name="husband_civil_status"
          value={formData.husband_civil_status}
          onChange={onChange}
          required
        >
          <option value="">Select Civil Status</option>
          <option value="Single">Single</option>
          <option value="Widowed">Widowed</option>
          <option value="Divorced">Divorced</option>
          <option value="Annulled">Annulled</option>
        </select>
        {errors.husband_civil_status && (
          <div className="invalid-feedback">{errors.husband_civil_status}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Occupation</label>
        <input
          type="text"
          className="form-control"
          name="husband_occupation"
          value={formData.husband_occupation}
          onChange={onChange}
          placeholder="e.g., Engineer, Teacher"
        />
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">
          Complete Address <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.husband_address ? "is-invalid" : ""}`}
          name="husband_address"
          value={formData.husband_address}
          onChange={onChange}
          rows="3"
          placeholder="Enter complete address"
          required
        />
        {errors.husband_address && (
          <div className="invalid-feedback">{errors.husband_address}</div>
        )}
      </div>

      {/* Husband's Parents Information */}
      <div className="col-12">
        <h6 className="subsection-title mt-4 mb-3">Parent's Information</h6>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Father's Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_father_name ? "is-invalid" : ""}`}
          name="husband_father_name"
          value={formData.husband_father_name}
          onChange={onChange}
          placeholder="Enter father's full name"
          required
        />
        {errors.husband_father_name && (
          <div className="invalid-feedback">{errors.husband_father_name}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Father's Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_father_citizenship ? "is-invalid" : ""}`}
          name="husband_father_citizenship"
          value={formData.husband_father_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
          required
        />
        {errors.husband_father_citizenship && (
          <div className="invalid-feedback">{errors.husband_father_citizenship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Mother's Maiden Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_mother_name ? "is-invalid" : ""}`}
          name="husband_mother_name"
          value={formData.husband_mother_name}
          onChange={onChange}
          placeholder="Enter mother's maiden name"
          required
        />
        {errors.husband_mother_name && (
          <div className="invalid-feedback">{errors.husband_mother_name}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Mother's Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.husband_mother_citizenship ? "is-invalid" : ""}`}
          name="husband_mother_citizenship"
          value={formData.husband_mother_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
          required
        />
        {errors.husband_mother_citizenship && (
          <div className="invalid-feedback">{errors.husband_mother_citizenship}</div>
        )}
      </div>

      {/* Husband's Consent Information */}
      <div className="col-12">
        <h6 className="subsection-title mt-4 mb-3">Consent Information (if applicable)</h6>
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Name of Consent Giver</label>
        <input
          type="text"
          className="form-control"
          name="husband_consent_giver"
          value={formData.husband_consent_giver}
          onChange={onChange}
          placeholder="Enter consent giver's name"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Relationship</label>
        <input
          type="text"
          className="form-control"
          name="husband_consent_relationship"
          value={formData.husband_consent_relationship}
          onChange={onChange}
          placeholder="e.g., Father, Mother"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Consent Giver Address</label>
        <input
          type="text"
          className="form-control"
          name="husband_consent_address"
          value={formData.husband_consent_address}
          onChange={onChange}
          placeholder="Enter consent giver's address"
        />
      </div>
    </div>
  </div>
);

// Step 3: Wife's Information
export const Step3WifeInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Wife's Information</h5>
    <div className="row g-3">
      {/* Wife's Name */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_first_name ? "is-invalid" : ""}`}
          name="wife_first_name"
          value={formData.wife_first_name}
          onChange={onChange}
          placeholder="Enter first name"
          required
        />
        {errors.wife_first_name && (
          <div className="invalid-feedback">{errors.wife_first_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Middle Name</label>
        <input
          type="text"
          className="form-control"
          name="wife_middle_name"
          value={formData.wife_middle_name}
          onChange={onChange}
          placeholder="Enter middle name"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Last Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_last_name ? "is-invalid" : ""}`}
          name="wife_last_name"
          value={formData.wife_last_name}
          onChange={onChange}
          placeholder="Enter last name"
          required
        />
        {errors.wife_last_name && (
          <div className="invalid-feedback">{errors.wife_last_name}</div>
        )}
      </div>

      {/* Wife's Birth Details */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Date of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.wife_birthdate ? "is-invalid" : ""}`}
          name="wife_birthdate"
          value={formData.wife_birthdate}
          onChange={onChange}
          required
        />
        {errors.wife_birthdate && (
          <div className="invalid-feedback">{errors.wife_birthdate}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Place of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_birthplace ? "is-invalid" : ""}`}
          name="wife_birthplace"
          value={formData.wife_birthplace}
          onChange={onChange}
          placeholder="Enter place of birth"
          required
        />
        {errors.wife_birthplace && (
          <div className="invalid-feedback">{errors.wife_birthplace}</div>
        )}
      </div>

      {/* Wife's Personal Details */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Sex <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.wife_sex ? "is-invalid" : ""}`}
          name="wife_sex"
          value={formData.wife_sex}
          onChange={onChange}
          required
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.wife_sex && (
          <div className="invalid-feedback">{errors.wife_sex}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_citizenship ? "is-invalid" : ""}`}
          name="wife_citizenship"
          value={formData.wife_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
          required
        />
        {errors.wife_citizenship && (
          <div className="invalid-feedback">{errors.wife_citizenship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Religion</label>
        <input
          type="text"
          className="form-control"
          name="wife_religion"
          value={formData.wife_religion}
          onChange={onChange}
          placeholder="e.g., Roman Catholic"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Civil Status at Time of Marriage <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.wife_civil_status ? "is-invalid" : ""}`}
          name="wife_civil_status"
          value={formData.wife_civil_status}
          onChange={onChange}
          required
        >
          <option value="">Select Civil Status</option>
          <option value="Single">Single</option>
          <option value="Widowed">Widowed</option>
          <option value="Divorced">Divorced</option>
          <option value="Annulled">Annulled</option>
        </select>
        {errors.wife_civil_status && (
          <div className="invalid-feedback">{errors.wife_civil_status}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Occupation</label>
        <input
          type="text"
          className="form-control"
          name="wife_occupation"
          value={formData.wife_occupation}
          onChange={onChange}
          placeholder="e.g., Teacher, Nurse"
        />
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">
          Complete Address <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.wife_address ? "is-invalid" : ""}`}
          name="wife_address"
          value={formData.wife_address}
          onChange={onChange}
          rows="3"
          placeholder="Enter complete address"
          required
        />
        {errors.wife_address && (
          <div className="invalid-feedback">{errors.wife_address}</div>
        )}
      </div>

      {/* Wife's Parents Information */}
      <div className="col-12">
        <h6 className="subsection-title mt-4 mb-3">Parent's Information</h6>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Father's Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_father_name ? "is-invalid" : ""}`}
          name="wife_father_name"
          value={formData.wife_father_name}
          onChange={onChange}
          placeholder="Enter father's full name"
          required
        />
        {errors.wife_father_name && (
          <div className="invalid-feedback">{errors.wife_father_name}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Father's Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_father_citizenship ? "is-invalid" : ""}`}
          name="wife_father_citizenship"
          value={formData.wife_father_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
          required
        />
        {errors.wife_father_citizenship && (
          <div className="invalid-feedback">{errors.wife_father_citizenship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Mother's Maiden Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_mother_name ? "is-invalid" : ""}`}
          name="wife_mother_name"
          value={formData.wife_mother_name}
          onChange={onChange}
          placeholder="Enter mother's maiden name"
          required
        />
        {errors.wife_mother_name && (
          <div className="invalid-feedback">{errors.wife_mother_name}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Mother's Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.wife_mother_citizenship ? "is-invalid" : ""}`}
          name="wife_mother_citizenship"
          value={formData.wife_mother_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
          required
        />
        {errors.wife_mother_citizenship && (
          <div className="invalid-feedback">{errors.wife_mother_citizenship}</div>
        )}
      </div>

      {/* Wife's Consent Information */}
      <div className="col-12">
        <h6 className="subsection-title mt-4 mb-3">Consent Information (if applicable)</h6>
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Name of Consent Giver</label>
        <input
          type="text"
          className="form-control"
          name="wife_consent_giver"
          value={formData.wife_consent_giver}
          onChange={onChange}
          placeholder="Enter consent giver's name"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Relationship</label>
        <input
          type="text"
          className="form-control"
          name="wife_consent_relationship"
          value={formData.wife_consent_relationship}
          onChange={onChange}
          placeholder="e.g., Father, Mother"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Consent Giver Address</label>
        <input
          type="text"
          className="form-control"
          name="wife_consent_address"
          value={formData.wife_consent_address}
          onChange={onChange}
          placeholder="Enter consent giver's address"
        />
      </div>
    </div>
  </div>
);

// Step 4: Marriage Ceremony Details
export const Step4CeremonyDetails = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Marriage Ceremony Details</h5>
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">
          Officiating Officer/Priest <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.officiating_officer ? "is-invalid" : ""}`}
          name="officiating_officer"
          value={formData.officiating_officer}
          onChange={onChange}
          placeholder="Enter name of officiating officer"
          required
        />
        {errors.officiating_officer && (
          <div className="invalid-feedback">{errors.officiating_officer}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Officiant Title/Position</label>
        <input
          type="text"
          className="form-control"
          name="officiant_title"
          value={formData.officiant_title}
          onChange={onChange}
          placeholder="e.g., Mayor, Priest, Judge"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Officiant License Number</label>
        <input
          type="text"
          className="form-control"
          name="officiant_license"
          value={formData.officiant_license}
          onChange={onChange}
          placeholder="Enter license number if applicable"
        />
      </div>

      {/* Legal Basis */}
      <div className="col-12">
        <h6 className="subsection-title mt-4 mb-3">Legal Basis</h6>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Legal Basis for Marriage</label>
        <select
          className="form-select"
          name="legal_basis"
          value={formData.legal_basis}
          onChange={onChange}
        >
          <option value="">Select Legal Basis</option>
          <option value="Executive Order 209">Executive Order No. 209</option>
          <option value="Presidential Decree 1083">Presidential Decree No. 1083</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Article/Provision (if applicable)</label>
        <input
          type="text"
          className="form-control"
          name="legal_basis_article"
          value={formData.legal_basis_article}
          onChange={onChange}
          placeholder="e.g., Article 1, Section 2"
        />
      </div>

      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">Additional Remarks/Certification Details</label>
        <textarea
          className="form-control"
          name="marriage_remarks"
          value={formData.marriage_remarks}
          onChange={onChange}
          rows="4"
          placeholder="Any additional marriage details or certification remarks"
        />
      </div>
    </div>
  </div>
);

// Step 5: Witness Information
export const Step5WitnessInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Witness Information</h5>
    <div className="row g-3">
      {/* Primary Witness 1 */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Witness 1 Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.witness1_name ? "is-invalid" : ""}`}
          name="witness1_name"
          value={formData.witness1_name}
          onChange={onChange}
          placeholder="Enter full name"
          required
        />
        {errors.witness1_name && (
          <div className="invalid-feedback">{errors.witness1_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Witness 1 Address <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.witness1_address ? "is-invalid" : ""}`}
          name="witness1_address"
          value={formData.witness1_address}
          onChange={onChange}
          placeholder="Enter complete address"
          required
        />
        {errors.witness1_address && (
          <div className="invalid-feedback">{errors.witness1_address}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Relationship to Couple</label>
        <input
          type="text"
          className="form-control"
          name="witness1_relationship"
          value={formData.witness1_relationship}
          onChange={onChange}
          placeholder="e.g., Friend, Relative"
        />
      </div>

      {/* Primary Witness 2 */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Witness 2 Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.witness2_name ? "is-invalid" : ""}`}
          name="witness2_name"
          value={formData.witness2_name}
          onChange={onChange}
          placeholder="Enter full name"
          required
        />
        {errors.witness2_name && (
          <div className="invalid-feedback">{errors.witness2_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Witness 2 Address <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.witness2_address ? "is-invalid" : ""}`}
          name="witness2_address"
          value={formData.witness2_address}
          onChange={onChange}
          placeholder="Enter complete address"
          required
        />
        {errors.witness2_address && (
          <div className="invalid-feedback">{errors.witness2_address}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Relationship to Couple</label>
        <input
          type="text"
          className="form-control"
          name="witness2_relationship"
          value={formData.witness2_relationship}
          onChange={onChange}
          placeholder="e.g., Friend, Relative"
        />
      </div>

      {/* Additional Witnesses Note */}
      <div className="col-12">
        <div className="alert alert-info">
          <i className="fas fa-info-circle"></i> Additional witnesses can be added in the remarks section if needed.
        </div>
      </div>
    </div>
  </div>
);

// Step 6: Finalize and Review
export const Step6Finalize = ({ formData }) => {
  return (
    <div>
      <h5 className="mb-3">Review and Submit</h5>
      <div className="alert alert-info">
        <i className="fas fa-info-circle"></i> Please review all information before submitting.
        Once submitted, the record will be added to the system.
      </div>

      <div className="row g-3">
        {/* Basic Marriage Information */}
        <div className="col-12">
          <div className="card border-0 bg-white">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(1, 129, 129, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Basic Marriage Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Date of Marriage</label>
                  <div className="text-dark">{formatDate(formData.date_of_marriage)}</div>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Time of Marriage</label>
                  <div className="text-dark">{formatTime(formData.time_of_marriage)}</div>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Type of Marriage</label>
                  <div className="text-dark">{formData.marriage_type || 'Not specified'}</div>
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Place of Marriage</label>
                  <div className="text-dark">{formData.place_of_marriage || 'Not specified'}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">License Number</label>
                  <div className="text-dark">{formData.license_number || 'Not specified'}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Property Regime</label>
                  <div className="text-dark">{formData.property_regime || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Couple Information */}
        <div className="col-md-6">
          <div className="card border-0 bg-white h-100">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(23, 162, 184, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-male me-2 text-info"></i>
                Husband's Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Name</label>
                <div className="text-dark">
                  {formData.husband_first_name} {formData.husband_middle_name} {formData.husband_last_name}
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Date of Birth</label>
                <div className="text-dark">{formatDate(formData.husband_birthdate)}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Citizenship</label>
                <div className="text-dark">{formData.husband_citizenship || 'Not specified'}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Civil Status</label>
                <div className="text-dark">{formData.husband_civil_status || 'Not specified'}</div>
              </div>
              <div>
                <label className="form-label fw-semibold text-dark mb-1">Address</label>
                <div className="text-dark" style={{ lineHeight: "1.6" }}>{formData.husband_address || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 bg-white h-100">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(232, 62, 140, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-female me-2 text-pink"></i>
                Wife's Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Name</label>
                <div className="text-dark">
                  {formData.wife_first_name} {formData.wife_middle_name} {formData.wife_last_name}
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Date of Birth</label>
                <div className="text-dark">{formatDate(formData.wife_birthdate)}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Citizenship</label>
                <div className="text-dark">{formData.wife_citizenship || 'Not specified'}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Civil Status</label>
                <div className="text-dark">{formData.wife_civil_status || 'Not specified'}</div>
              </div>
              <div>
                <label className="form-label fw-semibold text-dark mb-1">Address</label>
                <div className="text-dark" style={{ lineHeight: "1.6" }}>{formData.wife_address || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ceremony Details */}
        <div className="col-12">
          <div className="card border-0 bg-white">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(255, 193, 7, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-ring me-2 text-warning"></i>
                Ceremony Details
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Officiating Officer</label>
                  <div className="text-dark">{formData.officiating_officer || 'Not specified'}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Officiant Title</label>
                  <div className="text-dark">{formData.officiant_title || 'Not specified'}</div>
                </div>
                {formData.marriage_remarks && (
                  <div className="col-12 mt-2">
                    <label className="form-label fw-semibold text-dark mb-1">Additional Remarks</label>
                    <div className="text-dark" style={{ lineHeight: "1.6" }}>{formData.marriage_remarks}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Witnesses */}
        <div className="col-12">
          <div className="card border-0 bg-white">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(40, 167, 69, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-users me-2 text-success"></i>
                Witnesses
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-dark mb-1">Witness 1</label>
                  <div className="text-dark">
                    <div><strong>Name:</strong> {formData.witness1_name || 'Not specified'}</div>
                    <div><strong>Address:</strong> {formData.witness1_address || 'Not specified'}</div>
                    {formData.witness1_relationship && (
                      <div><strong>Relationship:</strong> {formData.witness1_relationship}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-dark mb-1">Witness 2</label>
                  <div className="text-dark">
                    <div><strong>Name:</strong> {formData.witness2_name || 'Not specified'}</div>
                    <div><strong>Address:</strong> {formData.witness2_address || 'Not specified'}</div>
                    {formData.witness2_relationship && (
                      <div><strong>Relationship:</strong> {formData.witness2_relationship}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="form-check mt-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="confirmMarriageAccuracy"
          required
        />
        <label className="form-check-label" htmlFor="confirmMarriageAccuracy">
          I confirm that all information provided is accurate to the best of my knowledge and I understand that this record will be permanently added to the system.
          <span className="text-danger">*</span>
        </label>
      </div>

      <style>{`
        .text-pink {
          color: #e83e8c !important;
        }
        .card {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .subsection-title {
          color: var(--secondary);
          font-weight: 600;
          font-size: 0.9rem;
          margin: 15px 0 10px 0;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
};