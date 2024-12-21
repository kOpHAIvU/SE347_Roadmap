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
    const [activeTab, setActiveTab] = useState('unread');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Access token is missing. Please log in.');
                }

                const response = await fetch('http://localhost:3004/notification/all?page=1&limit=10', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch notifications');
                }

                const responseData = await response.json();

                console.log('Response data:', responseData);

                const notificationsData = responseData.data || [];

                const formattedData = notificationsData.map((item) => ({
                    id: item.id,
                    type: item.type,
                    text: item.content || '',
                    unread: !item.isCheck,
                    avatar: item.receiver?.avatar || '',
                    username: item.receiver?.username || 'System',
                    status: null,
                }));

                setNotifications(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const filteredNotifications = activeTab === 'all' ? notifications : notifications.filter((n) => n.unread);

    const handleResponse = (id, status) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          text:
                              status === 'accept'
                                  ? 'You are now a member of this timeline.'
                                  : 'You declined the invitation to this timeline.',
                          status,
                          unread: false,
                      }
                    : notification,
            ),
        );
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={cx('modal')}>
            <h2 className={cx('title')}>Notifications</h2>

            {/* Tabs */}
            <div className={cx('tabs')}>
                <button className={cx('tab', { active: activeTab === 'all' })} onClick={() => setActiveTab('all')}>
                    All
                </button>
                <button
                    className={cx('tab', { active: activeTab === 'unread' })}
                    onClick={() => setActiveTab('unread')}
                >
                    Unread
                </button>
            </div>

            {/* Notification Content */}
            <div className={cx('notification-content')}>
                {filteredNotifications.map((notification) => (
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
                        {notification.type === 'invite' && notification.status === null && (
                            <div className={cx('actions')}>
                                <button
                                    className={cx('accept-btn')}
                                    onClick={() => handleResponse(notification.id, 'accept')}
                                >
                                    Accept
                                </button>
                                <button
                                    className={cx('decline-btn')}
                                    onClick={() => handleResponse(notification.id, 'decline')}
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationModal;
