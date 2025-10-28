# Sử dụng base image Node.js 18 (như trong README của bạn)
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app/backend

# Copy file package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies cho production
RUN npm install --production

# Copy toàn bộ source code của backend
COPY . .

# Backend chạy trên cổng 8000
EXPOSE 8000

# Lệnh để chạy ứng dụng (dựa trên package.json)
CMD [ "npm", "start" ]