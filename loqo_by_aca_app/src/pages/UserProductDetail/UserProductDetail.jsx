import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams
import './UserProductDetail.css'; // Kita akan buat file CSS-nya
import { apiGetProductById } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/logo.png';

const BASE_URL = 'http://127.0.0.1:8000';

function UserProductDetail() {
  const { productId } = useParams(); // Ambil 'productId' dari URL
  const { user, logout } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Data Hardcode untuk UI
  const hardcodedData = {
    rating: 4.5,
    terjual: 30,
    diskon: -12,
    garansi: "4 - 6 September",
    thumbnail: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=100'
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await apiGetProductById(productId);
        setProduct(fetchedProduct);
        setSelectedImage(`${BASE_URL}${fetchedProduct.image_url}`); // Set gambar utama
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Jalankan ulang jika productId berubah

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>; // Tampilkan error
  }

  if (!product) {
    return <div>Produk tidak ditemukan.</div>;
  }

  // Daftar gambar (dummy, seharusnya dari API)
  const imageGallery = [
    product.image_url,
    hardcodedData.thumbnail,
    hardcodedData.thumbnail,
    hardcodedData.thumbnail,
  ];

  return (
    <div className="product-detail-container">
      {/* Header/Navigasi */}
      <nav className="home-nav-detail">
        <Link to="/">
          <img src={logoImage} alt="Logo" className="home-logo" />
        </Link>
        <div className="home-user-menu" onClick={logout}>
          <span>{user.name} ▼</span>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="detail-content">
        {/* Kolom Kiri: Gambar */}
        <div className="detail-images">
          <div className="main-image-container">
            <img src={selectedImage} alt={product.name} className="main-image" />
          </div>
          <div className="thumbnail-gallery">
            {imageGallery.map((img, index) => (
              <img
                key={index}
                src={img.startsWith('http') ? img : `${BASE_URL}${img}`}
                alt={`Thumbnail ${index + 1}`}
                className={selectedImage === `${BASE_URL}${img}` ? 'active' : ''}
                onClick={() => setSelectedImage(img.startsWith('http') ? img : `${BASE_URL}${img}`)}
              />
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Info Produk */}
        <div className="detail-info">
          <h2>{product.name}</h2>
          
          <div className="info-stats">
            <span>⭐ {hardcodedData.rating}</span>
            <span>|</span>
            <span>{hardcodedData.terjual} Terjual</span>
          </div>

          <div className="info-price">
            <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
            <span className="discount">{hardcodedData.diskon}%</span>
          </div>
          
          <div className="info-divider"></div>

          <dl className="info-dl">
            <dt>Pengiriman</dt>
            <dd>
              <strong>Garansi Tiba: {hardcodedData.garansi}</strong>
              <small>Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.</small>
            </dd>
            
            <dt>Kuantitas</dt>
            <dd>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <span className="stock-info">
                Tersedia ({product.stock} {product.stock_unit})
              </span>
            </dd>
          </dl>

          <button className="btn-buy">Beli Produk</button>
        </div>
      </main>

      {/* Deskripsi */}
      <section className="detail-description">
        <h3>Deskripsi Produk</h3>
        <p>
          Hadirkan nuansa mewah dan elegan di ruang makan Anda dengan Meja Makan Kayu Jati - Ukuran Besar 100m². Terbuat dari kayu jati pilihan yang terkenal kokoh, tahan lama, dan memiliki serat alami yang indah, meja ini tidak hanya berfungsi sebagai tempat makan tetapi juga sebagai investasi furnitur jangka panjang.
        </p>
        <p>
          {product.description}
        </p>

        <strong>Spesifikasi Produk:</strong>
        <ul>
          <li>Material: 100% Kayu Jati Solid</li>
          <li>Ukuran: 100m² (custom ukuran dapat dipesan)</li>
          <li>Warna: Natural kayu jati dengan finishing glossy/matte</li>
          <li>Kapasitas: Hingga 12-16 orang</li>
          <li>Kelebihan: Tahan rayap, kuat, dan berkarakter alami</li>
        </ul>

        <strong>Kelebihan Produk:</strong>
        <ul>
          <li>✅ Material premium, awet hingga puluhan tahun</li>
          <li>✅ Desain elegan dan mewah</li>
          <li>✅ Cocok untuk rumah, villa, atau restoran besar</li>
          <li>✅ Permukaan meja luas dan mudah dibersihkan</li>
        </ul>
      </section>
    </div>
  );
}

export default UserProductDetail;