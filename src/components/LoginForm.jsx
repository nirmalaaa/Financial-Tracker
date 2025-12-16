import React, { useState } from 'react';
import { Star, Sparkles, Mail, Lock, LogIn, UserPlus, Zap, Trophy, Target, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
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
      <Sparkles className="star-decoration star-5" size={20} />
      <Star className="star-decoration star-6" size={18} />

      {/* Main Content */}
      <div className="login-content">
        {/* Header with Icon */}
        <div className="circus-header">
          <div className="circus-icon-wrapper">
            <Zap size={50} />
          </div>
          <h1 className="circus-title">WELCOME BACK</h1>
          <p className="circus-subtitle">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <div className="error-icon-wrapper">
                <Sparkles size={18} />
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">
              <div className="label-icon-wrapper email">
                <Mail size={14} />
              </div>
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
              <div className="label-icon-wrapper password">
                <Lock size={14} />
              </div>
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
            >
              <LogIn size={18} className="btn-icon" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper trophy">
                <Trophy size={24} />
              </div>
              <div className="feature-text">Level Up</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper target">
                <Target size={24} />
              </div>
              <div className="feature-text">Track Goals</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper zap">
                <Zap size={24} />
              </div>
              <div className="feature-text">Earn Rewards</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper gift">
                <Gift size={24} />
              </div>
              <div className="feature-text">Daily Quests</div>
            </div>
          </div>

          <div className="signup-text">
            New to the circus? 
            <span className="signup-link" onClick={() => navigate('/signup')}>
              <UserPlus size={14} className="signup-icon" />
              Join the Show
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;