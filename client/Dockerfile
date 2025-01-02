# Chọn base image phù hợp với Node.js
FROM node:18 AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /webroadmap/frontend

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng (bao gồm build SCSS nếu cần)
RUN npm run build

# Stage 2: Runtime Stage
FROM nginx:alpine

# Copy build output từ stage trước vào thư mục phục vụ của Nginx
COPY --from=builder /webroadmap/frontend/build /usr/share/nginx/html

# Expose cổng Nginx mặc định
EXPOSE 80

# Chạy Nginx server
CMD ["nginx", "-g", "daemon off;"]
