import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../api/api';

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Gagal mengambil data user:', error);
        setAuthToken(null);
        alert('Sesi berakhir atau otorisasi gagal. Silakan login kembali.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem('access_token')) {
        navigate('/login');
    } else {
        fetchUsers();
    }
    
  }, [navigate]);

  const handleLogout = async () => {
    try {
        await API.post('/auth/logout'); 
    } catch (error) {
        console.warn("Gagal panggil logout API, tapi akan tetap menghapus token lokal.");
    }
    setAuthToken(null);
    navigate('/login');
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div>
      <h2>Halaman Utama (Akses Terproteksi)</h2>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      <h3>Daftar Pengguna (Diambil dari {API.defaults.baseURL}/users)</h3>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.id} | {user.email} ({user.full_name || 'N/A'})
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada pengguna terdaftar (kecuali yang baru saja didaftarkan).</p>
      )}
    </div>
  );
}

export default Home;