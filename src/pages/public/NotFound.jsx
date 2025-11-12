import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaCompass } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Minimalist Card */}
            <div className="text-center px-4">
              {/* Icon */}
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "64px",
                    height: "64px",
                    background: "#ffffff",
                    border: "1.5px solid #e0e0e0",
                    color: "#666666"
                  }}
                >
                  <FaCompass size={24} />
                </div>
              </div>

              {/* Content */}
              <div className="mb-5">
                <h1 className="display-3 fw-bold mb-2" style={{ color: "#333333" }}>
                  404
                </h1>
                <h2 className="h5 fw-semibold mb-3" style={{ color: "#333333" }}>
                  Page Not Found
                </h2>
                <p className="mb-0" style={{ color: "#666666" }}>
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mb-5">
                <button
                  onClick={() => navigate(-1)}
                  className="btn d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#ffffff",
                    color: "#333333",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "0.5rem 1rem",
                    fontWeight: "500",
                    fontSize: "0.875rem"
                  }}
                >
                  <FaArrowLeft size={14} />
                  Go Back
                </button>

                <Link
                  to="/"
                  className="btn d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                  style={{
                    background: "#018181",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem 1rem",
                    fontWeight: "500",
                    fontSize: "0.875rem"
                  }}
                >
                  <FaHome size={14} />
                  Go Home
                </Link>
              </div>

              {/* Support Link */}
              <div className="border-top pt-3" style={{ borderColor: "#e0e0e0 !important" }}>
                <a
                  href="mailto:support@yourcompany.com"
                  className="small text-decoration-none"
                  style={{ color: "#666666" }}
                >
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .btn {
          transition: all 0.2s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        /* Primary button hover */
        .btn[style*="#018181"]:hover {
          background: #016969 !important;
        }
        
        /* Secondary button hover */
        .btn[style*="#ffffff"]:hover {
          background: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}