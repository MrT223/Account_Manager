# 🔑 Account Manager (Quản Lý Tài Khoản & Mật Khẩu)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-brightgreen.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![Lucide React](https://img.shields.io/badge/Lucide--React-icons-blueviolet.svg)](https://lucide.dev/)
[![JWT](https://img.shields.io/badge/JWT-authentication-orange.svg)](https://jwt.io/)
[![Status](https://img.shields.io/badge/Status-Development-orange.svg)]()

**Account Manager** là một ứng dụng quản lý mật khẩu đơn giản, cho phép người dùng lưu trữ, thêm/sửa/xóa tài khoản với mật khẩu/thông tin đa nhãn, phân loại theo danh mục, và được bảo vệ bằng mã PIN. Giao diện được xây dựng bằng React, Vite và Tailwind CSS.

- **Frontend:** React 19 + Vite, Tailwind CSS, Lucide React. Toast notifications qua Sonner.
- **Backend:** Node.js + Express.js, MongoDB + Mongoose, JWT authentication, đăng nhập bằng PIN.
- **Database:** MongoDB lưu trữ thông tin PIN (`Verified` model) và tài khoản (`Accounts` model).

## Tính năng chính
- Đăng nhập bằng mã PIN (mặc định: `123456`) và đổi PIN.
- Quản lý danh sách tài khoản: thêm, sửa, xóa.
- Lưu trữ và hiển thị nhiều thông tin (mật khẩu, mã code, ...) theo nhãn (label) cho từng tài khoản.
- Phân loại tài khoản theo danh mục (Game, Ngân hàng, Mạng xã hội, Công việc, Khác).
- Tìm kiếm tài khoản theo Tên, Username hoặc Danh mục.
- Hiển thị/ẩn và sao chép thông tin chi tiết vào clipboard.
- Toast notifications (Sonner) cho phản hồi người dùng.
- Giao diện đáp ứng (Responsive UI) với Tailwind CSS.

> **Lưu ý Quan trọng về Bảo mật:** Dự án này phù hợp cho mục đích học tập hoặc sử dụng cá nhân với dữ liệu không quá nhạy cảm. **Mật khẩu được lưu trữ dưới dạng văn bản thuần túy trong cơ sở dữ liệu.** KHÔNG sử dụng cho môi trường production nếu không bổ sung các biện pháp mã hóa mạnh mẽ hơn (ví dụ: bcrypt cho PIN, mã hóa đối xứng cho mật khẩu).

---

## Yêu cầu
- **Node.js** v18+
- **MongoDB Instance** (Local hoặc Cloud như MongoDB Atlas) v6+
- **npm** hoặc **yarn**

## Dependencies chính
- **Frontend:** React 19.1, Vite 7.1, Tailwind CSS 3.4, Axios, Lucide React, Sonner.
- **Backend:** Express 5.1, Mongoose 8.19, JSONWebToken 9.0, dotenv, CORS.

---

## Cài đặt

### Clone repository (Nếu bạn chưa có)
```
git clone https://github.com/MrT223/Account_Manager.git
cd <TEN_THU_MUC_DU_AN>
```

### Thiết lập biến môi trường (.env) cho Backend

Tạo file **`.env`** trong thư mục **`backend/`** dựa trên nội dung file **`.env.example`**.
Tạo file **`.env`** trong thư mục gốc dựa trên nội dung file **`.env.example`** ở thư mục gốc.

**thay thế các giá trị placeholder bằng thông tin thực tế của bạn**:

**Khóa bí mật JWT (BẮT BUỘC - Thay bằng một chuỗi ngẫu nhiên, dài và bảo mật)**
```
JWT_SECRET="your-super-strong-and-random-secret-key-for-jwt"
```
**Mã PIN mặc định cho lần đầu khởi động DB (Có thể giữ nguyên hoặc thay đổi)**
```
DEFAULT_PIN="123456"
```
**Cổng cho server backend (Tùy chọn, mặc định là 8000 nếu không có)**
```
PORT=8000
```

### Cài đặt dependencies
**Chạy lệnh docker khởi tạo**
```
docker-compose up -d --build
```
**Dừng server:**
```
docker-compose down
```

> **Quan trọng:** Không commit file `.env` vào Git. Đảm bảo file `.gitignore` trong thư mục `backend/` có dòng `.env`.

Ứng dụng sẽ chạy trên: `http://localhost:5173`.
PIN mặc định để đăng nhập lần đầu là: **`123456`**.
---

## API Endpoints (Tham khảo)

**Prefix:** `/api`
**Authentication:** Yêu cầu `Bearer <JWT_TOKEN>` trong header `Authorization` cho các endpoint được bảo vệ.

### Authentication (`/verified`)
| Method | Endpoint      | Description        | Body/Params         | Auth Required |
|--------|---------------|--------------------|---------------------|---------------|
| POST   | `/login`      | Đăng nhập bằng PIN | `{ PIN: string }`   | No            |
| PUT    | `/changePin`  | Đổi mã PIN         | `{ oldPin, newPin }`| Yes           |
| GET    | `/checkToken` | Kiểm tra token     | -                   | Yes           |

**Response login thành công:**
{ "token": "<JWT_TOKEN>" }

### Accounts (`/account`)
| Method | Endpoint | Description              | Body/Params                                      | Auth Required |
|--------|----------|--------------------------|--------------------------------------------------|---------------|
| GET    | `/`      | Lấy tất cả tài khoản     | -                                                | Yes           |
| POST   | `/`      | Tạo tài khoản mới        | `{ name, username, category, password: [...] }` | Yes           |
| PUT    | `/:id`   | Cập nhật tài khoản       | `{ name, username, category, password: [...] }` | Yes           |
| DELETE | `/:id`   | Xóa tài khoản            | `id` (path param)                                | Yes           |

**Xử lý lỗi:** API trả về `{ message: string }` cùng với status code HTTP phù hợp (ví dụ: 400, 401, 404, 500).

---

## Cấu trúc Dự án (Sơ lược)
```
<TEN_THU_MUC_GOC>/
├── backend/
│   ├── src/
│   │   ├── config/       # Cấu hình DB (db.js)
│   │   ├── controllers/  # Logic xử lý (accountControllers.js, verifiedControllers.js)
│   │   ├── models/       # Schemas (Accounts.js, Verified.js)
│   │   ├── routes/       # API Endpoints (accountRouters.js, verifiedRouters.js)
│   │   └── server.js     # Khởi tạo Express, middlewares
│   ├── .dockerignore     # Bỏ qua file khi build Docker
│   ├── .env.example      # File .env mẫu cho backend
│   ├── .gitignore
│   ├── Dockerfile        # Cấu hình Docker cho backend (Node.js)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Components chính (LoginPage.jsx, Dashboard.jsx)
│   │   ├── App.jsx       # Logic Auth & component chính
│   │   ├── index.css     # CSS gốc & Tailwind directives
│   │   └── main.jsx      # Điểm vào React app
│   ├── public/           # Tài nguyên tĩnh (favicon, ...)
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile        # Cấu hình Docker (build React + Nginx)
│   ├── index.html
│   ├── nginx.conf        # Cấu hình Nginx reverse proxy cho API
│   ├── package.json
│   ├── postcss.config.js # Cấu hình PostCSS
│   └── tailwind.config.js# Cấu hình Tailwind
├── .env.example          # Biến môi trường mẫu cho Docker Compose
├── .gitignore
├── docker-compose.yml    # Định nghĩa services (backend, frontend)
└── README.md             # File này
```
---

## Troubleshooting
- **Lỗi CORS:** Đảm bảo Backend (`server.js`) đã cấu hình CORS đúng với địa chỉ Frontend (`http://localhost:5173`).
- **Không kết nối được DB:** Kiểm tra MongoDB có đang chạy không và chuỗi `MONGODB_CONNECTIONSTRING` trong `.env` đã chính xác chưa.
- **Sai PIN khi đăng nhập:** Kiểm tra lại PIN bạn nhập. Nếu là lần đầu, đảm bảo giá trị `DEFAULT_PIN` trong `.env` là đúng (hoặc dùng `123456` nếu `.env` không có).
- **Token không hợp lệ / Hết hạn:** Đăng nhập lại để nhận token mới. Kiểm tra `JWT_SECRET` trong `backend/.env` có khớp khi server khởi động và khi xác thực không.

---

## Giấy phép

Dự án này được cấp phép theo **MIT License**.
