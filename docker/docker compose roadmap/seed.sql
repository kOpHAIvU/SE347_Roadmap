-- Chỉ insert nếu bảng role đã tồn tại
INSERT INTO role(name) VALUES('admin') ON DUPLICATE KEY UPDATE name = 'admin';
INSERT INTO role(name) VALUES('user') ON DUPLICATE KEY UPDATE name = 'user';
