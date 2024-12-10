import React, { useState } from 'react';
import styles from './NotificationModal.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';

const cx = classNames.bind(styles);

const newAvatar = 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg';
const newav =
    'https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/376194887_1504946626576665_3116387707499991413_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=B5tnevj9eI4Q7kNvgFla1sp&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=At6eYUITeknKof22d27Qhxv&oh=00_AYAzzQ8eKca4FU-_nhgcAOcwP4rnd9Covk3x3zKJv4WxRA&oe=675B353D';

function NotificationModal() {
    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'system', text: 'System Notification 1', unread: true, avatar: images.logo, username: 'System' },
        {
            id: 2,
            type: 'system',
            text: 'System Notification 2',
            unread: false,
            avatar: images.logo,
            username: 'System',
        },
        {
            id: 3,
            type: 'invite',
            text: 'You have been invited to join Timeline A',
            unread: true,
            status: null,
            avatar: newav,
            username: 'abcxyz',
        },
        {
            id: 4,
            type: 'invite',
            text: 'You have been invited to join Timeline B',
            unread: true,
            status: null,
            avatar: newAvatar,
            username: 'abcxyz',
        },
        { id: 5, type: 'system', text: 'System Notification 3', unread: true, avatar: images.logo, username: 'System' },
        { id: 6, type: 'system', text: 'System Notification 4', unread: true, avatar: images.logo, username: 'System' },
        {
            id: 7,
            type: 'invite',
            text: 'You have been invited to join Timeline C',
            unread: false,
            status: 'decline',
            avatar: newAvatar,
            username: 'abcxyz',
        },
        {
            id: 8,
            type: 'invite',
            text: 'You have been invited to join Timeline D',
            unread: true,
            status: null,
            avatar: newAvatar,
            username: 'abcxyz',
        },
        {
            id: 9,
            type: 'system',
            text: 'System Notification 5',
            unread: false,
            avatar: images.logo,
            username: 'System',
        },
        {
            id: 10,
            type: 'invite',
            text: 'You have been invited to join Timeline E',
            unread: true,
            status: null,
            avatar: newAvatar,
            username: 'abcxyz',
        },
    ]);

    // Filter notifications based on activeTab
    const filteredNotifications = activeTab === 'all' ? notifications : notifications.filter((n) => n.unread);

    // Handle Accept or Decline
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
