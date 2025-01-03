import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import NotificationModal from '~/components/Layout/components/NotificationModal';
import CryptoJS from 'crypto-js';

import {
    faCircleQuestion,
    faFlag,
    faGear,
    faLock,
    faPlus,
    faRightFromBracket,
    faUser,
    faTimes,
    faBell,
} from '@fortawesome/free-solid-svg-icons';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import MenuAvatar from '../MenuAvatar/index.js';
import { SearchRoadmap } from '../Search/index.js';
import CantCloneDialogTooMany from '../MiniNotification/CantCloneTooMany/index.js';

const cx = classNames.bind(styles);

function HeaderLogged({ collapsed, setCollapsed }) {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const bellRef = useRef(null);
    const [image, setImage] = useState(null);

    const toggleNotification = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('vertexToken'); // Xóa token khỏi localStorage
        console.log('Token removed');
        navigate('/'); // Điều hướng đến trang chủ
    };

    useEffect(() => {
        if (location.pathname === '/') {
            localStorage.removeItem('vertexToken');
            console.log('Token removed');
        }
    }, [location]);

    const MENU_ITEMS = (encryptedId) => [
        {
            icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faGear} />,
            title: 'Settings',
            children: {
                title: 'Settings',
                data: [
                    {
                        icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faUser} />,
                        title: 'Your account',
                        to: '/account/${encryptedId}',
                    },
                    // {
                    //     icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faLock} />,
                    //     title: 'Login & security',
                    //     to: '/security',
                    // },
                    // {
                    //     icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faFlag} />,
                    //     title: 'Report a problem',
                    //     to: '/report',
                    // },
                ],
            },
        },
        {
            icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faCircleQuestion} />,
            title: 'More about Vertex',
            to: '/information',
        },
        {
            icon: <FontAwesomeIcon className={cx('setting-icon', 'logout-icon')} icon={faRightFromBracket} />,
            title: 'Log out',
            onClick: handleLogout,
        },
    ];

    const handleClickOutside = (event) => {
        // Kiểm tra xem click có nằm ngoài bellRef và notificationRef không
        if (
            isNotificationOpen && // Kiểm tra nếu modal đang mở
            bellRef.current &&
            notificationRef.current &&
            !bellRef.current.contains(event.target) &&
            !notificationRef.current.contains(event.target)
        ) {
            setIsNotificationOpen(false); // Đóng modal
        }
    };

    const [avatar, setAvatar] = useState('');
    const [userId, setUserId] = useState(null);
    const secretKey = 'kophaivu'; // Khóa bí mật

    const [role, setRole] = useState('user');
    const [proEdit, setProEdit] = useState(false);
    const [roadmapRecords, setRoadmapRecords] = useState(0);

    const getToken = () => {
        return localStorage.getItem('vertexToken');
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile.');
                return;
            }

            const data = await response.json();
            if (data?.data?.avatar) {
                const cleanAvatar = data.data.avatar.split(' ')[0];
                setAvatar(cleanAvatar);
            }

            if (data?.data?.id) {
                setRole(data.data.role.name);
                setUserId(data?.data?.id);
                return data.data.id;
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchOwnRoadmapData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/roadmap/owner?page=1&limit=12`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRoadmapRecords(data.data.totalRecord);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch roadmap data.');
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchPaymentStatus = async (profileId) => {
        try {
            const response = await fetch(`http://localhost:3004/payment/user/${profileId}?page=1&limit=1`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (response.ok) {
                //console.log("Payment status: ", data);
                if (data && data.data && data.data.length > 0) setProEdit(true);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Hàm mã hóa
    const encryptId = (id) => {
        let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
        // Thay thế ký tự đặc biệt
        return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    useEffect(() => {
        const fetchData = async () => {
            const id = await fetchProfile();
            await fetchOwnRoadmapData();
            if (id) await fetchPaymentStatus(id);
        };
        fetchData();
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationOpen]);

    const handleCreate = async () => {
        if (name && description && image && userId) {
            const formData = new FormData();
            formData.append('title', name);
            formData.append('file', image);
            formData.append('content', description);
            formData.append('owner', userId);
            formData.append('clone', 0);
            formData.append('react', 0);
            formData.append('type', 'IT');

            try {
                const response = await fetch('http://localhost:3004/roadmap/new_roadmap', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`, // Thêm token xác thực
                    },
                    body: formData, // Gửi dữ liệu dưới dạng form
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Roadmap created:', data);

                    // Điều hướng đến roadmap vừa tạo dựa trên id
                    if (data?.data?.id) {
                        const encryptedId = encryptId(data.data.id);
                        navigate(`/roadmap/${encryptedId}`);
                    }

                    setShowForm(false);
                    setName('');
                    setDescription('');
                    setImage(null);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to create roadmap:', errorData.message);
                }
            } catch (error) {
                console.error('Error creating roadmap:', error);
            }
        } else {
            console.error('Please fill in all required fields.');
        }
    };

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowForm(false);
        }
    };

    const handleShowForm = () => {
        if ((proEdit && roadmapRecords < 15) || (!proEdit && roadmapRecords < 3) || role === 'admin') {
            setShowForm(true)
        } else {
            handleMakeDialog()
        }
    }

    const [dialogs, setDialogs] = useState([]);

    const handleMakeDialog = () => {
        const newDialog = { id: Date.now() };
        setDialogs((prevDialogs) => [...prevDialogs, newDialog]);

        // Automatically remove the CantClone after 3 seconds
        setTimeout(() => {
            setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
        }, 3000);

        return;
    };

    const handleClose = (id) => {
        setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== id));
    };

    return (
        <div className={cx('wrapper', { extend: collapsed })}>
            <div className={cx('inner')}>
                <Button
                    onClick={() => setCollapsed(!collapsed)}
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    className={cx('navigation-btn')}
                ></Button>

                <SearchRoadmap />

                <div className={cx('right-header')}>
                    <button className={cx('add-roadmap')} onClick={() => handleShowForm()}>
                        <FontAwesomeIcon className={cx('plus-icon')} icon={faPlus} />
                        <h1 className={cx('create-text')}>Create your own map</h1>
                    </button>
                    <FontAwesomeIcon
                        ref={bellRef}
                        className={cx('bell-icon', { active: isNotificationOpen })}
                        onClick={toggleNotification}
                        icon={faBell}
                    />

                    {isNotificationOpen && (
                        <div ref={notificationRef}>
                            <NotificationModal onClose={() => setIsNotificationOpen(false)} />
                        </div>
                    )}

                    <MenuAvatar items={MENU_ITEMS(userId ? encryptId(userId) : '')}>
                        <img
                            className={cx('avatar')}
                            src={
                                avatar || 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg'
                            }
                            alt="Avatar"
                        />
                    </MenuAvatar>
                </div>
            </div>

            {showForm && (
                <div className={cx('modal-overlay')} onClick={handleOutsideClick}>
                    <div className={cx('modal')}>
                        <button className={cx('close-btn')} onClick={() => setShowForm(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className={cx('form-name')}>Create New Roadmap</h2>

                        <div className={cx('form-group')}>
                            <label>Roadmap Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Attach Image</label>
                            <input
                                type="file"
                                accept=".jpg,.JPG"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (
                                        file &&
                                        (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg'))
                                    ) {
                                        setImage(file); // setImage là state chứa file ảnh
                                    } else {
                                        alert('Please select a JPG image.');
                                        e.target.value = ''; // Reset input nếu không phải ảnh JPG
                                    }
                                }}
                            />
                        </div>

                        <div className={cx('button-group')}>
                            <button className={cx('cancel-btn')} onClick={() => setShowForm(false)}>
                                Cancel
                            </button>

                            <button
                                className={cx('create-btn')}
                                onClick={handleCreate}
                                disabled={!name || !description || !image}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={cx('mini-notify')}>
                {dialogs.map((dialog) => (
                    <CantCloneDialogTooMany
                        key={dialog.id}
                        handleClose={handleClose}
                        type='roadmaps'
                        count={roadmapRecords}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeaderLogged;
