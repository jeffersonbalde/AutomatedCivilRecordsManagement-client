// src/pages/DeathRecords/components/DeathRecordStepComponents.jsx
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

// Step 1: Personal Information
export const Step1PersonalInfo = ({ formData, errors, onChange }) => {
  const handleAgeUnder1Change = (e) => {
    const { checked } = e.target;
    onChange(e); // Update the checkbox value
    
    // If "Under 1 year" is checked, clear the years field
    if (checked) {
      onChange({
        target: {
          name: 'age_years',
          value: ''
        }
      });
    }
  };

  return (
    <div>
      <h5 className="mb-3">Personal Information</h5>
      <div className="row g-3">
        {/* Name */}
        <div className="col-md-4">
          <label className="form-label small fw-semibold mb-1">
            First Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            name="first_name"
            value={formData.first_name}
            onChange={onChange}
            placeholder="Enter first name"
          />
          {errors.first_name && (
            <div className="invalid-feedback">{errors.first_name}</div>
          )}
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold mb-1">Middle Name</label>
          <input
            type="text"
            className="form-control"
            name="middle_name"
            value={formData.middle_name}
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
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            name="last_name"
            value={formData.last_name}
            onChange={onChange}
            placeholder="Enter last name"
          />
          {errors.last_name && (
            <div className="invalid-feedback">{errors.last_name}</div>
          )}
        </div>

        {/* Sex and Civil Status */}
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
            Civil Status <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.civil_status ? "is-invalid" : ""}`}
            name="civil_status"
            value={formData.civil_status}
            onChange={onChange}
          >
            <option value="">Select Civil Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
            <option value="Annulled">Annulled</option>
          </select>
          {errors.civil_status && (
            <div className="invalid-feedback">{errors.civil_status}</div>
          )}
        </div>

        {/* Dates */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">
            Date of Death <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.date_of_death ? "is-invalid" : ""}`}
            name="date_of_death"
            value={formData.date_of_death}
            onChange={onChange}
          />
          {errors.date_of_death && (
            <div className="invalid-feedback">{errors.date_of_death}</div>
          )}
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

        {/* Age at Time of Death */}
        <div className="col-12">
          <h6 className="subsection-title">Age at Time of Death</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold mb-1">
                Completed Years (if 1 year or above)
              </label>
              <input
                type="number"
                className="form-control"
                name="age_years"
                value={formData.age_years}
                onChange={onChange}
                min="0"
                disabled={formData.age_under_1}
              />
            </div>
            <div className="col-md-6">
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input 
                    type="checkbox" 
                    name="age_under_1" 
                    checked={formData.age_under_1}
                    onChange={handleAgeUnder1Change}
                  /> 
                  Under 1 year
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="age_months" 
                    placeholder="Months"
                    value={formData.age_months}
                    onChange={onChange}
                    min="0"
                    max="11"
                  />
                </div>
                <div className="col-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="age_days" 
                    placeholder="Days"
                    value={formData.age_days}
                    onChange={onChange}
                    min="0"
                    max="30"
                  />
                </div>
                <div className="col-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="age_hours" 
                    placeholder="Hours"
                    value={formData.age_hours}
                    onChange={onChange}
                    min="0"
                    max="23"
                  />
                </div>
                <div className="col-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    name="age_minutes" 
                    placeholder="Minutes"
                    value={formData.age_minutes}
                    onChange={onChange}
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Place of Death */}
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">
            Place of Death (Hospital/Clinic/Institution/House No., St., Barangay, City/Municipality, Province) <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.place_of_death ? "is-invalid" : ""}`}
            name="place_of_death"
            value={formData.place_of_death}
            onChange={onChange}
            style={{ height: "80px" }}
            placeholder="Complete address of death location"
          />
          {errors.place_of_death && (
            <div className="invalid-feedback">{errors.place_of_death}</div>
          )}
        </div>

        {/* Religion and Citizenship */}
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">Religion/Religious Sect</label>
          <input
            type="text"
            className="form-control"
            name="religion"
            value={formData.religion}
            onChange={onChange}
            placeholder="e.g., Roman Catholic"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">
            Citizenship <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.citizenship ? "is-invalid" : ""}`}
            name="citizenship"
            value={formData.citizenship}
            onChange={onChange}
            placeholder="e.g., Filipino"
          />
          {errors.citizenship && (
            <div className="invalid-feedback">{errors.citizenship}</div>
          )}
        </div>

        {/* Residence */}
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">
            Residence (House No., St., Barangay, City/Municipality, Province, Country) <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.residence ? "is-invalid" : ""}`}
            name="residence"
            value={formData.residence}
            onChange={onChange}
            style={{ height: "80px" }}
            placeholder="Complete residential address"
          />
          {errors.residence && (
            <div className="invalid-feedback">{errors.residence}</div>
          )}
        </div>

        {/* Occupation */}
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">Occupation</label>
          <input
            type="text"
            className="form-control"
            name="occupation"
            value={formData.occupation}
            onChange={onChange}
            placeholder="e.g., Teacher, Farmer"
          />
        </div>

        {/* Parents Information */}
        <div className="col-12">
          <h6 className="subsection-title">Parents Information</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">
            Name of Father <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.father_name ? "is-invalid" : ""}`}
            name="father_name"
            value={formData.father_name}
            onChange={onChange}
            placeholder="Full name of father"
          />
          {errors.father_name && (
            <div className="invalid-feedback">{errors.father_name}</div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">
            Maiden Name of Mother <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.mother_maiden_name ? "is-invalid" : ""}`}
            name="mother_maiden_name"
            value={formData.mother_maiden_name}
            onChange={onChange}
            placeholder="Maiden name of mother"
          />
          {errors.mother_maiden_name && (
            <div className="invalid-feedback">{errors.mother_maiden_name}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 2: Medical Information
export const Step2MedicalInfo = ({ formData, errors, onChange }) => {
  const showMaternalCondition = formData.sex === 'Female';

  return (
    <div>
      <h5 className="mb-3">Medical Certificate Information</h5>
      <div className="row g-3">
        <div className="col-12">
          <h6 className="subsection-title">Causes of Death</h6>
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">
            I. Immediate cause <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.immediate_cause ? "is-invalid" : ""}`}
            name="immediate_cause"
            value={formData.immediate_cause}
            onChange={onChange}
            placeholder="Primary cause of death"
          />
          {errors.immediate_cause && (
            <div className="invalid-feedback">{errors.immediate_cause}</div>
          )}
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">Antecedent cause</label>
          <input
            type="text"
            className="form-control"
            name="antecedent_cause"
            value={formData.antecedent_cause}
            onChange={onChange}
            placeholder="Conditions leading to immediate cause"
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">Underlying cause</label>
          <input
            type="text"
            className="form-control"
            name="underlying_cause"
            value={formData.underlying_cause}
            onChange={onChange}
            placeholder="Original underlying disease/injury"
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">II. Other significant conditions contributing to death</label>
          <input
            type="text"
            className="form-control"
            name="other_significant_conditions"
            value={formData.other_significant_conditions}
            onChange={onChange}
            placeholder="Other contributing conditions"
          />
        </div>

        {/* Maternal Condition - Only show for females */}
        {showMaternalCondition && (
          <div className="col-12" id="maternalConditionSection">
            <h6 className="subsection-title">Maternal Condition (If female aged 15-49 years old)</h6>
            <div className="radio-group">
              <div className="radio-item">
                <input 
                  type="radio" 
                  name="maternal_condition" 
                  value="Pregnant"
                  checked={formData.maternal_condition === 'Pregnant'}
                  onChange={onChange}
                /> Pregnant
              </div>
              <div className="radio-item">
                <input 
                  type="radio" 
                  name="maternal_condition" 
                  value="Pregnant, in labour"
                  checked={formData.maternal_condition === 'Pregnant, in labour'}
                  onChange={onChange}
                /> Pregnant, in labour
              </div>
              <div className="radio-item">
                <input 
                  type="radio" 
                  name="maternal_condition" 
                  value="Less than 42 days after delivery"
                  checked={formData.maternal_condition === 'Less than 42 days after delivery'}
                  onChange={onChange}
                /> Less than 42 days after delivery
              </div>
              <div className="radio-item">
                <input 
                  type="radio" 
                  name="maternal_condition" 
                  value="42 days to 1 year after delivery"
                  checked={formData.maternal_condition === '42 days to 1 year after delivery'}
                  onChange={onChange}
                /> 42 days to 1 year after delivery
              </div>
              <div className="radio-item">
                <input 
                  type="radio" 
                  name="maternal_condition" 
                  value="None of the above"
                  checked={formData.maternal_condition === 'None of the above'}
                  onChange={onChange}
                /> None of the above
              </div>
            </div>
          </div>
        )}

        <div className="col-12">
          <h6 className="subsection-title">Death by External Causes</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">Manner of death (Homicide, Suicide, Accident, etc.)</label>
          <input
            type="text"
            className="form-control"
            name="manner_of_death"
            value={formData.manner_of_death}
            onChange={onChange}
            placeholder="e.g., Accident, Natural Causes"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">Place of occurrence (home, farm, factory, street, sea, etc.)</label>
          <input
            type="text"
            className="form-control"
            name="place_of_occurrence"
            value={formData.place_of_occurrence}
            onChange={onChange}
            placeholder="e.g., Home, Hospital, Street"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">Autopsy Performed?</label>
          <select
            className="form-select"
            name="autopsy"
            value={formData.autopsy}
            onChange={onChange}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">
            Attendant <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.attendant ? "is-invalid" : ""}`}
            name="attendant"
            value={formData.attendant}
            onChange={onChange}
          >
            <option value="">Select Attendant</option>
            <option value="Private Physician">Private Physician</option>
            <option value="Public Health Officer">Public Health Officer</option>
            <option value="Hospital Authority">Hospital Authority</option>
            <option value="None">None</option>
            <option value="Others">Others (Specify)</option>
          </select>
          {errors.attendant && (
            <div className="invalid-feedback">{errors.attendant}</div>
          )}
        </div>

        {/* Show other attendant field if "Others" is selected */}
        {formData.attendant === 'Others' && (
          <div className="col-12">
            <label className="form-label small fw-semibold mb-1">Specify Other Attendant</label>
            <input
              type="text"
              className="form-control"
              name="attendant_other"
              value={formData.attendant_other}
              onChange={onChange}
              placeholder="Specify other attendant type"
            />
          </div>
        )}

        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">If attended, duration from</label>
          <input
            type="date"
            className="form-control"
            name="attended_from"
            value={formData.attended_from}
            onChange={onChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold mb-1">If attended, duration to</label>
          <input
            type="date"
            className="form-control"
            name="attended_to"
            value={formData.attended_to}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

// Step 3: Death Certification
export const Step3DeathCertification = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Certification of Death</h5>
    <div className="row g-3">
      <div className="col-12">
        <div className="alert alert-info">
          <i className="fas fa-info-circle"></i>
          "I hereby certify that the foregoing particulars are correct as near as same can be ascertained and I further certify that I [ ] have attended / [ ] have not attended the deceased and that death occurred at ___ am/pm on the date of death specified above."
        </div>
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Signature</label>
        <input
          type="text"
          className="form-control"
          name="certifier_signature"
          value={formData.certifier_signature}
          onChange={onChange}
          placeholder="Signature of certifier"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Name in Print <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.certifier_name ? "is-invalid" : ""}`}
          name="certifier_name"
          value={formData.certifier_name}
          onChange={onChange}
          placeholder="Full name of certifier"
        />
        {errors.certifier_name && (
          <div className="invalid-feedback">{errors.certifier_name}</div>
        )}
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Title or Position</label>
        <input
          type="text"
          className="form-control"
          name="certifier_title"
          value={formData.certifier_title}
          onChange={onChange}
          placeholder="e.g., Medical Doctor"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Address</label>
        <input
          type="text"
          className="form-control"
          name="certifier_address"
          value={formData.certifier_address}
          onChange={onChange}
          placeholder="Address of certifier"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Date</label>
        <input
          type="date"
          className="form-control"
          name="certifier_date"
          value={formData.certifier_date}
          onChange={onChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Attended Deceased?</label>
        <select
          className="form-select"
          name="attended_deceased"
          value={formData.attended_deceased}
          onChange={onChange}
        >
          <option value="">Select Option</option>
          <option value="Yes">Have attended</option>
          <option value="No">Have not attended</option>
        </select>
      </div>

      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">Time of Death Occurrence (am/pm)</label>
        <input
          type="text"
          className="form-control"
          name="death_occurred_time"
          value={formData.death_occurred_time}
          onChange={onChange}
          placeholder="e.g., 10:30 AM"
        />
      </div>
    </div>
  </div>
);

