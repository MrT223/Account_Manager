# ----- Giai đoạn 1: Build ứng dụng React -----
FROM node:18-alpine AS build

WORKDIR /app/frontend

# Copy file package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt tất cả dependencies
RUN npm install

# Copy toàn bộ source code của frontend
COPY . .

# Build ứng dụng (dựa trên package.json)
RUN npm run build

# ----- Giai đoạn 2: Phục vụ bằng Nginx -----
FROM nginx:alpine

# Copy các file tĩnh đã build từ giai đoạn 'build' vào thư mục Nginx
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy file cấu hình Nginx tùy chỉnh (sẽ tạo ở bước 4)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose cổng 80 của Nginx
EXPOSE 80