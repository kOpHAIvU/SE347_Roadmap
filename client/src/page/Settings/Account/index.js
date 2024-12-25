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
        console.log(trimmedAvatar);
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
            console.log(data.data.gender);

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

    const handleUpdateValue = (index, newValue) => {
        const updatedAccountData = [...accountData];
        updatedAccountData[index].value = newValue; // Cập nhật giá trị mới
        setAccountData(updatedAccountData); // Cập nhật trạng thái
    };

    return (
        <div className={cx('wrapper')}>
            <h1>Your account</h1>
            {accountData.map((item, index) => (
                <SettingAccountItem
                    key={index}
                    item={item}
                    onUpdateValue={(newValue) => handleUpdateValue(index, newValue)} // Truyền callback
                />
            ))}
        </div>
    );
};

export default Account;
