import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
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

    const result = await signup(formData);

    if (result.success) {
      showToast('✅ Account created successfully!', 'success');
      
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Logo */}
        <div className="auth-logo">
          <h1>Job<span>Board</span></h1>
          <p>Create your account</p>
        </div>

        {/* Signup Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Get Started</h2>
          <p className="auth-subtitle">Join thousands of job seekers</p>

          {/* Error Message */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              minLength={2}
            />
          </div>

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
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Job Seeker (User)</option>
              <option value="admin">Recruiter (Admin)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default Signup;
