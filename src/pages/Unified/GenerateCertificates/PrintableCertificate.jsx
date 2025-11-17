// src/pages/Unified/GenerateCertificates/components/PrintableCertificate.jsx
import React from "react";
import Portal from "../../../components/Portal";

const PrintableCertificate = ({ certificateData, issuanceData, onClose, onPrint }) => {
  const { template_data, certificate_type, record } = certificateData;

  const handlePrint = () => {
    window.print();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.body.classList.add("modal-open");
    
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

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

  const renderBirthCertificate = () => (
    <div className="certificate-print border p-4 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
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
              <td>{issuanceData.issued_to} upon her/his request.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row mt-4">
        <div className="col-6">
          <div className="text-center">
            <p className="mb-1">Verified by:</p>
            <p className="fw-bold mb-1">{issuanceData.verified_by}</p>
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
              Amount Paid : {issuanceData.amount_paid} &nbsp;&nbsp;
              O.R. Number : {issuanceData.or_number} &nbsp;&nbsp;
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

  const renderMarriageCertificate = () => {
    const husbandAge = calculateAge(record.husband_birthdate);
    const wifeAge = calculateAge(record.wife_birthdate);

    return (
      <div className="certificate-print border p-4 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
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
                  <p><strong>Age:</strong> {husbandAge}</p>
                  <p><strong>Citizenship:</strong> {template_data.husband_citizenship}</p>
                  <p><strong>Civil Status:</strong> {template_data.husband_civil_status}</p>
                  <p><strong>Mother:</strong> {record.husband_mother_name || template_data.husband_mother}</p>
                  <p><strong>Father:</strong> {record.husband_father_name || template_data.husband_father}</p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-header bg-light fw-bold text-center">WIFE</div>
                <div className="card-body">
                  <p><strong>Name:</strong> {template_data.wife_name}</p>
                  <p><strong>Age:</strong> {wifeAge}</p>
                  <p><strong>Citizenship:</strong> {template_data.wife_citizenship}</p>
                  <p><strong>Civil Status:</strong> {template_data.wife_civil_status}</p>
                  <p><strong>Mother:</strong> {record.wife_mother_name || template_data.wife_mother}</p>
                  <p><strong>Father:</strong> {record.wife_father_name || template_data.wife_father}</p>
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
                <td>{issuanceData.issued_to} upon her/his request.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="row mt-4">
          <div className="col-6">
            <div className="text-center">
              <p className="mb-1">Verified by:</p>
              <p className="fw-bold mb-1">{issuanceData.verified_by}</p>
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
                Amount Paid : {issuanceData.amount_paid} &nbsp;&nbsp;
                O.R. Number : {issuanceData.or_number} &nbsp;&nbsp;
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
  };

  const renderDeathCertificate = () => {
    const age = calculateAge(record.date_of_birth);

    return (
      <div className="certificate-print border p-4 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
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
                <td>{record.first_name} {record.middle_name} {record.last_name}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Sex</td>
                <td>{template_data.sex}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Age</td>
                <td>{age}</td>
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
                <td>{record.immediate_cause || template_data.cause_of_death}</td>
              </tr>
              <tr>
                <td className="fw-semibold">This certification is issued to</td>
                <td>{issuanceData.issued_to} upon her/his request.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="row mt-4">
          <div className="col-6">
            <div className="text-center">
              <p className="mb-1">Verified by:</p>
              <p className="fw-bold mb-1">{issuanceData.verified_by}</p>
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
                Amount Paid : {issuanceData.amount_paid} &nbsp;&nbsp;
                O.R. Number : {issuanceData.or_number} &nbsp;&nbsp;
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
  };

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
    <Portal>
      <div 
        className="modal fade show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={handleBackdropClick}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered mx-3 mx-sm-auto">
          <div 
            className="modal-content border-0"
            style={{ 
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div 
              id="certificate-print-header"
              className="modal-header border-0 text-white"
            >
              <h5 className="modal-title fw-bold">
                <i className="fas fa-print me-2"></i>
                Printable Certificate - {certificate_type.toUpperCase()}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body bg-light" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {renderCertificate()}
            </div>
            <div className="modal-footer border-top bg-white">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={onClose}
              >
                <i className="fas fa-times me-2"></i>Close
              </button>
              <button
                type="button"
                className="btn fw-semibold"
                onClick={handlePrint}
                style={{
                  backgroundColor: "#018181",
                  borderColor: "#018181",
                  color: "white",
                }}
              >
                <i className="fas fa-print me-2"></i>Print Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print, .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }
          .modal, .modal-dialog, .modal-content {
            position: relative !important;
            box-shadow: none !important;
            border: none !important;
          }
          .modal-header, .modal-footer {
            display: none !important;
          }
        }
        #certificate-print-header {
          background: #018181 !important;
        }
      `}</style>
    </Portal>
  );
};

export default PrintableCertificate;