// Step 4: Burial Details
export const Step4BurialDetails = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Corpse Disposal and Burial Details</h5>
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Corpse Disposal</label>
        <select
          className="form-select"
          name="corpse_disposal"
          value={formData.corpse_disposal}
          onChange={onChange}
        >
          <option value="">Select Disposal Method</option>
          <option value="Burial">Burial</option>
          <option value="Cremation">Cremation</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="col-12">
        <h6 className="subsection-title">Burial/Cremation Permit</h6>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Permit Number</label>
        <input
          type="text"
          className="form-control"
          name="burial_permit_number"
          value={formData.burial_permit_number}
          onChange={onChange}
          placeholder="Burial permit number"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Date Issued</label>
        <input
          type="date"
          className="form-control"
          name="burial_permit_date"
          value={formData.burial_permit_date}
          onChange={onChange}
        />
      </div>

      <div className="col-12">
        <h6 className="subsection-title">Transfer Permit</h6>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Transfer Permit Number</label>
        <input
          type="text"
          className="form-control"
          name="transfer_permit_number"
          value={formData.transfer_permit_number}
          onChange={onChange}
          placeholder="Transfer permit number"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Transfer Permit Date Issued</label>
        <input
          type="date"
          className="form-control"
          name="transfer_permit_date"
          value={formData.transfer_permit_date}
          onChange={onChange}
        />
      </div>

      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">Name of Cemetery or Crematory</label>
        <input
          type="text"
          className="form-control"
          name="cemetery_name"
          value={formData.cemetery_name}
          onChange={onChange}
          placeholder="Name of cemetery/crematory"
        />
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold mb-1">Address of Cemetery or Crematory</label>
        <textarea
          className="form-control"
          name="cemetery_address"
          value={formData.cemetery_address}
          onChange={onChange}
          style={{ height: "80px" }}
          placeholder="Complete address of cemetery/crematory"
        />
      </div>
    </div>
  </div>
);

