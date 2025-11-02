import React, { useState, useEffect } from 'react';
import './ProductDetailModal.css';
import { apiUpdateProduct } from '../../api/api';

const BASE_URL = 'http://127.0.0.1:8000';

// Komponen mini untuk Status Badge
const StatusBadge = ({ isActive, isLowStock }) => {
  let className = 'status-badge';
  let text = 'Nonaktif';

  if (isActive) {
    className += ' aktif';
    text = 'Aktif';
  }

  // Logika untuk "Menipis"
  if (isActive && isLowStock) {
    className = 'status-badge menipis'; // Timpa style 'aktif'
    text = 'Menipis';
  }

  return <span className={className}>{text}</span>;
};  

function ProductDetailModal({ product, onClose, onUpdateStockSuccess, onStartEdit }) {
  const [mode, setMode] = useState('view');
  const [stockAmount, setStockAmount] = useState(0);
  const [updateType, setUpdateType] = useState('penambahan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setMode('view');
      setStockAmount(0);
      setUpdateType('penambahan');
      setError(null);
    }
  }, [product]);

  if (!product) {
    return null;
  }

  // Fungsi saat tombol "Perbarui" di-klik
  const handleShowUpdateForm = () => {
    setMode('update');
  };

  // Fungsi saat tombol "Batal" di form update di-klik
  const handleCancelUpdate = () => {
    setMode('view');
    setStockAmount(0);
  };
  
  // Fungsi saat form update di-submit
  const handleStockUpdateSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const amount = parseInt(stockAmount, 10);
    const currentStock = parseInt(product.stock, 10);
    let newStock = (updateType === 'penambahan') ? (currentStock + amount) : (currentStock - amount);
    if (newStock < 0) newStock = 0;

    try {
      // Panggil API untuk update. Backend (ProductUpdate) mengizinkan partial update
      const updatedProduct = await apiUpdateProduct(product.id, {
        stock: newStock
      });

      // Sukses! Kirim produk baru ke parent (AdminDashboard)
      onUpdateStockSuccess(updatedProduct);
      
      // Ubah mode ke 'success'
      setMode('success');
    } catch (err) {
      setError(err.message || "Gagal mengupdate stok.");
      // Tetap di mode 'update' agar user bisa lihat error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fungsi untuk menutup alert sukses dan kembali ke mode view
  const handleCloseSuccessAlert = () => {
    setMode('view');
  };

  return (
    <div className="modal-overlay">
      <div className="detail-modal-content">
        
        {/* Header Modal (re-use class dari modal lain) */}
        <div className="modal-header">
          <div>
            <h2>Detail Produk</h2>
            <p>Berikut adalah detail dari produk yang dipilih.</p>
          </div>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        {/* Body Modal */}
        <div className="detail-modal-body">
          {/* Kolom Kiri: Gambar */}
          <div className="detail-image-container">
            <img src={`${BASE_URL}${product.image_url}`} alt={product.name} />
          </div>

          {/* Kolom Kanan: Info */}
          <div className="detail-info-container">
            {/* Info Grid */}
            <div className="info-grid">
              <div className="info-item">
                <label>Nama Produk</label>
                <p>{product.name}</p> 
              </div>
              <div className="info-item">
                <label>Kategori Produk</label>
                <p>{product.category}</p> 
              </div>
              <div className="info-item full-width">
                <label>Deskripsi Produk</label>
                <p>{product.description}</p> 
              </div>
              <div className="info-item">
                <label>Harga Satuan</label>
                
                <p>Rp {product.price.toLocaleString('id-ID')}</p> 
              </div>
              <div className="info-item">
                <label>Status Produk</label>
                
                <StatusBadge 
                  isActive={product.is_active} 
                  isLowStock={product.is_low_stock} 
                />
              </div>
            </div>

            {/* Kotak Stok */}
            <div className="stock-info-box">
              <div>
                <label>Stok Saat Ini</label>
                <p>{product.stock} Unit</p>
              </div>
              {/* Tampilkan link "Perbarui" hanya jika dalam mode 'view' */}
              {mode === 'view' && (
                <button onClick={handleShowUpdateForm} className="perbarui-link">
                  Perbarui
                </button>
              )}
            </div>

            {/* Tampilkan error jika ada */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Tampilkan form update stok jika mode 'update' */}
            {mode === 'update' && (
              <form onSubmit={handleStockUpdateSubmit} className="stock-update-form">
                <label>Update Stok*</label>
                <div className="update-controls">
                  <input
                    type="number"
                    value={stockAmount}
                    onChange={(e) => setStockAmount(e.target.value)}
                    min="0"
                  />
                  <div className="update-tabs">
                    <button
                      type="button"
                      className={updateType === 'penambahan' ? 'active' : ''}
                      onClick={() => setUpdateType('penambahan')}
                    >
                      Penambahan
                    </button>
                    <button
                      type="button"
                      className={updateType === 'pengurangan' ? 'active' : ''}
                      onClick={() => setUpdateType('pengurangan')}
                    >
                      Pengurangan
                    </button>
                  </div>
                </div>
                <div className="update-actions">
                  <button type="button" onClick={handleCancelUpdate} className="btn btn-secondary" disabled={isSubmitting}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Update'}
                  </button>
                </div>
              </form>
            )}

            {/* Tampilkan alert sukses jika mode 'success' */}
            {mode === 'success' && (
              <div className="success-alert">
                <span>✓ Stok berhasil diperbarui!</span>
                <button onClick={handleCloseSuccessAlert} className="close-alert-btn">
                  &times;
                </button>
              </div>
            )}
            
          </div>
        </div>

        {/* Footer Modal (re-use class dari modal lain) */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Tutup
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onStartEdit(product)} // Panggil fungsi dari parent
          >
            Edit Produk
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;