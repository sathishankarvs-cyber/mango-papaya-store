import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from './store/useAdminAuthStore';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

export const App: React.FC = () => {
  const { isAuthenticated, admin, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Handle logout redirect
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Redirect authenticated users away from login page
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={
          <LoginPage
            isAuthenticated={isAuthenticated}
            admin={admin}
          />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/edit/:id" element={<ProductFormPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;