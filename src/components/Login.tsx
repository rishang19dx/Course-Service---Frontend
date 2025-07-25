import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import './Login.css';

interface LoginResponse {
  message: string;
  user: {
    uid: string;
  };
}

const Login: React.FC = () => {
  const [uid, setUid] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!uid.trim()) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response: LoginResponse = await login(uid);
      // Store session token
      console.log(response);
      sessionStorage.setItem('uid', uid);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="header-top">
          <div className="logo-section">
            <img src="/logo.jpg" alt="IIT Mandi" className="logo" />
            <div className="institute-name">
              <h1>भारतीय प्रौद्योगिकी संस्थान मंडी</h1>
              <h2>Indian Institute of Technology Mandi</h2>
            </div>
          </div>
        </div>
        <div className="header-subtitle">
          <p>Course Management System - Administrative Portal</p>
        </div>
      </div>

      <div className="login-main">
        <div className="login-box">
          <div className="login-title">
            <h3>Administrator Login</h3>
            <p>Enter your unique administrator ID to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="uid">Administrator ID</label>
              <input
                type="text"
                id="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Enter your unique administrator ID"
                className={error ? 'error' : ''}
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>Authorized personnel only. All access is logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
