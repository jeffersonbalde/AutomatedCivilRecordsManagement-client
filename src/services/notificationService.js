// src/services/notificationService.js
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// Color scheme based on your Login component (#018181)
const theme = {
  primary: "#018181",
  primaryDark: "#016767",
  primaryLight: "#02a0a0",
  success: "#27ae60",
  warning: "#f39c12",
  error: "#e74c3c",
  backgroundWhite: "#ffffff",
  textPrimary: "#1a2a1a",
};

export const showAlert = {
  // Success alert
  success: (title, text = "", timer = 3000) => {
    return Swal.fire({
      title,
      text,
      icon: "success",
      timer,
      timerProgressBar: true,
      showConfirmButton: false,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      iconColor: theme.primary,
    });
  },

  // Error alert
  error: (title, text = "", timer = 4000) => {
    return Swal.fire({
      title,
      text,
      icon: "error",
      timer,
      timerProgressBar: true,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      confirmButtonColor: theme.primary,
      iconColor: theme.error,
    });
  },

  // Warning alert
  warning: (title, text = "", timer = 3000) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      timer,
      timerProgressBar: true,
      showConfirmButton: false,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      iconColor: theme.warning,
    });
  },

  // Info alert
  info: (title, htmlContent = "", confirmButtonText = "Close", timer = null) => {
    return Swal.fire({
      title,
      html: htmlContent,
      icon: "info",
      timer: timer,
      timerProgressBar: !!timer,
      showConfirmButton: true,
      confirmButtonText,
      confirmButtonColor: theme.primary,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      iconColor: theme.primaryLight,
    });
  },

  // Confirmation dialog
  confirm: (title, text = "", confirmButtonText = "Yes", cancelButtonText = "Cancel") => {
    return Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: theme.primary,
      cancelButtonColor: "#6c757d",
      confirmButtonText,
      cancelButtonText,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      iconColor: theme.primary,
    });
  },

  // Loading alert
  loading: (title = "Loading...") => {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  // Processing alert
  processing: (title, text) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  // Close any open alert
  close: () => {
    Swal.close();
  },

  // Custom HTML alert for detailed content
  html: (title, htmlContent, confirmButtonText = "Close", width = 600) => {
    return Swal.fire({
      title,
      html: htmlContent,
      icon: "info",
      showConfirmButton: true,
      confirmButtonText,
      confirmButtonColor: theme.primary,
      background: theme.backgroundWhite,
      color: theme.textPrimary,
      iconColor: theme.primaryLight,
      width: `${width}px`,
    });
  },
};

// Toastify configurations with your theme
export const showToast = {
  // Success toast
  success: (message, autoClose = 3000) => {
    toast.success(message, {
      position: "top-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#f8faf8",
        color: theme.primary,
        border: "1px solid #e6f7f7",
        borderRadius: "8px",
        fontWeight: "500",
      },
      progressStyle: {
        background: theme.primary,
      },
    });
  },

  // Error toast
  error: (message, autoClose = 4000) => {
    toast.error(message, {
      position: "top-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#fef8f8",
        color: theme.error,
        border: "1px solid #fde8e8",
        borderRadius: "8px",
        fontWeight: "500",
      },
      progressStyle: {
        background: theme.error,
      },
    });
  },

  // Warning toast
  warning: (message, autoClose = 3000) => {
    toast.warn(message, {
      position: "top-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#fffbf0",
        color: theme.warning,
        border: "1px solid #ffeaa7",
        borderRadius: "8px",
        fontWeight: "500",
      },
      progressStyle: {
        background: theme.warning,
      },
    });
  },

  // Info toast
  info: (message, autoClose = 3000) => {
    toast.info(message, {
      position: "top-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#f0f9ff",
        color: theme.primary,
        border: "1px solid #e6f7f7",
        borderRadius: "8px",
        fontWeight: "500",
      },
      progressStyle: {
        background: theme.primary,
      },
    });
  },

  // Default toast
  default: (message, autoClose = 3000) => {
    toast(message, {
      position: "top-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#f8faf8",
        color: theme.textPrimary,
        border: "1px solid #e6f7f7",
        borderRadius: "8px",
        fontWeight: "500",
      },
      progressStyle: {
        background: theme.primary,
      },
    });
  },
};

// Export ToastContainer for use in App.jsx
export { ToastContainer } from "react-toastify";