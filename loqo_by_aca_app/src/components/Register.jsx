import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { email, password, full_name: fullName });
      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      alert(`Gagal mendaftar: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div>
      <h2>Daftar Pengguna Baru</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama Lengkap:</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Daftar</button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
    </div>
  );
}

export default Register;