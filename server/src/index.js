const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Cho phép mọi nguồn gọi API
app.use(bodyParser.json()); // Parse JSON từ body request

// Giả lập database trong bộ nhớ
let users = [];

// API Signup
app.post('/api/signup', (req, res) => {
  const { email, username, password } = req.body;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered!' });
  }

  // Thêm user mới vào database
  users.push({ email, username, password });
  res.status(201).json({ message: 'Signup successful!' });
});

// API Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (user) => user.email === email && user.password === password,
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password!' });
  }

  res.status(200).json({ message: 'Login successful!' });
});

// API Forgot Password
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  // Kiểm tra xem email có tồn tại trong danh sách người dùng không
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Email not found!' });
  }

  // có thể gửi email chứa liên kết đặt lại mật khẩu
  // Hiện tại t chỉ trả về thông báo thành công
  res.status(200).json({ message: 'Password reset email sent!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://44.245.39.225:${PORT}`);
});
