import React, { useState, useEffect } from 'react';
import './UserHome.css';
import logoImage from '../../assets/logo.png'; 
import { apiGetProducts } from '../../api/api';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const BASE_URL = 'http://127.0.0.1:8000';

// Komponen Kartu Produk (Dibungkus dengan Link)
function ProductCard({ product, index }) {
  // Data Hardcode untuk UI
  const hardcodedRating = 4.9;
  const hardcodedSold = 100 + index;
  const hardcodedDiscount = 30;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img 
        src={`${BASE_URL}${product.image_url}`} 
        alt={product.name} 
        className="product-image" 
      />
      <div className="product-card-content">
        <h3>{product.name}</h3>
        <div className="price-container">
          <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
          <span className="discount">-{hardcodedDiscount}%</span>
        </div>
        <div className="product-stats">
          <span>⭐ {hardcodedRating}</span>
          <span>|</span>
          <span>{hardcodedSold} Terjual</span>
        </div>
      </div>
    </Link>
  );
}


// Komponen Halaman Utama User
function UserHome() {
  
  // Ambil user & logout dari Context
  const { user, logout } = useAuth(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ambil 8 produk untuk rekomendasi
        const response = await apiGetProducts({ page: 1, limit: 8 });
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Hanya jalan sekali saat dimuat

  return (
    <div className="user-home-container">
      
      {/* ===== HEADER & HERO ===== */}
      <header className="home-header">
        <div className="hero-background">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=80" alt="Hero" />
        </div>
        <div className="hero-overlay"></div>
        
        <nav className="home-nav">
          <Link to="/"> {/* Tambahkan Link ke logo */}
            <img src={logoImage} alt="Logo" className="home-logo" />
          </Link>
          <div className="home-user-menu" onClick={logout}>
            <span>{user.name} ▼</span>
          </div>
        </nav>
        
        <div className="hero-content">
          <h1>Cari Funitur Impian</h1>
          <p>Cari funitur mulai dari meja, lemari, hingga rak disini</p>
          <form className="home-search-bar">
            <input type="text" placeholder="Cari produk" />
            <button type="submit">
              <span>🔍</span>
            </button>
          </form>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="home-content">
        <section className="recommendation-section">
          <div className="section-header">
            <div>
              <h2>Rekomendasi</h2>
              <p>Produk - produk pilihan terbaik dari kami</p>
            </div>
            <button className="btn-view-all">Lihat Semua Produk</button>
          </div>

          {/* Tampilkan Loading, Error, atau Data */}
          {loading && <p>Loading produk...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && (
            <div className="product-grid">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserHome;