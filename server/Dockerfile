# Chọn base image cho Node.js
FROM node:18

# Cập nhật hệ thống và cài đặt các phần mềm phụ thuộc
RUN apt-get update && apt-get install -y \
  libcairo2 libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential python3

# Thiết lập thư mục làm việc
WORKDIR /webroadmap/backend

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies của ứng dụng
RUN npm install

# Copy mã nguồn còn lại
COPY . .

# Copy các tệp môi trường nếu cần
COPY .env ./

# Build ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng chạy trên
EXPOSE 3004

# Chạy ứng dụng
CMD ["sh", "-c", "npm run start"]
