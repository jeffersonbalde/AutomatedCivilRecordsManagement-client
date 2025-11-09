// App.jsx - Updated imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "./services/notificationService";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LoadingAuthentication from "./components/LoadingAuthentication";
import Layout from "./layout/Layout";
import Login from "./pages/public/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/public/NotFound";

// Import role-based components
import AdminProfile from "./pages/Admin/Profile/AdminProfile";
import AdminSettings from "./pages/Admin/Settings/AdminSettings";
import StaffProfile from "./pages/Staff/Profile/StaffProfile";

// Import UserManagement component
import UserManagement from "./pages/Admin/UserManagement/UserManagement";

import BirthRecords from "./pages/Unified/BirthRecords/BirthRecords";

const MarriageRecords = () => <div>Marriage Records Management</div>;
const DeathRecords = () => <div>Death Records Management</div>;
const SearchRecords = () => <div>Search Records</div>;
const GenerateCertificates = () => <div>Generate Certificates</div>;
const IssuanceHistory = () => <div>Issuance History</div>;
const Reports = () => <div>Reports & Analytics</div>;
const Backup = () => <div>Data Backup</div>;

// Role-based component selectors
const RoleBasedProfile = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminProfile /> : <StaffProfile />;
};

const RoleBasedSettings = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? (
    <AdminSettings />
  ) : (
    <div className="container-fluid px-4 py-4">
      <div className="alert alert-info">
        <h4>Settings Access Restricted</h4>
        <p>
          Only system administrators can access settings. Please contact your
          administrator for system configuration changes.
        </p>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingAuthentication />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Records Management Routes */}
      <Route
        path="/birth-records"
        element={
          <ProtectedRoute>
            <Layout>
              <BirthRecords />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marriage-records"
        element={
          <ProtectedRoute>
            <Layout>
              <MarriageRecords />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/death-records"
        element={
          <ProtectedRoute>
            <Layout>
              <DeathRecords />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-records"
        element={
          <ProtectedRoute>
            <Layout>
              <SearchRecords />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Certificate Management Routes */}
      <Route
        path="/generate-certificates"
        element={
          <ProtectedRoute>
            <Layout>
              <GenerateCertificates />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/issuance-history"
        element={
          <ProtectedRoute>
            <Layout>
              <IssuanceHistory />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route
        path="/user-management"
        element={
          <AdminRoute>
            <Layout>
              <UserManagement />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <AdminRoute>
            <Layout>
              <Reports />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/backup"
        element={
          <AdminRoute>
            <Layout>
              <Backup />
            </Layout>
          </AdminRoute>
        }
      />

      {/* Role-based Profile & Settings Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <RoleBasedProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <RoleBasedSettings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
