// src/pages/Unified/GenerateCertificates/components/CertificatePreview.jsx
import React from "react";

const CertificatePreview = ({ certificateData, onClose, onGenerate }) => {
  const { template_data, certificate_type } = certificateData;

  const renderBirthCertificate = () => (
    <div className="certificate-preview border p-4 bg-white">
      <div className="text-center mb-4">
        <h6 className="fw-bold mb-1">{template_data.form_number}</h6>
        <h5 className="fw-bold mb-1">Republic of the Philippines</h5>
        <h6 className="fw-bold mb-1">{template_data.office_name}</h6>
        <p className="mb-2">{template_data.office_address}</p>
        <p className="fw-bold mb-4">{template_data.current_date}</p>
      </div>

      <div className="text-center mb-4">
        <h6 className="fw-bold">TO WHOM IT MAY CONCERN:</h6>
      </div>

      <div className="mb-4">
        <p className="mb-3">
          We certify that among others, the following facts of birth appearing in our Registry of Births on
          page <u>{template_data.page_number}</u> of the book number <u>{template_data.book_number}</u>.
        </p>

        <table className="table table-bordered mb-0">
          <tbody>
            <tr>
              <td width="30%" className="fw-semibold">Registry number</td>
              <td width="70%">{template_data.registry_number}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of registration</td>
              <td>{template_data.date_of_registration}</td>
            </tr>
            <tr>
              <td className="fw-semibold">PRN</td>
              <td>{template_data.prn}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Name of child</td>
              <td>{template_data.child_name}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Sex</td>
              <td>{template_data.sex}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of Birth</td>
              <td>{template_data.date_of_birth}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Place of Birth</td>
              <td>{template_data.place_of_birth}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Name of Mother</td>
              <td>{template_data.mother_name}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Citizenship of Mother</td>
              <td>{template_data.mother_citizenship}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Name of Father</td>
              <td>{template_data.father_name}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Citizenship of Father</td>
              <td>{template_data.father_citizenship}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of marriage of parents</td>
              <td>{template_data.marriage_date}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Place of marriage of parents</td>
              <td>{template_data.marriage_place}</td>
            </tr>
            <tr>
              <td className="fw-semibold">This certification is issued to</td>
              <td>{template_data.issued_to} upon her/his request.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row mt-4">
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Verified by:</p>
            <p className="fw-bold mb-1">{template_data.verified_by}</p>
            <p className="mb-0">{template_data.verified_by_title}</p>
          </div>
        </div>
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Approved by:</p>
            <p className="fw-bold mb-1">{template_data.approved_by}</p>
            <p className="mb-0">{template_data.approved_by_title}</p>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="text-center border-top pt-2">
            <small className="text-muted">
              Amount Paid : {template_data.amount_paid} &nbsp;&nbsp;
              O.R. Number : {template_data.or_number} &nbsp;&nbsp;
              Date Paid : {template_data.date_paid}
            </small>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <small className="text-danger fw-semibold">
          Note: A mark, erasure or alteration of any entry invalidates this certification.
        </small>
      </div>
    </div>
  );

  const renderMarriageCertificate = () => (
    <div className="certificate-preview border p-4 bg-white">
      <div className="text-center mb-4">
        <h6 className="fw-bold mb-1">{template_data.form_number}</h6>
        <h5 className="fw-bold mb-1">Republic of the Philippines</h5>
        <h6 className="fw-bold mb-1">{template_data.office_name}</h6>
        <p className="mb-2">{template_data.office_address}</p>
        <p className="fw-bold mb-4">{template_data.current_date}</p>
      </div>

      <div className="text-center mb-4">
        <h6 className="fw-bold">TO WHOM IT MAY CONCERN:</h6>
      </div>

      <div className="mb-4">
        <p className="mb-3">
          We certify that, among others, the following facts of marriage appear in our Register of Marriages on 
          page <u>{template_data.page_number}</u> book number <u>{template_data.book_number}</u>.
        </p>

        <div className="row mb-3">
          <div className="col-6">
            <div className="card">
              <div className="card-header bg-light fw-bold text-center">HUSBAND</div>
              <div className="card-body">
                <p><strong>Name:</strong> {template_data.husband_name}</p>
                <p><strong>Age:</strong> {template_data.husband_age}</p>
                <p><strong>Citizenship:</strong> {template_data.husband_citizenship}</p>
                <p><strong>Civil Status:</strong> {template_data.husband_civil_status}</p>
                <p><strong>Mother:</strong> {template_data.husband_mother}</p>
                <p><strong>Father:</strong> {template_data.husband_father}</p>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-header bg-light fw-bold text-center">WIFE</div>
              <div className="card-body">
                <p><strong>Name:</strong> {template_data.wife_name}</p>
                <p><strong>Age:</strong> {template_data.wife_age}</p>
                <p><strong>Citizenship:</strong> {template_data.wife_citizenship}</p>
                <p><strong>Civil Status:</strong> {template_data.wife_civil_status}</p>
                <p><strong>Mother:</strong> {template_data.wife_mother}</p>
                <p><strong>Father:</strong> {template_data.wife_father}</p>
              </div>
            </div>
          </div>
        </div>

        <table className="table table-bordered mb-0">
          <tbody>
            <tr>
              <td width="30%" className="fw-semibold">Registry Number</td>
              <td width="70%">{template_data.registry_number}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of Registration</td>
              <td>{template_data.date_of_registration}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of Marriage</td>
              <td>{template_data.date_of_marriage}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Place of Marriage</td>
              <td>{template_data.place_of_marriage}</td>
            </tr>
            <tr>
              <td className="fw-semibold">This certification is issued to</td>
              <td>{template_data.issued_to} upon her/his request.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Similar footer for marriage certificate */}
      <div className="row mt-4">
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Verified by:</p>
            <p className="fw-bold mb-1">{template_data.verified_by}</p>
            <p className="mb-0">{template_data.verified_by_title}</p>
          </div>
        </div>
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Approved by:</p>
            <p className="fw-bold mb-1">{template_data.approved_by}</p>
            <p className="mb-0">{template_data.approved_by_title}</p>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="text-center border-top pt-2">
            <small className="text-muted">
              Amount Paid : {template_data.amount_paid} &nbsp;&nbsp;
              O.R. Number : {template_data.or_number} &nbsp;&nbsp;
              Date Paid : {template_data.date_paid}
            </small>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <small className="text-danger fw-semibold">
          NOTE: A mark, erasure or alteration of any entry invalidates this certification.
        </small>
      </div>
    </div>
  );

  const renderDeathCertificate = () => (
    <div className="certificate-preview border p-4 bg-white">
      <div className="text-center mb-4">
        <h6 className="fw-bold mb-1">{template_data.form_number}</h6>
        <h5 className="fw-bold mb-1">Republic of the Philippines</h5>
        <h6 className="fw-bold mb-1">{template_data.office_name}</h6>
        <p className="mb-2">{template_data.office_address}</p>
        <p className="fw-bold mb-4">{template_data.current_date}</p>
      </div>

      <div className="text-center mb-4">
        <h6 className="fw-bold">TO WHOM IT MAY CONCERN:</h6>
      </div>

      <div className="mb-4">
        <p className="mb-3">
          We certify that, among others, the following facts of death appear in our Register of Deaths on 
          page <u>{template_data.page_number}</u> of the book number <u>{template_data.book_number}</u>.
        </p>

        <table className="table table-bordered mb-0">
          <tbody>
            <tr>
              <td width="30%" className="fw-semibold">Registry number</td>
              <td width="70%">{template_data.registry_number}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of registration</td>
              <td>{template_data.date_of_registration}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Name of deceased</td>
              <td>{template_data.deceased_name}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Sex</td>
              <td>{template_data.sex}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Age</td>
              <td>{template_data.age}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Civil Status</td>
              <td>{template_data.civil_status}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Citizenship</td>
              <td>{template_data.citizenship}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Date of death</td>
              <td>{template_data.date_of_death}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Place of death</td>
              <td>{template_data.place_of_death}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Cause of death</td>
              <td>{template_data.cause_of_death}</td>
            </tr>
            <tr>
              <td className="fw-semibold">This certification is issued to</td>
              <td>{template_data.issued_to} upon her/his request.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Similar footer for death certificate */}
      <div className="row mt-4">
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Verified by:</p>
            <p className="fw-bold mb-1">{template_data.verified_by}</p>
            <p className="mb-0">{template_data.verified_by_title}</p>
          </div>
        </div>
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Approved by:</p>
            <p className="fw-bold mb-1">{template_data.approved_by}</p>
            <p className="mb-0">{template_data.approved_by_title}</p>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="text-center border-top pt-2">
            <small className="text-muted">
              Amount Paid : {template_data.amount_paid} &nbsp;&nbsp;
              O.R. Number : {template_data.or_number} &nbsp;&nbsp;
              Date Paid : {template_data.date_paid}
            </small>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <small className="text-danger fw-semibold">
          Note: A mark, erasure or alteration of any entry invalidates this certification.
        </small>
      </div>
    </div>
  );

  const renderCertificate = () => {
    switch (certificate_type) {
      case "birth":
        return renderBirthCertificate();
      case "marriage":
        return renderMarriageCertificate();
      case "death":
        return renderDeathCertificate();
      default:
        return null;
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header text-white" style={{ backgroundColor: "#018181" }}>
            <h5 className="modal-title">
              <i className="fas fa-eye me-2"></i>
              Certificate Preview - {certificate_type.toUpperCase()}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {renderCertificate()}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times me-2"></i>Close
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={onGenerate}
              style={{
                backgroundColor: "#018181",
                borderColor: "#018181",
              }}
            >
              <i className="fas fa-print me-2"></i>Generate Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;