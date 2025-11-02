

## Prerequisites

Pastikan sudah terinstall:
- ✅ **Python 3.13+** (cek dengan `python3 --version`)
- ✅ **MongoDB**
- ✅ **pip**

---

## Step-by-Step Setup

### 1. Masuk ke Folder Project

```bash
cd /Users/mohammadzakaria/python-project/backend-v1
```

### 2. Aktifkan Virtual Environment

```bash
source env/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip

pip install -r requirements.txt
```

### 4. Setup MongoDB

#### Opsi A: Jika MongoDB Sudah Terinstall via Homebrew (macOS)

```bash
# Check apakah MongoDB sudah terinstall
brew services list | grep mongodb

# Jika belum terinstall:
brew tap mongodb/brew
brew install mongodb-community@8.0

# Start MongoDB
brew services start mongodb-community@8.0
```

#### Opsi B: Jalankan MongoDB dari Tarball (Tanpa Install)

```bash
mkdir -p ~/mongo-data

# Jalankan MongoDB di background
nohup /Users/mohammadzakaria/Downloads/mongodb-macos-aarch64--8.2.1/bin/mongod \
  --dbpath ~/mongo-data \
  --bind_ip 127.0.0.1 \
  --port 27017 \
  --logpath ~/mongo-data/mongod.log > ~/mongo-data/mongod.out 2>&1 &

# Check apakah MongoDB sudah running
lsof -i :27017
```

### 5. Buat Folder Uploads

```bash
# Buat folder untuk file uploads
mkdir -p uploads/products uploads/users uploads/general

# Set permissions (jika perlu)
chmod -R 755 uploads/
```

### 6. Setup Database

Buka file `database.py` lalu sesuaikan dengan kebutuhan:

```python
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=fastapi_db
```

### 7. Update IP di main.py (Opsional)

Jika ingin akses dari device lain di network yang sama, update IP di `main.py`:

```python
uvicorn.run(
    "main:app",
    host="10.175.61.73",  # Ganti dengan IP Anda
    port=32112,
    reload=True
)
```

Atau gunakan `0.0.0.0` untuk listen di semua interface:
```python
host="0.0.0.0"  # Bisa diakses dari semua IP
```

---

## Menjalankan Backend

### Cara 1: Menggunakan Python

```bash
# Pastikan virtual environment aktif
source env/bin/activate

# Jalankan
python main.py
```

### Cara 2: Menggunakan Uvicorn Langsung

```bash
# Pastikan virtual environment aktif
source env/bin/activate

# Jalankan dengan uvicorn
uvicorn main:app --host 0.0.0.0 --port 32112 --reload
```

**Tanda sukses:**
```
INFO:     Uvicorn running on http://0.0.0.0:32112 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---
