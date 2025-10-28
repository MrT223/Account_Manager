# 🔑 Account Manager (Quản Lý Tài Khoản & Mật Khẩu)

## Giới Thiệu

Đây là ứng dụng quản lý tài khoản/mật khẩu sử dụng kiến trúc **MERN Stack** với giao diện hiện đại (Dark Mode) được xây dựng bằng **Tailwind CSS**.

### Yêu Cầu

* **Node.js** (18+)
* **MongoDB Instance** (Local)

---

## 🚀 Các Bước Khởi Động Dự Án

Ứng dụng yêu cầu chạy đồng thời Backend và Frontend.

### 1. Thiết Lập Backend (API & Database)

#### Bước 1: Cài đặt Dependencies

Mở Terminal và điều hướng đến thư mục `backend/`:

```bash
cd backend
npm install
Bước 2: Cấu hình Biến Môi Trường (.env)
Tạo một tệp có tên .env trong thư mục backend/ và dán nội dung sau. Hãy thay thế các giá trị placeholder:

Đoạn mã

# backend/.env

# Chuỗi kết nối MongoDB (BẮT BUỘC)
MONGODB_CONNECTIONSTRING="mongodb://<user>:<password>@<host>:<port>/<db_name>"

# Khóa bí mật JWT (BẮT BUỘC - Thay bằng chuỗi ngẫu nhiên dài)
JWT_SECRET="your-strong-secret-key-for-jwt"

# Mã PIN mặc định cho lần đầu khởi động DB (Giá trị mặc định là 123456)
DEFAULT_PIN="123456" 
Bước 3: Khởi chạy Server
Trong thư mục backend/, chạy:

Bash

npm run dev
# Server sẽ chạy tại: http://localhost:8000
2. Thiết Lập Frontend (React App)
Bước 1: Cài đặt Dependencies (bao gồm Tailwind)
Mở Terminal mới và điều hướng đến thư mục frontend/:

Bash

cd frontend
npm install
Bước 2: Khởi chạy Client
Trong thư mục frontend/, chạy:

Bash

npm run dev
# Ứng dụng sẽ chạy tại: http://localhost:5173
🔒 Hướng Dẫn Đăng Nhập
Truy cập URL: http://localhost:5173.

Sử dụng PIN mặc định để đăng nhập lần đầu: 123456.

Khuyến cáo: Sau khi đăng nhập, hãy vào mục Đổi PIN để thiết lập mã PIN mới vì lý do bảo mật.
