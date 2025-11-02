import React from 'react';
import './SuccessModal.css';

function SuccessModal({ show, onClose, mode = 'create' }) {
  if (!show) {
    return null;
  }

  // Tentukan teks secara dinamis berdasarkan prop 'mode'
  const isCreateMode = mode === 'create';

  const title = isCreateMode
    ? "Berhasil Ditambah!"
    : "Berhasil Diperbarui!";

  const message = isCreateMode
    ? "Produk baru berhasil disimpan dan sekarang muncul di daftar produk."
    : "Perubahan produk berhasil disimpan dan akan tampil di daftar produk.";

  return (
    <div className="modal-overlay"> 
      <div className="success-modal-content">
        
        {/* Ikon Checkmark */}
        <div className="success-icon-wrapper">
          <div className="success-icon-circle">
            <span className="success-icon-check">✓</span>
          </div>
        </div>

        {/* Teks Dinamis */}
        <h2>{title}</h2>
        <p>
          {message}
        </p>

        {/* Tombol Tutup */}
        <button onClick={onClose} className="btn-close-success">
          Tutup
        </button>

      </div>
    </div>
  );
}

export default SuccessModal;