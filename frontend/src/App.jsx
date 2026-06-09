import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Toast from './components/Toast';

// ─── PROTECTED ROUTE ─────────────────────────────────────────────
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

// ─── PUBLIC ROUTE (REDIRECT IF LOGGED IN) ────────────────────────
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated()) {
    return <Navigate to={isAdmin() ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return children;
};

// ─── APP ROUTES ──────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />

      {/* User Routes */}
      <Route 
        path="/user/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toast />
      </AuthProvider>
    </Router>
  );
}

export default App;
