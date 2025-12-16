import React, { useState } from 'react';
import { Star, Sparkles, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate(); // INI YANG DITAMBAHKAN
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = () => {
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('All fields are required!');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // REDIRECT KE DASHBOARD
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="circus-container">
      {/* Decorative Stars */}
      <Star className="star-decoration star-1" size={20} />
      <Star className="star-decoration star-2" size={16} />
      <Sparkles className="star-decoration star-3" size={18} />
      <Star className="star-decoration star-4" size={22} />

      {/* Main Content */}
      <div className="login-content">
        {/* Header */}
        <div className="circus-header">
          <div className="circus-tent">🎪</div>
          <h1 className="circus-title">WELCOME BACK</h1>
          <p className="circus-subtitle">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Sign In Button */}
          <div className="btn-group">
            <button 
              onClick={handleSubmit}
              className={`circus-btn btn-primary ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
              style={{ flex: 'none', width: '100%' }}
            >
              <span>{loading ? 'Signing In...' : '🎯 Sign In'}</span>
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="signup-text">
            New to the circus? <span className="signup-link" onClick={() => navigate('/signup')}>Join to the Show</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;