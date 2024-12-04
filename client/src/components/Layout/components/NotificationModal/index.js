import React, { useState } from 'react';
import styles from './NotificationModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotificationModal() {
    const [activeTab, setActiveTab] = useState('all');

    const notifications = [
        { id: 1, text: 'Thông báo 1', unread: true },
        { id: 2, text: 'Thông báo 2', unread: false },
        { id: 3, text: 'Thông báo 3', unread: true },
        { id: 4, text: 'Thông báo 4', unread: false },
    ];

    const filteredNotifications = activeTab === 'all' ? notifications : notifications.filter((n) => n.unread);

    return (
        <div className={cx('modal')}>
            <h2 className={cx('title')}>Notifications</h2>

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

            <div className={cx('notification-content')}>
                {filteredNotifications.map((notification) => (
                    <div key={notification.id} className={cx('notification-item')}>
                        {notification.text}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationModal;
