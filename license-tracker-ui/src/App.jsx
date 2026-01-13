import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Pages */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import DeviceDetails from "./pages/DeviceDetails";
import Licenses from "./pages/Licenses";
import AddLicense from "./pages/AddLicense";
import AssignLicense from "./pages/AssignLicense";
import AssignedLicenses from "./pages/AssignedLicenses";
import AssignedDevices from "./pages/AssignedDevices";
import LicenseUtilization from "./pages/LicenseUtilization";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Audit from "./pages/Audit";
import Lifecycle from "./pages/Lifecycle";
import ForgotPassword from "./pages/ForgotPassword";
import UserManagement from "./pages/UserManagement";

/* Layout / Security */
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= PROTECTED ================= */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/devices" element={
            <ProtectedRoute roles={["ADMIN","NETWORK_ADMIN","OPERATION_MANAGER"]}>
              <Devices />
            </ProtectedRoute>
          } />

          <Route path="/devices/:deviceId/details" element={
            <ProtectedRoute roles={["ADMIN","NETWORK_ADMIN","OPERATION_MANAGER"]}>
              <DeviceDetails />
            </ProtectedRoute>
          } />

          <Route path="/licenses" element={
            <ProtectedRoute roles={["ADMIN","PROCUREMENT","COMPLIANCE"]}>
              <Licenses />
            </ProtectedRoute>
          } />

          <Route path="/licenses/add" element={
            <ProtectedRoute roles={["ADMIN","PROCUREMENT"]}>
              <AddLicense />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          } />
<Route
  path="/licenses/:licenseKey/devices"
  element={<AssignedDevices />}
/>

          <Route path="/licenses/utilization" element={
            <ProtectedRoute roles={["ADMIN","COMPLIANCE"]}>
              <LicenseUtilization />
            </ProtectedRoute>
          } />

          <Route path="/licenses/:licenseKey/devices" element={
            <ProtectedRoute roles={["ADMIN","COMPLIANCE"]}>
              <AssignedDevices />
            </ProtectedRoute>
          } />

          <Route path="/assign" element={
            <ProtectedRoute roles={["ADMIN","NETWORK_ADMIN"]}>
              <AssignLicense />
            </ProtectedRoute>
          } />

          <Route path="/assignments" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AssignedLicenses />
            </ProtectedRoute>
          } />

          <Route path="/alerts" element={
            <ProtectedRoute roles={["ADMIN","COMPLIANCE"]}>
              <Alerts />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute roles={["ADMIN","COMPLIANCE"]}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="/audit" element={
            <ProtectedRoute roles={["ADMIN","AUDITOR"]}>
              <Audit />
            </ProtectedRoute>
          } />

          <Route path="/lifecycle" element={
            <ProtectedRoute roles={["ADMIN","NETWORK_ADMIN","NETWORK_ENGINEER"]}>
              <Lifecycle />
            </ProtectedRoute>
          } />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}
