import React, { useState } from 'react';

// 1. Import komponen Halaman (Pages)
import Login from './pages/Login/Login';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserHome from './pages/UserHome/UserHome';

// 2. Import CSS global (jika Anda memindahkan styling <body> dari Login.css)
// import './index.css'; 

function App() {
  // 3. State untuk menyimpan data user yang sedang login
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 4. Fungsi ini akan dipanggil oleh komponen Login saat berhasil
  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
  };

  // 5. Fungsi untuk logout (bisa di-pass ke dashboard nanti)
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // 6. Logika untuk render halaman
  // Jika belum login, tampilkan halaman Login
  if (!loggedInUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Jika sudah login, cek rolenya
  switch (loggedInUser.role) {
    case 'admin':
      return <AdminDashboard user={loggedInUser} onLogout={handleLogout} />;
    
    case 'user':
      return <UserHome user={loggedInUser} onLogout={handleLogout} />;

    default:
      return <Login onLoginSuccess={handleLoginSuccess} />;
  }
}

export default App;