// Step 5: Informant Information
export const Step5InformantInfo = ({ formData, errors, onChange }) => (
  <div>
    <h5 className="mb-3">Informant Certification</h5>
    <div className="row g-3">
      <div className="col-12">
        <div className="alert alert-info">
          <i className="fas fa-info-circle"></i>
          "I hereby certify that all information supplied are true and correct to my own knowledge and belief."
        </div>
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Signature</label>
        <input
          type="text"
          className="form-control"
          name="informant_signature"
          value={formData.informant_signature}
          onChange={onChange}
          placeholder="Signature of informant"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Name in Print <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.informant_name ? "is-invalid" : ""}`}
          name="informant_name"
          value={formData.informant_name}
          onChange={onChange}
          placeholder="Full name of informant"
        />
        {errors.informant_name && (
          <div className="invalid-feedback">{errors.informant_name}</div>
        )}
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">
          Relationship to the Deceased <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.informant_relationship ? "is-invalid" : ""}`}
          name="informant_relationship"
          value={formData.informant_relationship}
          onChange={onChange}
          placeholder="e.g., Son, Daughter, Spouse"
        />
        {errors.informant_relationship && (
          <div className="invalid-feedback">{errors.informant_relationship}</div>
        )}
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Address</label>
        <input
          type="text"
          className="form-control"
          name="informant_address"
          value={formData.informant_address}
          onChange={onChange}
          placeholder="Address of informant"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label small fw-semibold mb-1">Date</label>
        <input
          type="date"
          className="form-control"
          name="informant_date"
          value={formData.informant_date}
          onChange={onChange}
        />
      </div>
    </div>
  </div>
);

