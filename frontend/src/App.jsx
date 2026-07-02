import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CookieBanner from './components/CookieBanner';

// Pages
import Home             from './pages/Home';
import Jobs             from './pages/Jobs';
import JobDetail        from './pages/JobDetail';
import Login            from './pages/Login';
import Register         from './pages/Register';
import CompanyRegister  from './pages/CompanyRegister';
import UserDashboard    from './pages/UserDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob          from './pages/PostJob';
import PrivacyPolicy    from './pages/PrivacyPolicy';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <h1 style={{ fontSize: 64, fontWeight: 900, color: 'var(--primary)' }}>404</h1>
      <p style={{ fontSize: 20, color: 'var(--text-2)', margin: '16px 0' }}>Page not found</p>
      <a href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="page-wrapper">
            <CookieBanner />
            <Navbar />
            <main className="page-content" style={{ padding: 0 }}>
              <Routes>
                {/* ── Public — koi bhi dekh sakta hai, login ki zaroorat nahi ── */}
                <Route path="/"                    element={<Home />} />
                <Route path="/jobs"                element={<Jobs />} />
                <Route path="/jobs/:id"            element={<JobDetail />} />
                <Route path="/login"               element={<Login />} />
                <Route path="/register"            element={<Register />} />
                <Route path="/company/register"    element={<CompanyRegister />} />
                <Route path="/privacy-policy"      element={<PrivacyPolicy />} />

                {/* ── Protected — sirf logged-in users ── */}
                <Route path="/dashboard" element={
                  <ProtectedRoute roles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/company/dashboard" element={
                  <ProtectedRoute roles={['company', 'admin']}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/company/post-job" element={
                  <ProtectedRoute roles={['company', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
