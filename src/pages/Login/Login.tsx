import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, setToken } from '../../api/client';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        setToken(result.data.token);
        setUsername('');
        setPassword('');
        navigate('/', { replace: true });
      } else if (response.status === 401) {
        setError('Username atau password salah!');
      } else {
        setError(result.error || result.message);
      }
    } catch {
      setError('Tidak dapat terhubung ke server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#2563EB" />
              <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20C10.686 20 8 17.314 8 14Z" stroke="white" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="1" fill="white" />
            </svg>
          </div>
          <h1 className="login-title">Laundrify Admin</h1>
          <p className="login-subtitle">Silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              autoComplete="off"
              className="form-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="form-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block">
            Masuk
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;