INSERT INTO role(name) VALUES('admin') ON DUPLICATE KEY UPDATE name = 'admin';
INSERT INTO role(name) VALUES('user') ON DUPLICATE KEY UPDATE name = 'user';

INSERT INTO user(username, password, fullName, gender, email, roleId,`deviceToken`, avatar) VALUES
('LoanTuyetCute', '$2a$10$D6H4Ek58Yh3EgSmoEg16gei3kWy9cCsjipjiaYk3H8.YB08sXnN2q', 'Nguyen Thi Tuyet Loan', 'Male', 'nguyenloan2000hbg@gmail.com', 1,  
'c2tjyDAUPf_5lzh-1us1nC:APA91bE04zbsCKRE-XYDJIMbooBUH_vXPeYMuiLdy_euthFEo47Y2dL2UT8EGuhm0Y-nnkg9hhqn36PUg6B0mlheh-_vNJSm3Qn1-P2PEJzQgYHylZsones',
'https://res.cloudinary.com/daxxuqogj/image/upload/v1733369500/uploads/ycyrhsp8dzrcrwjc3bl1.png'
),
('ThienKhongCute', '$2a$10$D6H4Ek58Yh3EgSmoEg16gei3kWy9cCsjipjiaYk3H8.YB08sXnN2q', 'Le Gia Hoang Thien', 'Female', '22520783@gm.uit.edu.vn', 2, 
'eWaeyfIATDAz_i8fjZPKQ4:APA91bGybAZlAt0vlDxWiQ01CWXeZZgHmNMVCS82ehSvQzVS9A8X3WmjUJjkjLw6feDRZNllAtISUT0NpN3HZBPjv7sTA6knPP-KP8fOJiQVK__wTu2RaGc',
'https://res.cloudinary.com/daxxuqogj/image/upload/v1735624446/uploads/fgzwhwkk3ysnreqdiwo9.jpg'
),
('VuKhongCute', '$2a$10$D6H4Ek58Yh3EgSmoEg16gei3kWy9cCsjipjiaYk3H8.YB08sXnN2q', 'Le Hoang Vu', 'Male', '', 1, 
'eWaeyfIATDAz_i8fjZPKQ4:APA91bGybAZlAt0vlDxWiQ01CWXeZZgHmNMVCS82ehSvQzVS9A8X3WmjUJjkjLw6feDRZNllAtISUT0NpN3HZBPjv7sTA6knPP-KP8fOJiQVK__wTu2RaGc',
'https://res.cloudinary.com/daxxuqogj/image/upload/v1735624446/uploads/fgzwhwkk3ysnreqdiwo9.jpg'
),
('VinhKhongCute', '$2a$10$D6H4Ek58Yh3EgSmoEg16gei3kWy9cCsjipjiaYk3H8.YB08sXnN2q', 'Pham Thi Thanh Vinh', 'Female', '22521387@gm.uit.edu.vn', 2, 
'eWaeyfIATDAz_i8fjZPKQ4:APA91bGybAZlAt0vlDxWiQ01CWXeZZgHmNMVCS82ehSvQzVS9A8X3WmjUJjkjLw6feDRZNllAtISUT0NpN3HZBPjv7sTA6knPP-KP8fOJiQVK__wTu2RaGc',
'https://res.cloudinary.com/daxxuqogj/image/upload/v1734058263/uploads/ys59narvmu1mbajnxfqn.png' 
);

INSERT INTO team(name, avatar, leaderId) VALUES
('Burn out with SE347', 'https://res.cloudinary.com/daxxuqogj/image/upload/v1734065635/uploads/uidpow3r6vbxkpao4gew.jpg', 1),
('10d SE347', 'https://res.cloudinary.com/daxxuqogj/image/upload/v1734065635/uploads/uidpow3r6vbxkpao4gew.jpg', 1),
('I love SE347', 'https://res.cloudinary.com/daxxuqogj/image/upload/v1734065635/uploads/uidpow3r6vbxkpao4gew.jpg', 1),
('Team with SE347', 'https://res.cloudinary.com/daxxuqogj/image/upload/v1734065635/uploads/uidpow3r6vbxkpao4gew.jpg', 1);

INSERT INTO roadmap (code, title, avatar, content, ownerId, 
clone, react, isPublic) 
VALUES
('RMIT1', 'Roadmap for Frontend', 
'https://m.yodycdn.com/blog/meme-ech-xanh-yody-vn-1.jpg',
'This roadmap is used for those who are new to the coding field with a Frontend position.', 1, 0, 0, 1 ),
('RMIT2', 'Roadmap for Backend',
'https://s3.thoainguyentek.com/2021/11/zalopay-logo.png',
'The backend is the back end of an application or website, where logic is processed, data is stored, and communication between components is managed. A good backend ensures that the application is efficient, stable, and secure.',
2, 0, 0, 1),
('RMIT3', 'Roadmap for DevOps',
'https://i.pinimg.com/236x/f0/dd/05/f0dd055939653e9751595074fd8720b0.jpg',
'DevOps is a hot field in the market.',
3, 0, 0, 0),
('RMIT4', 'Roadmap for DevOps',
'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474082ppU/avatar-facebook-bua-chat-cute_044338468.jpg',
'DevOps is a hot field in the market.',
4, 0, 0, 0),
('RMIT2', 'Roadmap for Project Manager', 
'https://cdn.aicschool.edu.vn/wp-content/uploads/2024/06/avatar-dep-hai-1.jpg',
'This roadmap is used for those who are new to the coding field with a Frontend position.', 1, 0, 0, 1 )

