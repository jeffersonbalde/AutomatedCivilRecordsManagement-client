import React from "react";
import birthSealLeft from "../../../assets/images/logo.png";
import birthSealRight from "../../../assets/images/logo.png";

const BirthCertificate = ({ data }) => {
  const {
    fullName = "JUAN DELA CRUZ",
    sex = "MALE",
    citizenship = "FILIPINO",
    dateRegistered = "NOVEMBER 11, 2025",
    clerk = "MARIA CLARA",
    oic = "OIC",
    issuedDate = "November 11, 2025",
  } = data || {};

  return (
    <div className="certificate-container">
      {/* Top left text */}
      <div className="form-info">
        Civil Registry Form No. 1A <br />
        (Birth-Available)
      </div>

      {/* Header section */}
      <div className="header">
        <img src={birthSealLeft} alt="Left Seal" className="seal left" />
        <div className="header-text">
          <div className="small-text">Republic of the Philippines</div>
          <div className="main-text">CITY CIVIL REGISTRY OFFICE</div>
          <div className="sub-text">Pagadian City</div>
          <div className="address">
            City Hall Complex, Pagadian City Tel. No. (062) 214-1886
          </div>
        </div>
        <img src={birthSealRight} alt="Right Seal" className="seal right" />
      </div>

      {/* Date at top-right */}
      <div className="issued-date">{issuedDate}</div>

      {/* Body content */}
      <div className="body">
        <div className="concern">TO WHOM IT MAY CONCERN:</div>

        <div className="info">
          <div>
            Name: <span className="value underline">{fullName}</span>
          </div>
          <div>
            Sex: <span className="value underline">{sex}</span>
          </div>
          <div>
            Citizenship: <span className="value underline">{citizenship}</span>
          </div>
          <div>
            Date Registered:{" "}
            <span className="value underline">{dateRegistered}</span>
          </div>
        </div>

        <p className="certify">
          This is to certify that the foregoing appears in the records of this
          office.
        </p>

        <div className="verified-section">
          <div className="verified-by">
            Verified by
            <div className="clerk underline">{clerk}</div>
          </div>
          <div className="oic-section">
            <div className="underline oic">{oic}</div>
            <div className="oic-label">OIC-CITY CIVIL REGISTRAR</div>
          </div>
        </div>

        <div className="note">
          Note: A mark, erasure or alteration of any entry invalidates this
          certification.
        </div>
      </div>
    </div>
  );
};

export default BirthCertificate;
