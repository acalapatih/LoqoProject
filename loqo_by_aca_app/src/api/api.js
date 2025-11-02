const BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fungsi helper untuk menangani respons fetch
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Tangkap jika body error bukan JSON
    const errorMessage = errorData.detail || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * Fungsi helper untuk panggilan fetch dengan token
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    // Sesuai app/dependencies/auth.py, kita pakai "Bearer"
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Cek jika body adalah FormData (untuk upload file)
  if (options.body instanceof FormData) {
    delete headers['Content-Type']; // Biarkan browser mengatur Content-Type untuk FormData
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// --- Layanan Autentikasi ---

export const apiLogin = (email, password) => {
  // Endpoint dari app/api/routes/auth.py
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const apiGetMe = () => {
  // Endpoint dari app/api/routes/auth.py
  return apiFetch('/auth/me');
};

// --- Layanan Produk ---

export const apiGetProducts = (params = {}) => {
  // Endpoint dari app/api/routes/products.py (GET "")
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/products?${query}`);
};

export const apiGetProductById = (productId) => {
  // Endpoint dari app/api/routes/products.py (GET "/{product_id}")
  return apiFetch(`/products/${productId}`);
};

export const apiCreateProduct = (productData) => {
  // Endpoint dari app/api/routes/products.py (POST "")
  return apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const apiUpdateProduct = (productId, productData) => {
  // Endpoint dari app/api/routes/products.py (PUT "/{product_id}")
  return apiFetch(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

// --- Layanan Upload ---

export const apiUploadImage = (file) => {
  // Endpoint dari app/api/routes/uploads.py (POST "/image")
  const formData = new FormData();
  formData.append('image', file);
  
  // Kirim dengan sub_directory 'products'
  return apiFetch('/uploads/image?sub_directory=products', {
    method: 'POST',
    body: formData,
  });
};