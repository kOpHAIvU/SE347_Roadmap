import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import SettingAccountItem from '~/components/Layout/components/SettingItem';

const cx = classNames.bind(styles);

// Dữ liệu tài khoản
const ACCOUNT_ITEMS = [
    {
        label: 'Profile Photo',
        value: 'https://i.pinimg.com/736x/e6/9d/09/e69d09cbbc827e4e117ce570f633120c.jpg',
    },
    {
        label: 'Username',
        value: 'dodoo0309',
        edit: true,
    },
    {
        label: 'Full name',
        value: 'Baby Shark Do Doo',
        edit: true,
    },
    {
        label: 'Email',
        value: 'babydoo@lovely.sizuka',
        edit: true,
    },
    {
        label: 'Gender',
        value: 'Male',
        options: ['Male', 'Female', 'Others'],
        edit: false,
    },
    {
        label: 'Connected social accounts',
        value: {
            platform: 'Google',
            username: 'Hải Đăng Đỗ babyboy',
            logo: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000',
        },
        edit: false,
    },
];

const Account = () => {
    //const [accountData, setAccountData] = useState(ACCOUNT_ITEMS); // Lưu trữ dữ liệu tài khoản

    const [accountData, setAccountData] = useState([]);
    const getAvatarUrl = (avatar) => {
        const defaultAvatar = 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg';

        if (!avatar || avatar.trim() === '') {
            return defaultAvatar;
        }

        const trimmedAvatar = avatar.split(' ')[0];
        return trimmedAvatar;
    };

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

            // Chuyển đổi dữ liệu trả về thành định dạng của `ACCOUNT_ITEMS`
            const mappedData = [
                {
                    label: 'Profile Photo',
                    value: getAvatarUrl(data.data.avatar),
                },
                {
                    label: 'Username',
                    value: data.data.username || 'N/A',
                    edit: true,
                },
                {
                    label: 'Full name',
                    value: data.data.fullName || 'N/A',
                    edit: true,
                },
                {
                    label: 'Email',
                    value: data.data.email || 'N/A',
                    edit: true,
                },
                {
                    label: 'Gender',
                    value: data.data.gender || 'N/A',
                    options: ['Male', 'Female', 'Others'],
                    edit: false,
                },
                {
                    label: 'Connected social accounts',
                    value: {
                        platform: 'Google',
                        username: data.data.socialUsername || 'N/A',
                        logo: 'https://img.icons8.com/?size=100&id=17949&format=png&color=000000',
                    },
                    edit: false,
                },
            ];

            setAccountData(mappedData);
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (updatedData, isFormData = false) => {
        try {
            const headers = {
                Authorization: `Bearer ${getToken()}`,
            };
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch('http://localhost:3004/user/updateProfile', {
                method: 'PATCH',
                headers,
                body: isFormData ? updatedData : JSON.stringify(updatedData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Profile updated successfully:', result);
                // Cập nhật lại state với dữ liệu mới (dựa trên phản hồi từ API)
                if (updatedData instanceof FormData) {
                    const newAvatarUrl = result.data.avatar; // Thay thế với key trả về từ API
                    setAccountData((prevData) =>
                        prevData.map((item) =>
                            item.label === 'Profile Photo' ? { ...item, value: newAvatarUrl } : item,
                        ),
                    );
                }
                window.location.reload();
                // await fetchProfile();
            } else {
                console.error('Error:', result.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Update Profile Error:', error);
        }
    };

    const handleUpdateValue = (index, newValue) => {
        const updatedAccountData = [...accountData];
        updatedAccountData[index].value = newValue; // Cập nhật dữ liệu hiển thị
        setAccountData(updatedAccountData);

        // Chuẩn bị dữ liệu cập nhật (đồng bộ với API)
        const fieldMap = {
            Username: 'username',
            'Full name': 'fullName',
            Email: 'email',
            Gender: 'gender',
            'Profile Photo': 'file',
        };

        const label = updatedAccountData[index].label;
        const updatedField = fieldMap[label]; // Lấy trường phù hợp với API

        if (updatedField) {
            const updatedData = {};

            if (label === 'Profile Photo' && newValue instanceof File) {
                // Nếu là file ảnh, sử dụng FormData
                const formData = new FormData();
                formData.append('file', newValue);

                updateProfile(formData, true); // Gọi API với FormData
            } else {
                updatedData[updatedField] = newValue;
                updateProfile(updatedData); // Gọi API với JSON
            }
        } else {
            console.warn(`Field "${label}" is not mapped to any API key.`);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h1>Your account</h1>
            {accountData.map((item, index) => (
                <SettingAccountItem
                    key={index}
                    item={item}
                    onUpdateValue={(newValue) => handleUpdateValue(index, newValue)} // Truyền callback
                    allowFileUpload={item.label === 'Profile Photo'}
                />
            ))}
        </div>
    );
};

export default Account;