// Step 6: Finalize and Review
export const Step6Finalize = ({ formData }) => {
  const formatAgeAtDeath = () => {
    if (formData.age_under_1) {
      const parts = [];
      if (formData.age_months) parts.push(`${formData.age_months} months`);
      if (formData.age_days) parts.push(`${formData.age_days} days`);
      if (formData.age_hours) parts.push(`${formData.age_hours} hours`);
      if (formData.age_minutes) parts.push(`${formData.age_minutes} minutes`);
      return parts.length > 0 ? parts.join(', ') : 'Under 1 year';
    }
    return formData.age_years ? `${formData.age_years} years` : 'Not specified';
  };

  return (
    <div>
      <h5 className="mb-3">Review and Submit</h5>
      <div className="alert alert-info">
        <i className="fas fa-info-circle"></i> Please review all information before submitting.
        Once submitted, the record will be added to the system.
      </div>

      <div className="row g-3">
        {/* Personal Information */}
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
                <i className="fas fa-user me-2 text-danger"></i>
                Personal Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Full Name</label>
                  <div className="text-dark">
                    {formData.first_name} {formData.middle_name} {formData.last_name}
                  </div>
                </div>
                <div className="col-md-2 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Sex</label>
                  <div className="text-dark">{formData.sex || 'Not specified'}</div>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Civil Status</label>
                  <div className="text-dark">{formData.civil_status || 'Not specified'}</div>
                </div>
                <div className="col-md-3 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Age at Death</label>
                  <div className="text-dark">{formatAgeAtDeath()}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Date of Birth</label>
                  <div className="text-dark">{formatDate(formData.date_of_birth)}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Date of Death</label>
                  <div className="text-dark">{formatDate(formData.date_of_death)}</div>
                </div>
                <div className="col-12 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Place of Death</label>
                  <div className="text-dark">{formData.place_of_death || 'Not specified'}</div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-1">Residence</label>
                  <div className="text-dark">{formData.residence || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parents Information */}
        <div className="col-md-6">
          <div className="card border-0 bg-white h-100">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(1, 129, 129, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-male me-2 text-success"></i>
                Father's Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Name</label>
                <div className="text-dark">{formData.father_name || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 bg-white h-100">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(1, 129, 129, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-female me-2 text-info"></i>
                Mother's Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Maiden Name</label>
                <div className="text-dark">{formData.mother_maiden_name || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
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
                <i className="fas fa-stethoscope me-2 text-warning"></i>
                Medical Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Immediate Cause</label>
                  <div className="text-dark">{formData.immediate_cause || 'Not specified'}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Antecedent Cause</label>
                  <div className="text-dark">{formData.antecedent_cause || 'Not specified'}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Underlying Cause</label>
                  <div className="text-dark">{formData.underlying_cause || 'Not specified'}</div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Other Conditions</label>
                  <div className="text-dark">{formData.other_significant_conditions || 'Not specified'}</div>
                </div>
                {formData.maternal_condition && (
                  <div className="col-12 mb-2">
                    <label className="form-label fw-semibold text-dark mb-1">Maternal Condition</label>
                    <div className="text-dark">{formData.maternal_condition}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Certification and Burial Details */}
        <div className="col-md-6">
          <div className="card border-0 bg-white h-100">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(1, 129, 129, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-certificate me-2 text-secondary"></i>
                Death Certification
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Certifier</label>
                <div className="text-dark">{formData.certifier_name || 'Not specified'}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Title</label>
                <div className="text-dark">{formData.certifier_title || 'Not specified'}</div>
              </div>
              <div>
                <label className="form-label fw-semibold text-dark mb-1">Attended Deceased</label>
                <div className="text-dark">
                  <span className={`badge ${formData.attended_deceased === 'Yes' ? 'bg-success' : 'bg-danger'}`}>
                    {formData.attended_deceased === 'Yes' ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 bg-white h-100">
            <div 
              className="card-header border-bottom bg-white"
              style={{ 
                borderColor: 'rgba(1, 129, 129, 0.2)',
                padding: '0.75rem 1rem'
              }}
            >
              <h6 className="mb-0 fw-semibold text-dark">
                <i className="fas fa-monument me-2 text-dark"></i>
                Burial Details
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Disposal Method</label>
                <div className="text-dark">{formData.corpse_disposal || 'Not specified'}</div>
              </div>
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark mb-1">Cemetery/Crematory</label>
                <div className="text-dark">{formData.cemetery_name || 'Not specified'}</div>
              </div>
              {formData.burial_permit_number && (
                <div>
                  <label className="form-label fw-semibold text-dark mb-1">Burial Permit</label>
                  <div className="text-dark">{formData.burial_permit_number}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informant Information */}
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
                <i className="fas fa-user-tie me-2 text-purple"></i>
                Informant Information
              </h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Name</label>
                  <div className="text-dark">{formData.informant_name || 'Not specified'}</div>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Relationship</label>
                  <div className="text-dark">{formData.informant_relationship || 'Not specified'}</div>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-semibold text-dark mb-1">Date</label>
                  <div className="text-dark">{formatDate(formData.informant_date)}</div>
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
          id="confirmDeathAccuracy"
          required
        />
        <label className="form-check-label" htmlFor="confirmDeathAccuracy">
          I confirm that all information provided is accurate to the best of my knowledge and I understand that this record will be permanently added to the system.
          <span className="text-danger">*</span>
        </label>
      </div>

      <style>{`
        .text-purple {
          color: #6f42c1 !important;
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
        .checkbox-group {
          display: flex;
          gap: 20px;
          margin: 10px 0;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .radio-group {
          display: flex;
          gap: 20px;
          margin: 10px 0;
        }
        .radio-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};