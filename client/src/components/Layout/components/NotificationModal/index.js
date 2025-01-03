import React, { useState, useEffect } from 'react';
import styles from './NotificationModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

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
    const [totalPages, setTotalPages] = useState(1);

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
                    `http://44.245.39.225:3004/notification/all/owner?page=${page}&limit=5`,
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
                    const totalNotifications = responseData.data.total;
                    console.log('Response data:', responseData);
                    const notificationsData = responseData.data; // Truy cập đúng mảng dữ liệu
                    const formattedData = notificationsData.map((item) => ({
                        id: item.id,
                        type: item.type,
                        titles: item.title,
                        text: item.content,
                        unread: !item.isCheck,
                        avatar: item.postNotification?.avatar?.split(' ')[0], // Xử lý URL avatar chính xác
                        username: item.postNotification?.username,
                        createdAt: new Date(item.createdAt),
                        status: null,
                    }));
                    formattedData.sort((a, b) => b.createdAt - a.createdAt);
                    console.log('Formatted notifications: ', formattedData);
                    setNotifications(formattedData);
                    setTotalPages(Math.ceil(totalNotifications / 5));
                    console.log('total', totalPages);
                    console.log('Formatted', notifications);
                } else {
                    const errorData = await response.json();
                    console.error("Err", errorData)
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
        try {
            if (action === 'accept') {
                if (groupDivisionId) {
                    await updateRole(groupDivisionId, 3);
                    await deleteNotifi(notificationId);
                    console.log(`Accepted notification with ID: ${notificationId}`);
                } else {
                    console.error('GroupDivision ID is missing for accept action');
                }
            } else if (action === 'decline') {
                if (groupDivisionId) {
                    await declineNotifi(notificationId);
                    console.log(`Declined notification with ID: ${notificationId}`);
                } else {
                    console.error('GroupDivision ID is missing for decline action');
                }

                if (notificationId) {
                    await deleteNotifi(notificationId);
                    console.log(`Declined notification with ID: ${notificationId}`);
                } else {
                    console.error('GroupDivision ID is missing for decline action');
                }
            } else {
                console.error('Invalid action:', action);
            }

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId ? { ...notification, status: action } : notification,
                ),
            );
        } catch (error) {
            console.error('Error handling response:', error);
        }
    };

    const loadMore = () => setPage((prevPage) => prevPage + 1);
    const handlePageChange = (direction) => {
        setPage((prevPage) => {
            const newPage = prevPage + direction;
            if (newPage < 1 || newPage > totalPages) {
                return prevPage; // Không thay đổi nếu vượt ngoài giới hạn
            }
            return newPage; // Cập nhật nếu trong giới hạn
        });
    };

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

    const extractGroupDivisionId = (type) => {
        const parts = type.split(' ');
        return parts.length > 1 ? parts[1] : null; // Lấy phần tử thứ hai sau 'Added'
    };

    const updateRole = async (groupId, newRole) => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/group-division/item/${groupId}`, {
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
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating role:', error);
            //alert('An error occurred while updating the role. Please try again.');
        }
    };

    const declineNotifi = async (inviteId) => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/group-division/item/${inviteId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Decline successfully');
            } else {
                const data = await response.json();
                console.error('Failed to Decline:', data.message);
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during decline:', error);
            //alert('An error occurred while decline. Please try again.');
        }
    };

    const deleteNotifi = async (notifiId) => {
        try {
            const response = await fetch(`http://44.245.39.225:3004/notification/item/${notifiId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Delete successfully');
            } else {
                const data = await response.json();
                console.error('Failed to Delete:', data.message);
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during Delete:', error);
            //alert('An error occurred while Delete. Please try again.');
        }
    };

    const formatNotificationText = (text) => {
        const words = text.split(' ');
        if (words.length < 2) {
            return { firstWord: text, middleText: '', lastWord: '' };
        }
        return {
            firstWord: words[0],
            middleText: words.slice(1, -1).join(' '),
            lastWord: words[words.length - 1],
        };
    };
    return (
        <div className={cx('modal')}>
            <h2 className={cx('title')}>Notifications</h2>

            <div className={cx('tabs')}>
                <button className={cx('tab', 'active')}>All</button>
            </div>

            <div className={cx('notification-content')}>
                {notifications.map((notification) => {
                    const { firstWord, middleText, lastWord } = formatNotificationText(notification.text);
                    return (
                        <div key={notification.id}>
                            <p>
                                {notification.type.startsWith('Added') && notification.status === null ? (
                                    <div className={cx('notification-item')}>
                                        <div className={cx('title-notifi')}>
                                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />
                                            <div className={cx('main-content')}>
                                                <strong>{firstWord}</strong> {middleText} <strong>{lastWord}</strong>
                                            </div>
                                        </div>
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
                                    </div>
                                ) : notification.type.startsWith('Added') && notification.status === 'accept' ? (
                                    <div className={cx('notification-item', 'added-accept-notification')}>
                                        <div className={cx('title-notifi')}>
                                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />
                                            <div className={cx('main-content')}>
                                                You have successfully joined this timeline.
                                            </div>
                                        </div>
                                    </div>
                                ) : notification.type.startsWith('Added') && notification.status === 'decline' ? (
                                    <div className={cx('notification-item', 'added-decline-notification')}>
                                        <div className={cx('title-notifi')}>
                                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />
                                            <div className={cx('main-content')}>
                                                You have declined the invitation to join this timeline.
                                            </div>
                                        </div>
                                    </div>
                                ) : notification.type.startsWith('gmail') ? (
                                    <div className={cx('notification-item')}>
                                        <div className={cx('title-notifi')}>
                                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />
                                            <div className={cx('main-content')}>
                                                <strong>{notification.username}: </strong>A {notification.titles}
                                            </div>
                                        </div>
                                    </div>
                                ) : notification.type.startsWith('Report') ? (
                                    <div className={cx('notification-item', 'report-notification')}>
                                        <div className={cx('title-notifi')}>
                                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />
                                            <div className={cx('main-content')}>{notification.text}</div>
                                        </div>
                                    </div>
                                ) : notification.type.startsWith('Blocked') ? (
                                    <div className={cx('notification-item', 'blocked-notification')}>
                                        <div className={cx('title-notifi')}>
                                            <img src={notification.avatar} alt="Avatar" className={cx('avatar')} />
                                            <div className={cx('main-content')}>{notification.text}</div>
                                        </div>
                                    </div>
                                ) : null}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className={cx('pagination')}>
                <FontAwesomeIcon
                    icon={faCaretLeft}
                    className={cx('prev-btn', { disabled: page === 1 })}
                    onClick={() => handlePageChange(-1)}
                    disabled={page === 1}
                />
                <span className={cx('page-info')}>{page}</span>
                <FontAwesomeIcon
                    icon={faCaretRight}
                    className={cx('next-btn', { disabled: page === totalPages })}
                    onClick={() => handlePageChange(1)}
                    disabled={page === totalPages}
                />
            </div>
        </div>
    );
}

export default NotificationModal;
