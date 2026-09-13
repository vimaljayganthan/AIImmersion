import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { DataProvider } from './context/DataContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { PortalLoginPage } from './pages/auth/PortalLoginPage';

// Owner Views
import { OwnerDashboard, OwnerSettingsView } from './pages/owner/OwnerDashboard';
import {
  OwnerVehiclesView,
  OwnerDiagnosisView,
  OwnerMechanicsView,
  OwnerBookingsView,
  OwnerHistoryView,
  OwnerMaintenanceView,
  OwnerAssistantView,
} from './pages/owner/OwnerSubviews';

// Mechanic Views
import {
  MechanicDashboard,
  MechanicCustomersView,
  MechanicVehiclesView,
  MechanicHistoryView,
  MechanicProfileView,
  MechanicSettingsView,
} from './pages/mechanic/MechanicDashboard';
import {
  MechanicRequestsView,
  MechanicJobsView,
  MechanicPartsView,
  MechanicEarningsView,
} from './pages/mechanic/MechanicSubviews';

// Admin Views
import {
  AdminDashboard,
  AdminVehiclesView,
  AdminRequestsView,
  AdminReviewsView,
  AdminReportsView,
  AdminSettingsView,
} from './pages/admin/AdminDashboard';
import {
  AdminUsersView,
  AdminMechanicsView,
  AdminDiagnosesView,
} from './pages/admin/AdminSubviews';

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <DataProvider>
          <SettingsProvider>
            <Routes>
              {/* Default entry point: 3-Portal Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Dedicated Login Pages */}
              <Route path="/owner/login" element={<PortalLoginPage portalRole="owner" />} />
              <Route path="/mechanic/login" element={<PortalLoginPage portalRole="mechanic" />} />
              <Route path="/admin/login" element={<PortalLoginPage portalRole="admin" />} />

              {/* 1. Vehicle Owner Portal Nested Routes */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRole="owner">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OwnerDashboard />} />
                <Route path="vehicles" element={<OwnerVehiclesView />} />
                <Route path="diagnosis" element={<OwnerDiagnosisView />} />
                <Route path="mechanics" element={<OwnerMechanicsView />} />
                <Route path="bookings" element={<OwnerBookingsView />} />
                <Route path="service-history" element={<OwnerHistoryView />} />
                <Route path="history" element={<OwnerHistoryView />} />
                <Route path="maintenance" element={<OwnerMaintenanceView />} />
                <Route path="assistant" element={<OwnerAssistantView />} />
                <Route path="settings" element={<OwnerSettingsView />} />
              </Route>

              {/* 2. Mechanic Portal Nested Routes */}
              <Route
                path="/mechanic"
                element={
                  <ProtectedRoute allowedRole="mechanic">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<MechanicDashboard />} />
                <Route path="requests" element={<MechanicRequestsView />} />
                <Route path="jobs" element={<MechanicJobsView />} />
                <Route path="customers" element={<MechanicCustomersView />} />
                <Route path="vehicles" element={<MechanicVehiclesView />} />
                <Route path="service-history" element={<MechanicHistoryView />} />
                <Route path="history" element={<MechanicHistoryView />} />
                <Route path="parts" element={<MechanicPartsView />} />
                <Route path="earnings" element={<MechanicEarningsView />} />
                <Route path="profile" element={<MechanicProfileView />} />
                <Route path="settings" element={<MechanicSettingsView />} />
              </Route>

              {/* 3. Admin Portal Nested Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersView />} />
                <Route path="mechanics" element={<AdminMechanicsView />} />
                <Route path="vehicles" element={<AdminVehiclesView />} />
                <Route path="requests" element={<AdminRequestsView />} />
                <Route path="diagnoses" element={<AdminDiagnosesView />} />
                <Route path="reviews" element={<AdminReviewsView />} />
                <Route path="reports" element={<AdminReportsView />} />
                <Route path="settings" element={<AdminSettingsView />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SettingsProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
