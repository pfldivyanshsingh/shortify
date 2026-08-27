import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

// Public pages
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// App pages (accessible without login)
import Dashboard from './pages/dashboard/Dashboard';
import Links from './pages/links/Links';
import CreateLink from './pages/links/CreateLink';
import EditLink from './pages/links/EditLink';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* App Routes — all accessible without login via guest session */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/links" element={<Links />} />
        <Route path="/links/new" element={<CreateLink />} />
        <Route path="/links/:id/edit" element={<EditLink />} />
        <Route path="/analytics" element={<Dashboard />} />
        <Route path="/analytics/:urlId" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
