# 🔑 Account Manager  
### _Ứng Dụng Quản Lý Tài Khoản & Mật Khẩu (MERN Stack)_

---

## 🧩 Giới Thiệu

**Account Manager** là ứng dụng giúp bạn **lưu trữ, quản lý và bảo vệ mật khẩu/tài khoản cá nhân** một cách an toàn.  
Dự án được phát triển với **MERN Stack (MongoDB, Express.js, React, Node.js)** và giao diện hiện đại **Dark Mode** sử dụng **Tailwind CSS**.

---

## ⚙️ Yêu Cầu Hệ Thống

| Thành phần | Yêu cầu tối thiểu |
|-------------|------------------|
| **Node.js** | 18+ |
| **MongoDB** | Local hoặc Cloud Instance |

---

## 🚀 Hướng Dẫn Khởi Động Dự Án

Ứng dụng bao gồm **2 phần**: `backend/` (API & Database) và `frontend/` (React UI).  
Hãy đảm bảo bạn chạy **song song** cả hai phần này.

---

### 🖥️ 1. Thiết Lập Backend (API & Database)

#### 📍 Bước 1: Cài đặt Dependencies

```bash
cd backend
npm install
⚙️ Bước 2: Cấu hình biến môi trường
Tạo file .env trong thư mục backend/ và thêm nội dung sau (thay giá trị placeholder cho phù hợp):

bash
Sao chép mã
# backend/.env

# 🔗 Chuỗi kết nối MongoDB (BẮT BUỘC)
MONGODB_CONNECTIONSTRING="mongodb://<user>:<password>@<host>:<port>/<db_name>"

# 🔒 Khóa bí mật JWT (BẮT BUỘC - thay bằng chuỗi ngẫu nhiên mạnh)
JWT_SECRET="your-strong-secret-key-for-jwt"

# 🔢 Mã PIN mặc định khi khởi tạo DB
DEFAULT_PIN="123456"
▶️ Bước 3: Khởi chạy Server
bash
Sao chép mã
npm run dev
🌐 Server chạy tại: http://localhost:8000

💻 2. Thiết Lập Frontend (React App)
📍 Bước 1: Cài đặt Dependencies
bash
Sao chép mã
cd frontend
npm install
Bao gồm cả Tailwind CSS và các thư viện hỗ trợ giao diện hiện đại.

▶️ Bước 2: Khởi chạy Client
bash
Sao chép mã
npm run dev
🌐 Ứng dụng chạy tại: http://localhost:5173

🔐 Hướng Dẫn Đăng Nhập
Mở trình duyệt và truy cập:
👉 http://localhost:5173

Nhập PIN mặc định:

Sao chép mã
123456
Sau khi đăng nhập thành công, truy cập mục “Đổi PIN” để cập nhật mã bảo mật mới nhằm đảm bảo an toàn dữ liệu.

🧱 Cấu Trúc Dự Án (Tóm Lược)
lua
Sao chép mã
Account-Manager/
│
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── package.json
│   └── ...
│
└── README.md
📜 Giấy Phép
Dự án được phát hành dưới giấy phép MIT License – bạn có thể tự do sử dụng, chỉnh sửa và phân phối.

💬 Liên Hệ & Đóng Góp
Nếu bạn muốn đóng góp hoặc báo lỗi, hãy mở Issue hoặc gửi Pull Request trên GitHub Repository của dự án.
Mọi ý kiến đóng góp đều được hoan nghênh! 🙌

css
Sao chép mã
