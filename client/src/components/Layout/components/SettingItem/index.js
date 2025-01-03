import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SettingItem.module.scss';
import defaultavatar from '~/assets/images/defaultavatar.jpg';

const cx = classNames.bind(styles);

const SettingItem = ({ item, onUpdateValue, onButtonClick, isAdmin }) => {
    console.log('ammminn', isAdmin);
    const defaultPhotoUrl = 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg';

    const [photo, setPhoto] = useState(item.value);

    useEffect(() => {
        if (item.label === 'Profile Photo') {
            setPhoto(item.value || defaultPhotoUrl);
        }
    }, [item.value]);

    const handleRemovePhoto = async () => {
        try {
            const response = await fetch(defaultavatar);
            if (!response.ok) {
                throw new Error('Failed to fetch default avatar.');
            }

            const blob = await response.blob();

            const defaultFile = new File([blob], 'default-avatar.jpg', { type: blob.type });

            setPhoto(defaultPhotoUrl);
            console.log('Photo reset to default, file:', defaultFile);

            if (onUpdateValue) {
                onUpdateValue(defaultFile);
            }
        } catch (error) {
            console.error('Error resetting photo to default:', error);
        }
    };

    const handleChangePhoto = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0]; // Giữ file gốc
            setPhoto(URL.createObjectURL(file)); // Hiển thị ảnh tạm thời

            // Gửi file gốc qua callback
            if (onUpdateValue) {
                onUpdateValue(file);
            }

            console.log('Photo changed, file:', file);
        }
    };

    // Thêm trạng thái để quản lý chế độ chỉnh sửa
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(item.value); // Giá trị hiện tại

    const handleEdit = () => {
        setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    };

    const handleSave = () => {
        setIsEditing(false); // Lưu giá trị và quay lại chế độ xem
        if (onUpdateValue) {
            onUpdateValue(value); // cập nhật giá trị
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setValue(item.value);
    };

    const handleDisconnect = () => {
        console.log('Disconnected from', item.value.platform);
    };

    const [selectedValue, setSelectedValue] = useState(() => localStorage.getItem('gender') || item.value); // Lấy giá trị từ localStorage hoặc item.value

    // Hàm xử lý khi thay đổi giá trị
    const handleOptionChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        // localStorage.setItem('gender', newValue);
        console.log(`Selected gender: ${newValue}`);
        if (onUpdateValue) {
            onUpdateValue(newValue); // Gọi callback để đồng bộ hóa với dữ liệu cha
        }
    };

    return (
        <div className={cx('field')}>
            <label className={cx('label')}>{item.label}</label>
            <span className={cx('item-value-header')}>{item.value.content_header}</span>

            {item.label === 'Profile Photo' ? (
                <div className={cx('profile-photo')}>
                    <img src={photo} alt="Profile" className={cx('profile-img')} />
                    {isAdmin && (
                        <div className={cx('photo-actions')}>
                            <button onClick={handleRemovePhoto} className={cx('remove-btn')}>
                                Remove Photo
                            </button>

                            <label className={cx('change-btn')}>
                                Change Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangePhoto}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    )}
                </div>
            ) : item.label === 'Connected social accounts' ? (
                <div className={cx('social-account')}>
                    <img src={item.value.logo} alt={item.value.platform} className={cx('social-logo')} />

                    <div className={cx('social-info')}>
                        <span className={cx('social-name')}>{item.value.platform}</span>
                        <span className={cx('social-username')}>{item.value.username}</span>
                    </div>
                    {isAdmin && (
                        <button onClick={handleDisconnect} className={cx('disconnect-btn')}>
                            Disconnect
                        </button>
                    )}
                </div>
            ) : item.label === 'Login' ? (
                <div className={cx('item-details')}>
                    <img src={item.value.logo} alt={item.value.label} className={cx('item-logo')} />
                    <div>
                        <b>{item.value.label}</b>
                        <br />
                        <span className={cx('item-value')}>{item.value.content}</span>
                    </div>
                </div>
            ) : item.options ? (
                <div className={cx('options-group')}>
                    {item.options.map((option, index) => (
                        <label key={index}>
                            <input
                                type="radio"
                                name={item.label.toLowerCase()}
                                value={option}
                                checked={selectedValue === option}
                                onChange={handleOptionChange}
                                disabled={!isAdmin}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            ) : item.sercurity ? (
                <div className={cx('input-group-custom')}>
                    <span className={cx('value')}>{item.value}</span>
                    {isAdmin && (
                        <button className={cx('edit-btn')} onClick={() => onButtonClick(item)}>
                            {item.button}
                        </button>
                    )}
                </div>
            ) : (
                <div className={cx('input-group')}>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className={cx('input-value')}
                            />
                            <button onClick={handleCancel} className={cx('cancel-btn')}>
                                Cancel
                            </button>
                            <button onClick={handleSave} className={cx('save-btn')}>
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <span className={cx('value')}>{item.value}</span>
                            {isAdmin && item.edit && (
                                <button onClick={handleEdit} className={cx('edit-btn')}>
                                    Edit
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SettingItem;
