import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import { apiGetProducts } from '../../api/api';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import '../../components/SuccessModal/SuccessModal.css';
import ProductDetailModal from '../../components/ProductDetailModal/ProductDetailModal';
import '../../components/ProductDetailModal/ProductDetailModal.css';
import logoImage from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = 'http://127.0.0.1:8000';

  const StatusBadge = ({ status, isLowStock }) => { 
    let className = 'status-badge';
    let text = 'Nonaktif';
    
    if (status) {
      className += ' aktif';
      text = 'Aktif';
      if (isLowStock) {
        className += ' menipis';
        text = 'Menipis';
      }
    } else {
      className += ' nonaktif';
    }

    return <span className={className}>{text}</span>;
  };


function AdminDashboard() {
  const { user, logout } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [successMode, setSuccessMode] = useState('create');
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        search: search || "",
      };

      const response = await apiGetProducts(params);
      
      setProducts(response.data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddNewProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    setShowSuccessModal(true);
  };

  const handleUpdateStock = (updatedProduct) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setSelectedProductId(null);
    setShowAddModal(true);
  };

  const handleStartCreate = () => {
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const onSaveSuccess = (savedProduct) => {
    if (editingProduct) {
        setProducts(prev => 
        prev.map(p => p.id === savedProduct.id ? savedProduct : p)
        );
        setSuccessMode('update');
    } else {
        setProducts([savedProduct, ...products]);
        setSuccessMode('create');
    }
    setShowAddModal(false);
    setEditingProduct(null);
    setShowSuccessModal(true);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="admin-dashboard">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header-nav">
        <div className="logo">
           <img src={logoImage} alt="Logo" style={{ height: '30px' }} />
        </div>
        <div className="user-menu" onClick={logout}>
          <span>{user.name}</span>
          <span className="icon">▼</span>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-content">
        <div className="content-header">
          <h1>Daftar Produk</h1>
          <p>Lihat semua produk yang tersedia di inventaris.</p>
        </div>

        <div className="filter-actions">
          <div className="filters">
            <input type="text" placeholder="Cari produk" className="search-input" />
            <select>
              <option>Semua Kategori</option>
              <option>Meja</option>
              <option>Kursi</option>
              <option>Lemari</option>
            </select>
            <select>
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Menipis</option>
              <option>Nonaktif</option>
            </select>
            <select>
              <option>Urutkan: Nama Produk</option>
            </select>
            <button className="btn-sort">Asc</button>
          </div>
          <div className="actions">
            <button className="btn btn-secondary">Perbarui Stok Produk</button>
            <button 
              className="btn btn-primary"
              onClick={handleStartCreate} 
            >
              + Tambah Produk
            </button>
          </div>
        </div>

        {/* ===== TABEL PRODUK ===== */}
        <div className="product-table-container">
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
          )}
          {error && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                Error: {error}
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Harga (Rp)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <img src={`${BASE_URL}${product.image_url}`} alt={product.name} />
                        <span>{product.name}</span> {/* ganti namaProduk */}
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{product.price.toLocaleString('id-ID')}</td>
                    <td>
                      {/* Kirim is_active (boolean) dan is_low_stock */}
                      <StatusBadge status={product.is_active} isLowStock={product.is_low_stock} />
                    </td>
                    <td>
                      <button 
                        onClick={() => setSelectedProductId(product.id)} 
                        className="action-link-btn"
                      >
                        Lihat Detail
                      </button>
                      <span className="action-dots">...</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINASI ===== */}
        <div className="pagination-container">
          <div className="pagination-info">
            <span>Menampilkan</span>
            <select defaultValue="10">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>Dari 52 Data</span>
          </div>
          <div className="pagination-controls">
            <button>&lt;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <span>...</span>
            <button>12</button>
            <button>13</button>
            <button>&gt;</button>
          </div>
        </div>
      </main>

      {/* ===== SEMUA MODAL DITARUH DI SINI ===== */}
      
      {/* Modal Tambah Produk */}
      <AddProductModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        productToEdit={editingProduct} // Kirim produk untuk di-edit
        onSaveSuccess={onSaveSuccess}  // Kirim callback sukses
      />
      <SuccessModal 
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        mode={successMode} // <-- KIRIM STATE MODE KE MODAL
      />
      <ProductDetailModal 
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
        onUpdateStockSuccess={handleUpdateStock} 
        onStartEdit={handleStartEdit} // <-- Kirim fungsi untuk "Edit Produk"
      />
    </div>
  );
}

export default AdminDashboard;