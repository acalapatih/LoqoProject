import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiGetMe } from '../../src/api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek token saat aplikasi dimuat
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Panggil endpoint /auth/me untuk mendapatkan data user
          const userData = await apiGetMe(); 
          setUser(userData);
        } catch (error) {
          // Token tidak valid atau expired
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = async (email, password) => {
    // Panggil API login
    const data = await apiLogin(email, password);
    // Simpan token ke localStorage
    localStorage.setItem('authToken', data.access_token);
    // Ambil data user
    const userData = await apiGetMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Jangan render apapun sampai selesai loading
  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan splash screen
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan context
export const useAuth = () => {
  return useContext(AuthContext);
};