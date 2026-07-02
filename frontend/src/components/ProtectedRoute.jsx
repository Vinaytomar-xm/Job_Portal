import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Spinner shown while session check is in progress
function Spinner() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Step 1: Session verify ho rahi hai — wait karo, REDIRECT MAT KARO
  // Yahi tha main bug — pehle loading check nahi tha
  // isliye refresh pe user=null hota tha aur turant /login pe jaata tha
  if (loading) return <Spinner />;

  // Step 2: Verified — not logged in → send to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Step 3: Role check
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Step 4: All good
  return children;
}
