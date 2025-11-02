import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/logo.png';

// Hapus 'onLoginSuccess' dari props
function Login() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth(); // Ambil fungsi login dari context

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); 

    try {
      await login(email, password);
      // 'App.js' akan otomatis pindah halaman
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logoImage} alt="Logo" style={{ width: 150 }} />
        </div>
        
        <p className="login-subtitle">
          Enter your email and password correctly.
        </p> 

        {/* Ini akan menampilkan error "Failed to fetch" jika backend mati */}
        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;