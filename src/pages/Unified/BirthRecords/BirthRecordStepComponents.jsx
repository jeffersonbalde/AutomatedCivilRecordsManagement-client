// src/pages/BirthRecords/components/BirthRecordStepComponents.jsx
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

// Step 1: Child Information
export const Step1ChildInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Child Information</h5>
    <div className="row g-3">
      {/* Child Name */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.child_first_name ? "is-invalid" : ""}`}
          name="child_first_name"
          value={formData.child_first_name}
          onChange={onChange}
          placeholder="Enter first name"
        />
        {errors.child_first_name && (
          <div className="invalid-feedback">{errors.child_first_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Middle Name</label>
        <input
          type="text"
          className="form-control"
          name="child_middle_name"
          value={formData.child_middle_name}
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
          className={`form-control ${errors.child_last_name ? "is-invalid" : ""}`}
          name="child_last_name"
          value={formData.child_last_name}
          onChange={onChange}
          placeholder="Enter last name"
        />
        {errors.child_last_name && (
          <div className="invalid-feedback">{errors.child_last_name}</div>
        )}
      </div>

      {/* Sex and Date of Birth */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Sex <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.sex ? "is-invalid" : ""}`}
          name="sex"
          value={formData.sex}
          onChange={onChange}
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.sex && <div className="invalid-feedback">{errors.sex}</div>}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Date of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.date_of_birth ? "is-invalid" : ""}`}
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={onChange}
        />
        {errors.date_of_birth && (
          <div className="invalid-feedback">{errors.date_of_birth}</div>
        )}
      </div>

      {/* Place of Birth */}
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">
          Place of Birth (Hospital/Institution) <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.place_of_birth ? "is-invalid" : ""}`}
          name="place_of_birth"
          value={formData.place_of_birth}
          onChange={onChange}
          placeholder="e.g., Pagadian City Medical Center"
        />
        {errors.place_of_birth && (
          <div className="invalid-feedback">{errors.place_of_birth}</div>
        )}
      </div>

      {/* Birth Address */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">House No., Street</label>
        <input
          type="text"
          className="form-control"
          name="birth_address_house"
          value={formData.birth_address_house}
          onChange={onChange}
          placeholder="House No., Street"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Barangay</label>
        <input
          type="text"
          className="form-control"
          name="birth_address_barangay"
          value={formData.birth_address_barangay}
          onChange={onChange}
          placeholder="Barangay"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          City/Municipality <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.birth_address_city ? "is-invalid" : ""}`}
          name="birth_address_city"
          value={formData.birth_address_city}
          onChange={onChange}
          placeholder="City/Municipality"
        />
        {errors.birth_address_city && (
          <div className="invalid-feedback">{errors.birth_address_city}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Province</label>
        <input
          type="text"
          className="form-control"
          name="birth_address_province"
          value={formData.birth_address_province}
          onChange={onChange}
          placeholder="Province"
          defaultValue="Zamboanga del Sur"
        />
      </div>

      {/* Birth Type and Order */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Type of Birth <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.type_of_birth ? "is-invalid" : ""}`}
          name="type_of_birth"
          value={formData.type_of_birth}
          onChange={onChange}
        >
          <option value="Single">Single</option>
          <option value="Twin">Twin</option>
          <option value="Triplet">Triplet</option>
          <option value="Quadruplet">Quadruplet</option>
          <option value="Other">Other</option>
        </select>
        {errors.type_of_birth && (
          <div className="invalid-feedback">{errors.type_of_birth}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          If Multiple Birth, Child was
        </label>
        <select
          className="form-select"
          name="multiple_birth_order"
          value={formData.multiple_birth_order}
          onChange={onChange}
          disabled={formData.type_of_birth === "Single"}
        >
          <option value="">Select Birth Order</option>
          <option value="First">First</option>
          <option value="Second">Second</option>
          <option value="Third">Third</option>
          <option value="Fourth">Fourth</option>
          <option value="Fifth">Fifth</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Birth Order (1st, 2nd, 3rd child, etc.) <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className={`form-control ${errors.birth_order ? "is-invalid" : ""}`}
          name="birth_order"
          value={formData.birth_order}
          onChange={onChange}
          min="1"
          placeholder="1"
        />
        {errors.birth_order && (
          <div className="invalid-feedback">{errors.birth_order}</div>
        )}
      </div>

      {/* Birth Weight and Time */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Birth Weight (kg)</label>
        <input
          type="number"
          className="form-control"
          name="birth_weight"
          value={formData.birth_weight}
          onChange={onChange}
          step="0.01"
          min="0.5"
          max="10"
          placeholder="e.g., 3.2"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Time of Birth</label>
        <input
          type="time"
          className="form-control"
          name="time_of_birth"
          value={formData.time_of_birth}
          onChange={onChange}
        />
      </div>

      {/* Birth Notes */}
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">Additional Birth Notes</label>
        <textarea
          className="form-control"
          name="birth_notes"
          value={formData.birth_notes}
          onChange={onChange}
          rows="3"
          placeholder="Any additional birth details or remarks"
        />
      </div>
    </div>
  </div>
);

// Step 2: Mother Information
export const Step2MotherInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Mother's Information</h5>
    <div className="row g-3">
      {/* Mother's Name */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.mother_first_name ? "is-invalid" : ""}`}
          name="mother_first_name"
          value={formData.mother_first_name}
          onChange={onChange}
          placeholder="Enter first name"
        />
        {errors.mother_first_name && (
          <div className="invalid-feedback">{errors.mother_first_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Middle Name</label>
        <input
          type="text"
          className="form-control"
          name="mother_middle_name"
          value={formData.mother_middle_name}
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
          className={`form-control ${errors.mother_last_name ? "is-invalid" : ""}`}
          name="mother_last_name"
          value={formData.mother_last_name}
          onChange={onChange}
          placeholder="Enter last name"
        />
        {errors.mother_last_name && (
          <div className="invalid-feedback">{errors.mother_last_name}</div>
        )}
      </div>

      {/* Citizenship and Religion */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.mother_citizenship ? "is-invalid" : ""}`}
          name="mother_citizenship"
          value={formData.mother_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
        />
        {errors.mother_citizenship && (
          <div className="invalid-feedback">{errors.mother_citizenship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Religion/Religious Sect</label>
        <input
          type="text"
          className="form-control"
          name="mother_religion"
          value={formData.mother_religion}
          onChange={onChange}
          placeholder="e.g., Roman Catholic"
        />
      </div>

      {/* Children Information */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Total Children Born Alive <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className="form-control"
          name="mother_children_born_alive"
          value={formData.mother_children_born_alive}
          onChange={onChange}
          min="0"
          placeholder="0"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Children Still Living <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className="form-control"
          name="mother_children_still_living"
          value={formData.mother_children_still_living}
          onChange={onChange}
          min="0"
          placeholder="0"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          Children Born Alive but Deceased <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className="form-control"
          name="mother_children_deceased"
          value={formData.mother_children_deceased}
          onChange={onChange}
          min="0"
          placeholder="0"
        />
      </div>

      {/* Occupation and Age */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Occupation</label>
        <input
          type="text"
          className="form-control"
          name="mother_occupation"
          value={formData.mother_occupation}
          onChange={onChange}
          placeholder="e.g., Teacher, Housewife"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Age at Time of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className={`form-control ${errors.mother_age_at_birth ? "is-invalid" : ""}`}
          name="mother_age_at_birth"
          value={formData.mother_age_at_birth}
          onChange={onChange}
          min="15"
          max="60"
          placeholder="e.g., 28"
        />
        {errors.mother_age_at_birth && (
          <div className="invalid-feedback">{errors.mother_age_at_birth}</div>
        )}
      </div>

      {/* Mother's Residence */}
      <div className="col-12">
        <h6 className="mt-3 mb-2 border-bottom pb-2">Mother's Residence</h6>
      </div>
      <div className="col-md-3">
        <label className="form-label small fw-semibold mb-1">House No., Street</label>
        <input
          type="text"
          className="form-control"
          name="mother_house_no"
          value={formData.mother_house_no}
          onChange={onChange}
          placeholder="House No., Street"
        />
      </div>
      <div className="col-md-3">
        <label className="form-label small fw-semibold mb-1">
          Barangay <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.mother_barangay ? "is-invalid" : ""}`}
          name="mother_barangay"
          value={formData.mother_barangay}
          onChange={onChange}
          placeholder="Barangay"
        />
        {errors.mother_barangay && (
          <div className="invalid-feedback">{errors.mother_barangay}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          City/Municipality <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.mother_city ? "is-invalid" : ""}`}
          name="mother_city"
          value={formData.mother_city}
          onChange={onChange}
          placeholder="City/Municipality"
        />
        {errors.mother_city && (
          <div className="invalid-feedback">{errors.mother_city}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Province <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="mother_province"
          value={formData.mother_province}
          onChange={onChange}
          placeholder="Province"
          defaultValue="Zamboanga del Sur"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Country <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="mother_country"
          value={formData.mother_country}
          onChange={onChange}
          placeholder="Country"
          defaultValue="Philippines"
        />
      </div>
    </div>
  </div>
);

// Step 3: Father Information
export const Step3FatherInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Father's Information</h5>
    <div className="row g-3">
      {/* Father's Name */}
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.father_first_name ? "is-invalid" : ""}`}
          name="father_first_name"
          value={formData.father_first_name}
          onChange={onChange}
          placeholder="Enter first name"
        />
        {errors.father_first_name && (
          <div className="invalid-feedback">{errors.father_first_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Middle Name</label>
        <input
          type="text"
          className="form-control"
          name="father_middle_name"
          value={formData.father_middle_name}
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
          className={`form-control ${errors.father_last_name ? "is-invalid" : ""}`}
          name="father_last_name"
          value={formData.father_last_name}
          onChange={onChange}
          placeholder="Enter last name"
        />
        {errors.father_last_name && (
          <div className="invalid-feedback">{errors.father_last_name}</div>
        )}
      </div>

      {/* Citizenship and Religion */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Citizenship <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.father_citizenship ? "is-invalid" : ""}`}
          name="father_citizenship"
          value={formData.father_citizenship}
          onChange={onChange}
          placeholder="e.g., Filipino"
        />
        {errors.father_citizenship && (
          <div className="invalid-feedback">{errors.father_citizenship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Religion/Religious Sect</label>
        <input
          type="text"
          className="form-control"
          name="father_religion"
          value={formData.father_religion}
          onChange={onChange}
          placeholder="e.g., Roman Catholic"
        />
      </div>

      {/* Occupation and Age */}
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Occupation</label>
        <input
          type="text"
          className="form-control"
          name="father_occupation"
          value={formData.father_occupation}
          onChange={onChange}
          placeholder="e.g., Engineer, Farmer"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Age at Time of Birth <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          className={`form-control ${errors.father_age_at_birth ? "is-invalid" : ""}`}
          name="father_age_at_birth"
          value={formData.father_age_at_birth}
          onChange={onChange}
          min="15"
          max="80"
          placeholder="e.g., 32"
        />
        {errors.father_age_at_birth && (
          <div className="invalid-feedback">{errors.father_age_at_birth}</div>
        )}
      </div>

      {/* Father's Residence */}
      <div className="col-12">
        <h6 className="mt-3 mb-2 border-bottom pb-2">Father's Residence</h6>
      </div>
      <div className="col-md-3">
        <label className="form-label small fw-semibold mb-1">House No., Street</label>
        <input
          type="text"
          className="form-control"
          name="father_house_no"
          value={formData.father_house_no}
          onChange={onChange}
          placeholder="House No., Street"
        />
      </div>
      <div className="col-md-3">
        <label className="form-label small fw-semibold mb-1">
          Barangay <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.father_barangay ? "is-invalid" : ""}`}
          name="father_barangay"
          value={formData.father_barangay}
          onChange={onChange}
          placeholder="Barangay"
        />
        {errors.father_barangay && (
          <div className="invalid-feedback">{errors.father_barangay}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          City/Municipality <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.father_city ? "is-invalid" : ""}`}
          name="father_city"
          value={formData.father_city}
          onChange={onChange}
          placeholder="City/Municipality"
        />
        {errors.father_city && (
          <div className="invalid-feedback">{errors.father_city}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Province <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="father_province"
          value={formData.father_province}
          onChange={onChange}
          placeholder="Province"
          defaultValue="Zamboanga del Sur"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Country <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="father_country"
          value={formData.father_country}
          onChange={onChange}
          placeholder="Country"
          defaultValue="Philippines"
        />
      </div>
    </div>
  </div>
);

// Step 4: Parents Marriage Information
export const Step4ParentsMarriage = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Parents Marriage Information</h5>
    <div className="alert alert-info">
      <i className="fas fa-info-circle"></i> Complete this section if parents are married. If not married, leave blank.
    </div>
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Date of Marriage</label>
        <input
          type="date"
          className="form-control"
          name="marriage_date"
          value={formData.marriage_date}
          onChange={onChange}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Place of Marriage (City/Municipality)</label>
        <input
          type="text"
          className="form-control"
          name="marriage_place_city"
          value={formData.marriage_place_city}
          onChange={onChange}
          placeholder="City/Municipality"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Province</label>
        <input
          type="text"
          className="form-control"
          name="marriage_place_province"
          value={formData.marriage_place_province}
          onChange={onChange}
          placeholder="Province"
          defaultValue="Zamboanga del Sur"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Country</label>
        <input
          type="text"
          className="form-control"
          name="marriage_place_country"
          value={formData.marriage_place_country}
          onChange={onChange}
          placeholder="Country"
          defaultValue="Philippines"
        />
      </div>
    </div>
  </div>
);

// Step 5: Birth Details
export const Step5BirthDetails = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Birth Details</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Time of Birth</label>
        <input
          type="time"
          className="form-control"
          name="time_of_birth"
          value={formData.time_of_birth}
          onChange={onChange}
        />
        <small className="text-muted">If not specified earlier</small>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Birth Weight (kg)</label>
        <input
          type="number"
          className="form-control"
          name="birth_weight"
          value={formData.birth_weight}
          onChange={onChange}
          step="0.01"
          min="0.5"
          max="10"
          placeholder="e.g., 3.2"
        />
        <small className="text-muted">If not specified earlier</small>
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">Additional Birth Notes</label>
        <textarea
          className="form-control"
          name="birth_notes"
          value={formData.birth_notes}
          onChange={onChange}
          rows="4"
          placeholder="Any additional birth details, complications, or special circumstances"
        />
      </div>
    </div>
  </div>
);

// Step 6: Attendant Information
export const Step6AttendantInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Birth Attendant Information</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Attendant Type <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.attendant_type ? "is-invalid" : ""}`}
          name="attendant_type"
          value={formData.attendant_type}
          onChange={onChange}
        >
          <option value="">Select Attendant Type</option>
          <option value="Physician">Physician</option>
          <option value="Nurse">Nurse</option>
          <option value="Midwife">Midwife</option>
          <option value="Hilot">Hilot (Traditional Birth Attendant)</option>
          <option value="Other">Other</option>
        </select>
        {errors.attendant_type && (
          <div className="invalid-feedback">{errors.attendant_type}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Attendant Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.attendant_name ? "is-invalid" : ""}`}
          name="attendant_name"
          value={formData.attendant_name}
          onChange={onChange}
          placeholder="Full name of attendant"
        />
        {errors.attendant_name && (
          <div className="invalid-feedback">{errors.attendant_name}</div>
        )}
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">License Number (if applicable)</label>
        <input
          type="text"
          className="form-control"
          name="attendant_license"
          value={formData.attendant_license}
          onChange={onChange}
          placeholder="e.g., PRC-123456"
        />
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">
          Certification Statement <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.attendant_certification ? "is-invalid" : ""}`}
          name="attendant_certification"
          value={formData.attendant_certification}
          onChange={onChange}
          rows="3"
          placeholder="I hereby certify that I attended the birth of the child who was born alive..."
        />
        {errors.attendant_certification && (
          <div className="invalid-feedback">{errors.attendant_certification}</div>
        )}
        <small className="text-muted">
          Standard statement: "I hereby certify that I attended the birth of the child who was born alive at the time and date specified above."
        </small>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Attendant Address <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.attendant_address ? "is-invalid" : ""}`}
          name="attendant_address"
          value={formData.attendant_address}
          onChange={onChange}
          placeholder="Complete address"
        />
        {errors.attendant_address && (
          <div className="invalid-feedback">{errors.attendant_address}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Title/Position <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.attendant_title ? "is-invalid" : ""}`}
          name="attendant_title"
          value={formData.attendant_title}
          onChange={onChange}
          placeholder="e.g., Medical Doctor, Registered Midwife"
        />
        {errors.attendant_title && (
          <div className="invalid-feedback">{errors.attendant_title}</div>
        )}
      </div>
    </div>
  </div>
);

// Step 7: Informant Information
export const Step7InformantInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Informant Information</h5>
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.informant_first_name ? "is-invalid" : ""}`}
          name="informant_first_name"
          value={formData.informant_first_name}
          onChange={onChange}
          placeholder="Enter first name"
        />
        {errors.informant_first_name && (
          <div className="invalid-feedback">{errors.informant_first_name}</div>
        )}
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-semibold mb-1">Middle Name</label>
        <input
          type="text"
          className="form-control"
          name="informant_middle_name"
          value={formData.informant_middle_name}
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
          className={`form-control ${errors.informant_last_name ? "is-invalid" : ""}`}
          name="informant_last_name"
          value={formData.informant_last_name}
          onChange={onChange}
          placeholder="Enter last name"
        />
        {errors.informant_last_name && (
          <div className="invalid-feedback">{errors.informant_last_name}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Relationship to Child <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.informant_relationship ? "is-invalid" : ""}`}
          name="informant_relationship"
          value={formData.informant_relationship}
          onChange={onChange}
        >
          <option value="">Select Relationship</option>
          <option value="Parent">Parent</option>
          <option value="Relative">Relative</option>
          <option value="Hospital Staff">Hospital Staff</option>
          <option value="Other">Other</option>
        </select>
        {errors.informant_relationship && (
          <div className="invalid-feedback">{errors.informant_relationship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Address <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.informant_address ? "is-invalid" : ""}`}
          name="informant_address"
          value={formData.informant_address}
          onChange={onChange}
          placeholder="Complete address"
        />
        {errors.informant_address && (
          <div className="invalid-feedback">{errors.informant_address}</div>
        )}
      </div>
      <div className="col-12">
        <div className="form-check">
          <input
            className={`form-check-input ${errors.informant_certification_accepted ? "is-invalid" : ""}`}
            type="checkbox"
            id="informantCertification"
            name="informant_certification_accepted"
            checked={formData.informant_certification_accepted}
            onChange={onChange}
          />
          <label className="form-check-label" htmlFor="informantCertification">
            I hereby certify that all information supplied are true and correct to my own knowledge and belief.
            <span className="text-danger">*</span>
          </label>
          {errors.informant_certification_accepted && (
            <div className="invalid-feedback d-block">
              {errors.informant_certification_accepted}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Step 8: Finalize and Review
export const Step8Finalize = ({ formData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div>
      <h5 className="mb-3">Review and Submit</h5>
      <div className="alert alert-info">
        <i className="fas fa-info-circle"></i> Please review all information before submitting.
        Once submitted, the record will be updated in the system.
      </div>

      <div className="row g-4">
        {/* Child Information Summary */}
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-header bg-primary bg-opacity-10">
              <h6 className="mb-0 text-primary">
                <i className="fas fa-baby me-2"></i>
                Child Information
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <strong>Full Name:</strong><br />
                  {formData.child_first_name} {formData.child_middle_name} {formData.child_last_name}
                </div>
                <div className="col-md-2">
                  <strong>Sex:</strong><br />
                  {formData.sex || 'Not specified'}
                </div>
                <div className="col-md-3">
                  <strong>Date of Birth:</strong><br />
                  {formatDate(formData.date_of_birth)}
                </div>
                <div className="col-md-3">
                  <strong>Time of Birth:</strong><br />
                  {formatTime(formData.time_of_birth)}
                </div>
                <div className="col-12 mt-2">
                  <strong>Place of Birth:</strong><br />
                  {formData.place_of_birth || 'Not specified'}
                </div>
                <div className="col-12 mt-2">
                  <strong>Birth Address:</strong><br />
                  {[formData.birth_address_house, formData.birth_address_barangay, formData.birth_address_city, formData.birth_address_province]
                    .filter(Boolean).join(', ') || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parents Information Summary */}
        <div className="col-md-6">
          <div className="card border-0 bg-light h-100">
            <div className="card-header bg-success bg-opacity-10">
              <h6 className="mb-0 text-success">
                <i className="fas fa-female me-2"></i>
                Mother's Information
              </h6>
            </div>
            <div className="card-body">
              <strong>Name:</strong> {formData.mother_first_name} {formData.mother_middle_name} {formData.mother_last_name}<br />
              <strong>Citizenship:</strong> {formData.mother_citizenship || 'Not specified'}<br />
              <strong>Age at Birth:</strong> {formData.mother_age_at_birth || 'Not specified'}<br />
              <strong>Occupation:</strong> {formData.mother_occupation || 'Not specified'}<br />
              <strong>Children:</strong> Born: {formData.mother_children_born_alive}, Living: {formData.mother_children_still_living}, Deceased: {formData.mother_children_deceased}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 bg-light h-100">
            <div className="card-header bg-info bg-opacity-10">
              <h6 className="mb-0 text-info">
                <i className="fas fa-male me-2"></i>
                Father's Information
              </h6>
            </div>
            <div className="card-body">
              <strong>Name:</strong> {formData.father_first_name} {formData.father_middle_name} {formData.father_last_name}<br />
              <strong>Citizenship:</strong> {formData.father_citizenship || 'Not specified'}<br />
              <strong>Age at Birth:</strong> {formData.father_age_at_birth || 'Not specified'}<br />
              <strong>Occupation:</strong> {formData.father_occupation || 'Not specified'}
            </div>
          </div>
        </div>

        {/* Birth Details Summary */}
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-header bg-warning bg-opacity-10">
              <h6 className="mb-0 text-warning">
                <i className="fas fa-info-circle me-2"></i>
                Birth Details
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <strong>Type of Birth:</strong><br />
                  {formData.type_of_birth || 'Not specified'}
                </div>
                <div className="col-md-3">
                  <strong>Birth Order:</strong><br />
                  {formData.birth_order || 'Not specified'}
                </div>
                <div className="col-md-3">
                  <strong>Birth Weight:</strong><br />
                  {formData.birth_weight ? `${formData.birth_weight} kg` : 'Not specified'}
                </div>
                <div className="col-md-3">
                  <strong>Multiple Birth Order:</strong><br />
                  {formData.multiple_birth_order || 'N/A'}
                </div>
                {formData.birth_notes && (
                  <div className="col-12 mt-2">
                    <strong>Additional Notes:</strong><br />
                    {formData.birth_notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attendant and Informant Summary */}
        <div className="col-md-6">
          <div className="card border-0 bg-light h-100">
            <div className="card-header bg-secondary bg-opacity-10">
              <h6 className="mb-0 text-secondary">
                <i className="fas fa-user-md me-2"></i>
                Birth Attendant
              </h6>
            </div>
            <div className="card-body">
              <strong>Name:</strong> {formData.attendant_name || 'Not specified'}<br />
              <strong>Type:</strong> {formData.attendant_type || 'Not specified'}<br />
              <strong>Title:</strong> {formData.attendant_title || 'Not specified'}<br />
              <strong>License:</strong> {formData.attendant_license || 'Not specified'}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 bg-light h-100">
            <div className="card-header bg-dark bg-opacity-10">
              <h6 className="mb-0 text-dark">
                <i className="fas fa-user me-2"></i>
                Informant
              </h6>
            </div>
            <div className="card-body">
              <strong>Name:</strong> {formData.informant_first_name} {formData.informant_middle_name} {formData.informant_last_name}<br />
              <strong>Relationship:</strong> {formData.informant_relationship || 'Not specified'}<br />
              <strong>Certification Accepted:</strong> {formData.informant_certification_accepted ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>

      <div className="form-check mt-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="confirmAccuracy"
          required
        />
        <label className="form-check-label" htmlFor="confirmAccuracy">
          I confirm that all information provided is accurate to the best of my knowledge and I understand that this record will be permanently updated in the system.
          <span className="text-danger">*</span>
        </label>
      </div>
    </div>
  );
};