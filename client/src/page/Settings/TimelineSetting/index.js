import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './TimelineSetting.module.scss';
import { users, invites } from '../Users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);  

function TimelineSetting() {
    const [userList, setUserList] = useState(users);
    const [inviteList, setInviteList] = useState(invites);
    const [isInviteFormVisible, setIsInviteFormVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/timeline/setting/invite') {
            setIsInviteFormVisible(true);
        }
    }, [location.pathname]);
    const handleRoleChange = (userId, newRole) => {
        setUserList((prevUsers) =>
        prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
        )
        );
    };

    const handleInviteButtonClick = () => {
        setIsInviteFormVisible(true); 
        navigate('/timeline/setting/invite');
    };

    const handleCloseInviteForm  = () => {
        setIsInviteFormVisible(false);
        navigate('/timeline/setting');
    };


    const handleRevokeInvite = (inviteId) => {
        setInviteList((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
        );
    };

    return (
        <>
            <div className={cx('wrapper', { 'blur-background': isInviteFormVisible  })}>
                <h1>Settings my timeline</h1>
                <h2 className={cx('user-header')}>User Management</h2>

                <div className={cx('user')}> 
                    <div className={cx('inviteSection')}>
                        <h2>User</h2>
                        <p className={cx('title')}>
                            Invite your friends to join the timeline and work together seamlessly.
                        </p>
                        <button className={cx('inviteButton')} onClick={handleInviteButtonClick}>Invite people</button>
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

                
            </div>

            {/* Form mời bạn */}
            {isInviteFormVisible && (
                <div className={cx('inviteForm')}>
                    <div className={cx('header-form')}>
                        <h2>Invite Member</h2>
                        <FontAwesomeIcon icon={faXmark} className={cx('closeIcon')} onClick={handleCloseInviteForm} />
                    </div>

                    <form className={cx('contentForm')}>
                        <label>
                            <strong>
                                Username:
                            </strong>
                            <input type="text" name="username" />
                        </label>

                        <label>
                            <strong>
                                Email Address:
                            </strong>
                            <input type="email" name="email" />
                        </label>

                        <label>
                            <strong>
                                Role:
                            </strong>
                            <div className={cx('roleRadioGroup')}>
                                <label>
                                    <input type="radio" name="role" value="Administrator" /> Administrator
                                </label>
                                <label>
                                    <input type="radio" name="role" value="Editor" /> Editor
                                </label>
                                <label>
                                    <input type="radio" name="role" value="Viewer" /> Viewer
                                </label>
                            </div>
                        </label>

                        <label>
                            <strong>
                                Message
                            </strong> (Optional):
                            <textarea name="message"></textarea>
                        </label>
                    </form>

                    <div className={cx('footer-form')}>
                            <button type="button" onClick={handleCloseInviteForm} className={cx('btnCancel')}>Cancel</button>
                            <button type="submit" className={cx('btnSubmit')}>Invite</button>
                    </div>
                </div>
            )}
        </>    
    );
}

export default TimelineSetting;
