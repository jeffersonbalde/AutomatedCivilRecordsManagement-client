// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    () => localStorage.getItem("access_token") || null
  );
  const [userType, setUserType] = useState(null);

  // Check authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔄 AuthContext: Starting authentication check...");
      const storedToken = localStorage.getItem("access_token");
      const storedUserType = localStorage.getItem("user_type");

      console.log("🔑 Stored token exists:", !!storedToken);
      
      if (!storedToken) {
        console.log("❌ No token found, setting loading to false");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 AuthContext: Fetching user data from API...");
        const res = await fetch(`${import.meta.env.VITE_LARAVEL_API}/user`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: "application/json",
          },
        });

        console.log("✅ AuthContext: API response status:", res.status);

        if (res.ok) {
          const userData = await res.json();
          console.log("👤 AuthContext: User data received:", userData.user);
          setUser(userData.user);
          setToken(storedToken);
          setUserType(userData.user_type || storedUserType);
          console.log("✅ AuthContext: Authentication successful");
        } else {
          console.log("❌ AuthContext: API response not OK, status:", res.status);
          if (res.status === 401) {
            // Token is invalid, clear everything
            setUser(null);
            setToken(null);
            setUserType(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_type");
            console.log("🚫 AuthContext: Invalid token, cleared storage");
          }
        }
      } catch (error) {
        console.error("🚨 AuthContext: Auth check failed:", error);
        // Clear invalid token on error
        setUser(null);
        setToken(null);
        setUserType(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_type");
      } finally {
        console.log("🏁 AuthContext: Setting loading to false");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log("🔐 AuthContext: Starting login process...");
    try {
      const res = await fetch(`${import.meta.env.VITE_LARAVEL_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      console.log("📨 AuthContext: Login API response:", data);

      if (!res.ok) {
        console.log("❌ AuthContext: Login failed with error:", data.message);
        throw new Error(data.message || "Login failed");
      }

      // Store tokens and user data
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user_type", data.user_type);
      console.log("💾 AuthContext: Tokens stored in localStorage");

      // Update state
      setToken(data.token);
      setUser(data.user);
      setUserType(data.user_type);
      console.log("✅ AuthContext: State updated successfully");

      return {
        success: true,
        user: data.user,
        user_type: data.user_type,
      };
    } catch (error) {
      console.error("🚨 AuthContext: Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed. Please check your credentials.",
      };
    }
  };

  const logout = async () => {
    console.log("🚪 AuthContext: Starting logout process...");
    try {
      if (token) {
        await fetch(`${import.meta.env.VITE_LARAVEL_API}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("AuthContext: Logout API error:", error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_type");
      setUser(null);
      setToken(null);
      setUserType(null);
      console.log("✅ AuthContext: Logout completed");
    }
  };

  const refreshUserData = async () => {
    const storedToken = localStorage.getItem("access_token");

    if (!storedToken) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_LARAVEL_API}/user`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData.user);
        setUserType(userData.user_type);
        return userData.user;
      } else {
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error("User data refresh failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    token,
    userType,
    loading,
    refreshUserData,
    isAuthenticated: !!user && !!token,
    isAdmin: userType === "admin",
    isStaff: userType === "staff",
  };

  console.log("🔄 AuthContext: Rendering with state:", { 
    user: !!user, 
    loading, 
    isAuthenticated: !!user && !!token 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};