import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // <-- IMPORT
import './index.css'; 

// Import Halaman
import Login from './pages/Login/Login';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserHome from './pages/UserHome/UserHome';
import UserProductDetail from './pages/UserProductDetail/UserProductDetail'; // <-- HALAMAN BARU

// Import hook Auth
import { useAuth } from './context/AuthContext';

// Komponen helper untuk melindungi route
const ProtectedRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    // Jika tidak ada user, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }
  
  // Jika ada user, tampilkan halaman yang diminta (Outlet)
  return <Outlet />;
};

function App() {
  const { user } = useAuth();

  // Cek apakah user admin (asumsi dari email)
  const isAdmin = user && user.email.includes('admin');

  return (
    <Routes>
      {/* Rute Publik */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />

      {/* Rute Terproteksi */}
      <Route element={<ProtectedRoute />}>
        <Route 
          path="/" 
          element={
            isAdmin ? 
            <Navigate to="/admin" replace /> : 
            <UserHome />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAdmin ? 
            <AdminDashboard /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/product/:productId" 
          element={<UserProductDetail />} 
        />
        {/* Tambahkan rute terproteksi lainnya di sini */}
      </Route>
      
      {/* Fallback untuk URL yang tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Hapus AdminDashboard dari sini jika sudah dipindah ke file sendiri
// function AdminDashboardWrapper() {
//   const { user, logout } = useAuth();
//   return <AdminDashboard user={user} onLogout={logout} />;
// }

// function UserHomeWrapper() {
//   const { user, logout } = useAuth();
//   return <UserHome user={user} onLogout={logout} />;
// }

export default App;