import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);

    if (result.success) {
      showToast('✅ Login successful!', 'success');
      
      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }, 500);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Logo */}
        <div className="auth-logo">
          <h1>Job<span>Board</span></h1>
          <p>Find your dream job today</p>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Login to access your dashboard</p>

          {/* Error Message */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              'Login'
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Quick Access */}
          <div className="quick-access">
            <p className="quick-title">Quick Access (Demo):</p>
            <div className="quick-buttons">
              <button
                type="button"
                className="btn-quick"
                onClick={() => quickLogin('user@test.com', '123456')}
              >
                Login as User
              </button>
              <button
                type="button"
                className="btn-quick"
                onClick={() => quickLogin('admin@test.com', 'admin123')}
              >
                Login as Admin
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default Login;
