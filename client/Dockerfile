# Chọn base image cho Node.js
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /webroadmap/frontend

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build SCSS thành CSS
RUN npm run build

# Expose cổng để frontend chạy (nếu cần dùng server)
EXPOSE 3000

# Chạy frontend (thay bằng server nếu dùng server để preview)
CMD ["npm", "run", "start"]
