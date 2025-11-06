import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();

  // On mount: if redirected from backend with token, store and navigate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');
    if (token) {
      localStorage.setItem('token', token);
      if (username) localStorage.setItem('user', JSON.stringify({ username }));
      // clean URL
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
      alert('Logged in with Google');
      navigate('/chat');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'https://cura-ai-backend-8o5f.onrender.com';

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors({ submit: data.message || `Login failed (${res.status})` });
        setIsLoading(false);
        return;
      }

      // Save token and user info
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // SHOW ALERT on success, then navigate
      alert(data.message || 'Login successful');
      navigate('/chat', { 
        state: { 
          welcomeMessage: `Welcome back, ${data.user?.username || data.user?.email || 'User'}!`,
          userType: data.user?.userType || 'patient'
        }
      });
    } catch (error) {
      setErrors({ submit: 'Login failed. Network or CORS issue — check backend URL and server.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    if (provider === 'google') {
      const API_BASE = process.env.REACT_APP_API_URL || 'https://cura-ai-backend-8o5f.onrender.com';
      // backend will redirect to Google's consent page
      window.location.href = `${API_BASE}/api/auth/google/url`;
    } else {
      alert(`${provider} OAuth not implemented`);
    }
  };

  const handleDemoLogin = (userType) => {
    // For demo - redirect to chat with user type
    navigate('/chat', { 
      state: { 
        welcomeMessage: `Welcome to Cura AI, ${userType === 'doctor' ? 'Doctor' : 'Patient'}!`,
        userType: userType
      }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-modal">
        <div className="auth-modal-content">
          <div className="auth-header">
            <h2>Welcome to Cura AI</h2>
            <p>Log in to access personalized medical assistance</p>
          </div>

          {/* Demo Login Buttons */}
          <div className="demo-section">
            <p className="demo-label">Quick Demo:</p>
            <div className="demo-buttons">
              <button 
                className="demo-btn doctor"
                onClick={() => handleDemoLogin('doctor')}
                type="button"
              >
                👨‍⚕️ Doctor Demo
              </button>
              <button 
                className="demo-btn patient"
                onClick={() => handleDemoLogin('patient')}
                type="button"
              >
                👤 Patient Demo
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

          <div className="divider">
            <hr /><span>OR</span><hr />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={`email-input ${errors.email ? 'error' : ''}`}
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
                  className={`email-input no-border ${errors.password ? 'error' : ''}`}
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

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button 
              type="submit" 
              className="continue-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Logging in...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
            </p>
            <Link to="/forgot" className="forgot-link">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;