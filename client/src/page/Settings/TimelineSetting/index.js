import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './TimelineSetting.module.scss';
import { users, invites } from '../Users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);  // Khởi tạo cx

function TimelineSetting() {
    const [userList, setUserList] = useState(users);
    const [inviteList, setInviteList] = useState(invites);

    const handleRoleChange = (userId, newRole) => {
        setUserList((prevUsers) =>
        prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
        )
        );
    };

    const [showInviteForm, setShowInviteForm] = useState(false);

    const handleInviteClick = () => {
    setShowInviteForm(true);
    };

    const handleCloseForm = () => {
    setShowInviteForm(false);
    };


    const handleRevokeInvite = (inviteId) => {
        setInviteList((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
        );
    };

    return (
        <div className={cx('wrapper', { blurred: showInviteForm })}>
            <h1>Settings my timeline</h1>
            <h2 className={cx('user-header')}>User Management</h2>
            <div className={cx('user')}> 
                <div className={cx('inviteSection')}>
                    <h2>User</h2>
                    <p className={cx('title')}>
                        Invite your friends to join the timeline and work together seamlessly.
                    </p>
                    <button className={cx('inviteButton')}onClick={handleInviteClick}>Invite people</button>
                </div>

                <div className={cx('userList')}>
                    {userList.map((user) => (
                        <div key={user.id} className={cx('userItem')}>
                            <img src={user.avatar} alt={user.name} className={cx('avatar')} />
                            <div className={cx('userInfo')}>
                                <p className={cx('userName')}>{user.name}</p>
                                <p className={cx('userEmail')}>{user.email}</p>
                            </div>

                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className={cx('userRoleSelect')}
                            >
                                <option value="Administrator">Administrator</option>
                                <option value="Editor">Editor</option>
                                <option value="Reviewer">Reviewer</option>
                            </select>
                            
                            <button className={cx('deleteButton')}>
                                <FontAwesomeIcon className={cx('delete-icon')} icon={faTrashCan} /> 
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={cx('invite')}> 
                <div className={cx('inviteSection')}>
                    <h2 >Pending Invites</h2>
                    <p className={cx('title')}>
                    Resend invitations to those who haven’t joined yet or revoke invites you no longer need.
                    </p>
                </div>

                <div className={cx('inviteList')}>
                    {inviteList.map((invite) => (
                        <div key={invite.id} className={cx('userItem')}>
                            <img src={invite.avatar} alt={invite.name} className={cx('avatar')} />
                            <div className={cx('userInfo')}>
                                <p className={cx('userName')}>{invite.name}</p>
                                <p className={cx('userEmail')}>{invite.email}</p>
                            </div>
                            
                            <button className={cx('resendButton')}>
                                Resend Invite
                            </button>

                            <button className={cx('revokeButton')}>
                                Revoke Invite
                            </button>
                        </div>
                        
                    ))}
                </div>
            </div>

            {/* Form mời bạn */}
            {showInviteForm && <div className={cx('overlay')} />}
            {showInviteForm && (
                <div className={cx('inviteForm')}>
                    <h3>Invite Member</h3>
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email Address" />
                    <button onClick={handleCloseForm}>Cancel</button>
                    <button>Invite</button>
                </div>
            )}
        </div>
    );
}

export default TimelineSetting;
