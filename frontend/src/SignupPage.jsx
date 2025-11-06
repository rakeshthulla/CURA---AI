import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Use explicit backend base URL. Set REACT_APP_API_URL in .env (e.g. http://localhost:5000)
      const API_BASE = process.env.REACT_APP_API_URL || 'https://cura-ai-backend-8o5f.onrender.com';

      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json().catch(() => ({})); // guard if non-json response

      if (!res.ok) {
        // include status for easier debugging
        setErrors({ submit: data.message || `Signup failed (${res.status})` });
        setIsLoading(false);
        return;
      }

      // SUCCESS: show alert then navigate to login page
      alert(data.message || 'Signup successful — please log in.');
      navigate('/login');
    } catch (error) {
      // clearer debug message for network / CORS / DNS issues
      setErrors({ submit: 'Signup failed. Network or CORS issue — check backend URL and server.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    if (provider === 'google') {
      const API_BASE = process.env.REACT_APP_API_URL || 'https://cura-ai-backend-8o5f.onrender.com';
      window.location.href = `${API_BASE}/api/auth/google/url`;
    } else {
      alert(`${provider} OAuth not implemented`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <div className="auth-modal-content">
          <div className="auth-header">
            <h2>Join Cura AI</h2>
            <p>Create your account to access personalized medical assistance</p>
          </div>

          {/* User Type Selection */}
          <div className="user-type-selector">
            <label>I am a:</label>
            <div className="user-type-buttons">
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'patient' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, userType: 'patient' }))}
              >
                👤 Patient
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'doctor' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, userType: 'doctor' }))}
              >
                👨‍⚕️ Healthcare Professional
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="oauth-section">
            <button 
              className="oauth-button google"
              onClick={() => handleOAuth('google')}
              type="button"
            >
              <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" />
              Continue with Google
            </button>
            <button 
              className="oauth-button apple"
              onClick={() => handleOAuth('apple')}
              type="button"
            >
              <img src="https://img.icons8.com/ios-filled/16/mac-os.png" alt="Apple" />
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <hr /><span>OR</span><hr />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={`text-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={`text-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`text-input no-border ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <span 
                  className="eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🔒'}
                </span>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className={`text-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button 
              type="submit" 
              className="continue-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" className="auth-link">Log in</Link>
            </p>
            <div className="footer-links">
              <a href="#">Terms of Use</a>
              <span>|</span>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;