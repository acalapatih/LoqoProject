import React, { useState, useEffect } from 'react';
import './AddProductModal.css';
import { apiUploadImage, apiCreateProduct, apiUpdateProduct } from '../../api/api';

const BASE_URL = 'http://127.0.0.1:8000';

// Kategori dummy untuk dropdown
const kategoriOptions = [
  'Meja',
  'Kursi',
  'Lemari',
  'Tempat Tidur',
  'Rak',
  'Bufet',
];
// Unit dummy untuk dropdown
const unitOptions = ['Unit', 'Pcs', 'Set'];

function AddProductModal({ show, onClose, productToEdit, onSaveSuccess }) {
  // State untuk setiap input
  const [namaProduk, setNamaProduk] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState(0);
  const [stok, setStok] = useState(0);
  const [unit, setUnit] = useState('Unit');
  const [isNonaktif, setIsNonaktif] = useState(true); // Toggle status
  const [file, setFile] = useState(null); // State untuk file gambar
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [lowStockUnit, setLowStockUnit] = useState('pcs');
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const isEditMode = Boolean(productToEdit);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // useEffect untuk mengecek validasi setiap kali input berubah
  useEffect(() => {
    // Hanya jalankan jika modalnya 'show'
    if (show) { 
      if (isEditMode) {
        // --- MODE EDIT: Isi form dengan data produk ---
        setNamaProduk(productToEdit.name);
        setKategori(productToEdit.category);
        setDeskripsi(productToEdit.description || '');
        setHarga(productToEdit.price);
        setStok(productToEdit.stock);
        setUnit(productToEdit.stock_unit);
        setIsNonaktif(!productToEdit.is_active);
        setLowStockThreshold(productToEdit.low_stock_threshold);
        setLowStockUnit(productToEdit.low_stock_unit);
        setFile(null); // Selalu reset pilihan file
        setError(null);
        setExistingImageUrl(productToEdit.image_url);
      } else {
        // --- MODE TAMBAH: Reset form ---
        resetForm();
      }
    }
  }, [productToEdit, show]);

  useEffect(() => {
    const isValid =
      namaProduk.trim() !== '' &&
      kategori !== '' &&
      harga > 0 &&
      stok >= 0 && 
      lowStockThreshold >= 0;
    setIsFormValid(isValid);
  }, [namaProduk, kategori, harga, stok, lowStockThreshold]);

  // Handler saat form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    let uploadedImageUrl = null;

    try {
      // 1. Upload Gambar (logika ini sama)
      if (file) {
        const uploadResponse = await apiUploadImage(file);
        uploadedImageUrl = uploadResponse.image_url;
      }

      // 2. Siapkan Data Produk (logika ini sama)
      const productData = {
        name: namaProduk,
        category: kategori,
        description: deskripsi,
        price: Number(harga),
        stock: Number(stok),
        stock_unit: unit,
        is_active: !isNonaktif,
        low_stock_threshold: Number(lowStockThreshold),
        low_stock_unit: lowStockUnit,
        // Jika upload gambar baru, gunakan URL baru.
        // Jika tidak, gunakan URL lama (jika edit) atau null (jika tambah)
        image_url: uploadedImageUrl || (isEditMode ? productToEdit.image_url : null),
      };

      let savedProduct;
      
      // 3. Panggil API yang Sesuai
      if (isEditMode) {
        // --- PANGGIL API UPDATE ---
        savedProduct = await apiUpdateProduct(productToEdit.id, productData);
      } else {
        // --- PANGGIL API CREATE ---
        savedProduct = await apiCreateProduct(productData);
      }

      // 4. Sukses! Panggil callback 'onSaveSuccess' dari parent
      onSaveSuccess(savedProduct);
      resetForm();

    } catch (err) {
      setError(err.message || (isEditMode ? 'Gagal mengupdate produk.' : 'Gagal menambahkan produk.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    setNamaProduk('');
    setKategori('');
    setDeskripsi('');
    setHarga(0);
    setStok(0);
    setUnit('Unit');
    setIsNonaktif(true);
    setFile(null);
  };

  // Fungsi untuk handle Batal
  const handleCancel = () => {
    onClose(); // Tutup modal
  };

  // Jangan render apapun jika show = false
  if (!show) {
    return null;
  }

  let imagePreview = null;
  if (file) {
    imagePreview = URL.createObjectURL(file);
  } else if (isEditMode && existingImageUrl) {
    imagePreview = `${BASE_URL}${existingImageUrl}`;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2>{isEditMode ? 'Edit Produk' : 'Tambah Produk'}</h2>
            <p>Masukkan detail produk untuk menambahkannya ke inventaris.</p>
          </div>
          <button onClick={handleCancel} className="close-button">
            &times;
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Tampilkan error API */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div className="form-grid">
            {/* Kolom Kiri: Upload Gambar */}
            <div className="image-uploader">
              <div className="image-placeholder">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <span>🖼️</span> // Tampilkan ikon jika tidak ada gambar
                )}
              </div>
              <label htmlFor="file-upload" className="upload-button">
                Unggah Gambar
              </label>
              <input 
                id="file-upload" 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
            </div>

            {/* Kolom Kanan: Form Fields */}
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="namaProduk">Nama Produk*</label>
                <input
                  id="namaProduk"
                  type="text"
                  placeholder="Masukan nama produk"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="kategori">Kategori Produk*</label>
                <select
                  id="kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  {kategoriOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="deskripsi">Deskripsi Produk</label>
                <textarea
                  id="deskripsi"
                  placeholder="Masukan deskripsi produk"
                  rows="4"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                ></textarea>
              </div>

              <div className="split-group">
                <div className="form-group">
                <label htmlFor="harga">Harga Satuan*</label>
                <div className="input-with-prefix">
                    <span>Rp</span>
                    <input
                    id="harga"
                    type="number"
                    value={harga}
                    onChange={(e) => setHarga(e.target.valueAsNumber || 0)}
                    />
                </div>
                </div>
                <div className="form-group">
                <label htmlFor="stok">Stok Awal*</label>
                <input
                    id="stok"
                    type="number"
                    value={stok}
                    onChange={(e) => setStok(e.target.valueAsNumber || 0)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                >
                    {unitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                    ))}
                </select>
                </div>
            </div>

              {/* Grup untuk Harga dan Stok */}
              <div className="split-group">
                <div className="form-group">
                  <label htmlFor="lowStockThreshold">Batas Stok Menipis*</label>
                  <input
                    id="lowStockThreshold"
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.valueAsNumber || 0)}
                  />
                </div>
                 <div className="form-group">
                  <label htmlFor="lowStockUnit">Unit Stok Menipis</label>
                  <select
                    id="lowStockUnit"
                    value={lowStockUnit}
                    onChange={(e) => setLowStockUnit(e.target.value)}
                  >
                    {unitOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Produk Toggle */}
              <div className="status-group">
                <div>
                  <label>Status Produk</label>
                  <p>
                    Sistem akan menandai produk sebagai "Menipis" secara
                    otomatis jika stoknya mendekati habis.
                  </p>
                </div>
                <div className="toggle-switch">
                  <span>Nonaktif</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!isNonaktif}
                      onChange={() => setIsNonaktif(!isNonaktif)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer: Tombol Aksi */}
          <div className="modal-footer">
            <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={isSubmitting}>
              Batal
            </button>
            <button
              type="submit"
              className={`btn ${isFormValid && !isSubmitting ? 'btn-primary' : 'btn-disabled'}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Update' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;