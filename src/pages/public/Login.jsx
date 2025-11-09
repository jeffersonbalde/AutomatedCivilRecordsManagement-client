// src/pages/public/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { showAlert, showToast } from "../../services/notificationService";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext"; // ADD THIS IMPORT

// Import images
import LoginBackground from "../../assets/images/login-bg.png"; 
import Logo from "../../assets/images/logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ 
    email: "", 
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [imagesError, setImagesError] = useState({ background: false, logo: false });
  
  const navigate = useNavigate();
  const { login, loading } = useAuth(); // GET LOGIN FROM CONTEXT

  // New color scheme based on #018181
  const theme = {
    primary: "#018181",
    primaryDark: "#016767",
    primaryLight: "#02a0a0",
    primaryLighter: "#e6f7f7",
    secondary: "#ff6b35",
    secondaryLight: "#ff8c61",
    accent: "#ffd166",
    textPrimary: "#1a2a1a",
    textSecondary: "#4a5c4a",
    textLight: "#6b7c6b",
    backgroundLight: "#f8faf8",
    backgroundWhite: "#ffffff",
    borderColor: "#e0e6e0",
    borderLight: "#f0f4f0",
    success: "#27ae60",
    warning: "#f39c12",
    error: "#e74c3c",
  };

  useEffect(() => {
    // Load background image
    const img = new Image();
    img.src = LoginBackground;
    img.onload = () => {
      console.log("Background image loaded successfully");
      setBackgroundLoaded(true);
    };
    img.onerror = () => {
      console.warn("Background image failed to load");
      setImagesError(prev => ({ ...prev, background: true }));
      setBackgroundLoaded(true);
    };

    // Check if user is already logged in - ONLY if not loading
    if (!loading) {
      const token = localStorage.getItem("access_token");
      if (token) {
        console.log("Login: User already logged in, redirecting to dashboard");
        navigate("/dashboard");
      }
    }
  }, [navigate, loading]); // ADD loading TO DEPENDENCY

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Login: Form submission started");

    // Basic validation
    if (!form.email || !form.password) {
      showAlert.error("Validation Error", "Please fill in all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showAlert.error("Validation Error", "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    console.log("🔄 Login: Setting isSubmitting to true");

    try {
      const loadingAlert = showAlert.loading("Signing you in...");

      // Use AuthContext login method instead of direct API call
      console.log("📡 Login: Calling AuthContext login method");
      const result = await login({
        email: form.email,
        password: form.password
      });

      showAlert.close();

      if (result.success) {
        console.log("✅ Login: AuthContext login successful");
        
        // Show success notification
        await showAlert.success(
          "Login Successful!", 
          `Welcome back, ${result.user.full_name || result.user.email}!`
        );

        // Show success toast
        showToast.success(`Welcome ${result.user.full_name || result.user.email}!`);

        console.log("🔄 Login: Redirecting to dashboard...");
        // Redirect immediately - AuthContext state is already updated
        navigate("/dashboard");
        
      } else {
        console.log("❌ Login: AuthContext login failed:", result.error);
        throw new Error(result.error);
      }

    } catch (error) {
      showAlert.close();
      console.error("🚨 Login: Error occurred:", error);
      showAlert.error(
        "Login Failed",
        error.message || "Please check your credentials and try again."
      );
    } finally {
      console.log("🏁 Login: Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fallback background style if image fails to load
  const backgroundStyle = imagesError.background 
    ? {
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
      }
    : {
        backgroundImage: `url(${LoginBackground})`,
        backgroundColor: theme.backgroundLight,
      };

  // Show loading if AuthContext is still checking authentication
  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center position-relative py-3 py-md-4 px-2">
      {/* Toast Container */}
      <ToastContainer />

      {/* Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          ...backgroundStyle,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: backgroundLoaded ? "blur(0px)" : "blur(8px)",
          transition: "filter 0.6s ease",
        }}
      />

      {/* Background Overlay for better text readability */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(1, 129, 129, 0.1)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Logo Section - Outside the white panel */}
      <div className="position-relative" style={{ zIndex: 10 }}>
        <div className="d-flex align-items-center justify-content-center">
          {/* System Logo */}
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "clamp(80px, 18vw, 110px)",
              height: "clamp(80px, 18vw, 110px)",
              flexShrink: 0,
              filter: logoLoaded ? "blur(0px)" : "blur(8px)",
              opacity: logoLoaded ? 1 : 0,
              transition: "all 0.6s ease",
            }}
          >
            {imagesError.logo ? (
              // Fallback logo if image fails to load
              <div 
                className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center shadow-lg"
                style={{
                  width: "100%",
                  height: "100%",
                  border: `3px solid ${theme.primary}`,
                }}
              >
                <span 
                  className="fw-bold"
                  style={{
                    color: theme.primary,
                    fontSize: "1.5rem",
                    lineHeight: "1"
                  }}
                >
                  ACRM
                </span>
                <span 
                  className="small fw-semibold mt-1"
                  style={{
                    color: theme.textLight,
                    fontSize: "0.6rem"
                  }}
                >
                  System
                </span>
              </div>
            ) : (
              <img
                src={Logo}
                alt="Civil Records Management System Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onLoad={() => {
                  console.log("Logo loaded successfully");
                  setLogoLoaded(true);
                }}
                onError={(e) => {
                  console.warn("Logo failed to load");
                  setImagesError(prev => ({ ...prev, logo: true }));
                  setLogoLoaded(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Welcome Text - Outside the form card in column layout */}
      <div
        className="position-relative text-center mb-3 mb-md-4"
        style={{
          zIndex: 10,
          opacity: backgroundLoaded && logoLoaded ? 1 : 0,
          transform:
            backgroundLoaded && logoLoaded
              ? "translateY(0)"
              : "translateY(10px)",
          transition: "all 0.6s ease-in-out",
          marginTop: "0.5rem",
          maxWidth: "90%",
        }}
      >
        <div className="d-flex flex-column align-items-center">
          <h1
            className="fw-bold mb-1 mb-md-2 text-center"
            style={{
              color: "white",
              fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)",
              lineHeight: "1.2",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome to Automated Civil
          </h1>
          <h1
            className="fw-bold text-center"
            style={{
              color: "white",
              fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)",
              lineHeight: "1.2",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            }}
          >
            Records Management &
          </h1>
          <h1
            className="fw-bold text-center"
            style={{
              color: "white",
              fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)",
              lineHeight: "1.2",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
              fontWeight: "700",
              letterSpacing: "-0.02em",
            }}
          >
            Certification Issuance System
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <div
        className="bg-white rounded-4 shadow-lg p-3 p-sm-4 p-md-5 position-relative mx-2"
        style={{
          maxWidth: "420px",
          width: "95%",
          border: `1px solid ${theme.borderLight}`,
          zIndex: 10,
          opacity: backgroundLoaded && logoLoaded ? 1 : 0,
          transform:
            backgroundLoaded && logoLoaded
              ? "translateY(0)"
              : "translateY(20px)",
          transition: "all 0.6s ease-in-out",
          boxShadow: "0 20px 40px rgba(1, 129, 129, 0.15) !important",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label fw-semibold mb-2"
              style={{
                fontSize: "0.9rem",
                color: theme.textSecondary,
              }}
            >
              Email Address
            </label>
            <div className="position-relative">
              <FaEnvelope
                className="position-absolute top-50 translate-middle-y ms-3"
                style={{ color: theme.primary }}
                size={16}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="form-control ps-5 fw-bolder"
                value={form.email}
                onChange={handleInput}
                disabled={isSubmitting}
                required
                style={{
                  backgroundColor: theme.primaryLighter,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.borderColor}`,
                  borderRadius: "10px",
                  height: "48px",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }}
                id="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="form-label fw-semibold mb-2"
              style={{
                fontSize: "0.9rem",
                color: theme.textSecondary,
              }}
            >
              Password
            </label>
            <div className="position-relative">
              <FaLock
                className="position-absolute top-50 translate-middle-y ms-3"
                style={{ color: theme.primary }}
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="form-control ps-5 pe-5 fw-bolder"
                value={form.password}
                onChange={handleInput}
                disabled={isSubmitting}
                required
                style={{
                  backgroundColor: theme.primaryLighter,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.borderColor}`,
                  borderRadius: "10px",
                  height: "48px",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }}
                id="password"
              />
              <span
                onClick={() => !isSubmitting && setShowPassword(!showPassword)}
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  zIndex: 10,
                  color: theme.primary,
                }}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-100 fw-semibold d-flex justify-content-center align-items-center position-relative"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? theme.primaryLight : theme.primary,
              color: "white",
              height: "50px",
              borderRadius: "12px",
              border: "none",
              fontSize: "1.05rem",
              transition: "all 0.3s ease-in-out",
              overflow: "hidden",
              boxShadow: isSubmitting 
                ? "0 2px 8px rgba(1, 129, 129, 0.3)" 
                : "0 8px 20px rgba(1, 129, 129, 0.4)",
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = theme.primaryDark;
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 25px rgba(1, 129, 129, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = theme.primary;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(1, 129, 129, 0.4)";
              }
            }}
            onMouseDown={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(1, 129, 129, 0.4)";
              }
            }}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner me-2" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      {/* Custom Styles */}
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .form-control:focus {
          border-color: ${theme.primary};
          box-shadow: 0 0 0 0.25rem ${theme.primary}20;
          background-color: ${theme.primaryLighter};
        }
        
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
        }

        .form-control:hover:not(:focus):not(:disabled) {
          border-color: ${theme.primary}80;
          background-color: ${theme.primaryLighter};
        }
      `}</style>
    </div>
  );
}