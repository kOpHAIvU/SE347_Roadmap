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
    const existingUser = users.find(user => user.email === email);
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

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password!' });
    }

    res.status(200).json({ message: 'Login successful!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
