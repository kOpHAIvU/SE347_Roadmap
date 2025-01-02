import React, { useState, useEffect } from 'react';
import styles from './NotificationModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const getToken = () => {
    const token = localStorage.getItem('vertexToken');
    if (!token) {
        console.error('No access token found. Please log in.');
        return null;
    }
    return token;
};

function NotificationModal() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 10; // Số lượng thông báo mỗi lần tải

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Access token is missing. Please log in.');
                }
                const response = await fetch(
                    `http://localhost:3004/notification/all/owner?page=${page}&limit=${limit}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );
                const responseData = await response.json();

                if (response.ok) {
                    console.log('Response data:', responseData);
                    const notificationsData = responseData.data.data; // Truy cập đúng mảng dữ liệu
                    const formattedData = notificationsData.map((item) => ({
                        id: item.id,
                        type: item.type,
                        text: item.content,
                        unread: !item.isCheck,
                        avatar: item.receiver?.avatar?.split(' ')[0], // Xử lý URL avatar chính xác
                        username: item.receiver?.username,
                        status: null,
                    }));
                    console.log('Formatted notifications: ', formattedData);
                    setNotifications((prevNotifications) => [...prevNotifications, ...formattedData]);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch notifications');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [page]);

    const handleResponse = async (notificationId, action, groupDivisionId) => {
        console.log(`Notification ID: ${notificationId}, Action: ${action}, GroupDivision ID: ${groupDivisionId}`);
        if (groupDivisionId) {
            await updateRole(groupDivisionId, 3);
        }
    };

    const loadMore = () => setPage((prevPage) => prevPage + 1);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    const extractGroupDivisionId = (type) => {
        console.log('tayyyyyy', type);
        const parts = type.split(' ');
        return parts.length > 1 ? parts[1] : null; // Lấy phần tử thứ hai sau 'Added'
    };

    const updateRole = async (groupId, newRole) => {
        // Cập nhật danh sách local trước

        try {
            const response = await fetch(`http://localhost:3004/group-division/item/${groupId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: parseInt(newRole, 10) }),
            });

            if (response.ok) {
                console.log('Role updated successfully');
            } else {
                const data = await response.json();
                console.error('Failed to update role:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating role:', error);
            alert('An error occurred while updating the role. Please try again.');
        }
    };

    return (
        <div className={cx('modal')}>
            <h2 className={cx('title')}>Notifications</h2>

            {/* Tabs */}
            <div className={cx('tabs')}>
                <button className={cx('tab', 'active')}>All</button>
            </div>

            {/* Notification Content */}
            <div className={cx('notification-content')}>
                {notifications.map((notification) => (
                    <div key={notification.id} className={cx('notification-item')}>
                        <div className={cx('title-notifi')}>
                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />

                            <p>
                                {notification.type === 'system' ? (
                                    <>
                                        <strong>{notification.username}: </strong>
                                        {notification.text}
                                    </>
                                ) : (
                                    <>
                                        <strong>{notification.username}</strong> đã mời bạn tham gia Timeline{' '}
                                        <strong>{notification.text.split('Timeline')[1]}</strong>.
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Show actions for invite notifications */}
                        {notification.type.startsWith('Added') && notification.status === null && (
                            <div className={cx('actions')}>
                                <button
                                    className={cx('accept-btn')}
                                    onClick={() =>
                                        handleResponse(
                                            notification.id,
                                            'accept',
                                            extractGroupDivisionId(notification.type),
                                        )
                                    }
                                >
                                    Accept
                                </button>
                                <button
                                    className={cx('decline-btn')}
                                    onClick={() =>
                                        handleResponse(
                                            notification.id,
                                            'decline',
                                            extractGroupDivisionId(notification.type),
                                        )
                                    }
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Load more button */}
                {notifications.length >= limit && (
                    <div className={cx('load-more')}>
                        <button onClick={loadMore}>Show more</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationModal;
