import React, { useState } from 'react';
import { Star, Sparkles, Trophy, Target, User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css';

const SignUpForm = () => {
  const navigate = useNavigate(); // INI YANG DITAMBAHKAN
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = () => {
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required!');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        // REDIRECT KE DASHBOARD
        navigate('/dashboard');
      }, 2500);
    }, 1500);
  };

  return (
    <div className="circus-container">
      {/* Decorative Stars */}
      <Star className="star-decoration star-1" size={20} />
      <Star className="star-decoration star-2" size={16} />
      <Sparkles className="star-decoration star-3" size={18} />
      <Star className="star-decoration star-4" size={22} />
      <Sparkles className="star-decoration star-5" size={16} />
      <Star className="star-decoration star-6" size={20} />

      {/* Main Content */}
      <div className="login-content">
        {/* Header */}
        <div className="circus-header">
          <div className="circus-tent">🎪</div>
          <h1 className="circus-title">JOIN THE CIRCUS</h1>
          <p className="circus-subtitle">Create Your Adventure</p>
        </div>

        {/* Signup Form */}
        <div className="login-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">
              <User size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              placeholder="create password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Create Account Button */}
          <div className="btn-group">
            <button 
              onClick={handleSubmit}
              className={`circus-btn btn-primary ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
              style={{ flex: 'none', width: '100%' }}
            >
              <span>{loading ? 'Creating Account...' : '🎯 Create Account'}</span>
            </button>
          </div>

          <div className="divider">
            <span>BENEFITS</span>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <Trophy className="feature-icon" size={24} />
              <div className="feature-text">Earn Rewards</div>
            </div>
            <div className="feature-card">
              <Target className="feature-icon" size={24} />
              <div className="feature-text">Track Progress</div>
            </div>
            <div className="feature-card">
              <Sparkles className="feature-icon" size={24} />
              <div className="feature-text">Unlock Features</div>
            </div>
            <div className="feature-card">
              <Star className="feature-icon" size={24} />
              <div className="feature-text">Compete Global</div>
            </div>
          </div>

          <div className="signup-text">
            Already have an account? <span className="signup-link" onClick={() => navigate('/')}>Sign In</span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-confetti">
              <Sparkles className="confetti-1" size={24} />
              <Star className="confetti-2" size={20} />
              <Sparkles className="confetti-3" size={22} />
              <Star className="confetti-4" size={18} />
            </div>
            <div className="success-icon">🎪</div>
            <h2 className="success-title">WELCOME TO THE CIRCUS!</h2>
            <p className="success-message">
              Your account has been created successfully.<br />
              Get ready for an amazing adventure!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;