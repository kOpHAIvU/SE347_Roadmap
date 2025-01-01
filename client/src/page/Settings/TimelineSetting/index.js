import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './TimelineSetting.module.scss';
import { users, invites } from '../Users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DeleteCollab } from '~/components/Layout/components/MiniNotification/index.js';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);
const secretKey = 'kophaivu'; // Khóa bí mật

const decryptId = (encryptedId) => {
    const normalizedEncryptedId = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(normalizedEncryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

function TimelineSetting() {
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const id = decryptId(encryptedId);
    const [userList, setUserList] = useState(users);
    const [inviteList, setInviteList] = useState(invites);
    const [isInviteFormVisible, setIsInviteFormVisible] = useState(false);
    const location = useLocation();
    // const { id } = useParams();

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    };

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await fetch(`http://localhost:3004/group-division/timelineId/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    const usersTemp = [];
                    const invitesTemp = [];
                    const transformedData = data.data.groupDivisions.map((group) => ({
                        id: group.id,
                        fullName: group.user.fullName,
                        email: group.user.email,
                        avatar: group.user.avatar.split(' ')[0],
                        role: group.role,
                        // teamName: group.team.name,
                    }));

                    transformedData.forEach((user) => {
                        if ([1, 2, 3].includes(user.role)) {
                            usersTemp.push(user);
                        } else if (user.role === 4) {
                            invitesTemp.push(user);
                        }
                    });
                    setUserList(usersTemp);
                    setInviteList(invitesTemp);
                    console.log('Transformed data:', transformedData);
                    // setUserList(transformedData);
                } else {
                    console.error('Failed to fetch user data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        };

        fetchUserList();
    }, [id]);

    useEffect(() => {
        if (location.pathname === `/timeline/${encryptedId}/setting/invite`) {
            setIsInviteFormVisible(true);
        }
    }, [location.pathname, encryptedId]);

    const handleInviteButtonClick = () => {
        setIsInviteFormVisible(true);
        navigate(`/timeline/${encryptedId}/setting/invite`);
    };

    const handleCloseInviteForm = () => {
        setIsInviteFormVisible(false);
        navigate(`/timeline/${encryptedId}/setting`);
    };

    // const handleRevokeInvite = (inviteId) => {
    //     setInviteList((prevInvites) => prevInvites.filter((invite) => invite.id !== inviteId));
    // };
    const handleRevokeInvite = async (inviteId) => {
        const confirmRevoke = window.confirm('Are you sure you want to revoke this invite?');
        if (!confirmRevoke) return;

        try {
            const response = await fetch(`http://localhost:3004/group-division/item/${inviteId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Cập nhật danh sách lời mời sau khi server xác nhận xóa thành công
                setInviteList((prevInvites) => prevInvites.filter((invite) => invite.id !== inviteId));
                console.log('Invite revoked successfully');
            } else {
                const data = await response.json();
                console.error('Failed to revoke invite:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during invite revocation:', error);
            alert('An error occurred while revoking the invite. Please try again.');
        }
    };

    const [dialogs, setDialogs] = useState([]);

    // const handleDeleteUser = (userId) => {

    //     setUserList((prevUsers) => prevUsers.filter((user) => user.id !== userId));

    //     const userToDelete = userList.find((user) => user.id === userId);

    //     if (userToDelete) {
    //         // Xóa user khỏi danh sách
    //         setUserList((prevList) => prevList.filter((user) => user.id !== userId));

    //         // Hiển thị thông báo xóa
    //         const newDialog = { id: Date.now(), username: userToDelete.name };
    //         setDialogs((prevDialogs) => [...prevDialogs, newDialog]);

    //         // Tự động ẩn thông báo sau 3 giây
    //         setTimeout(() => {
    //             setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
    //         }, 3000);
    //     }
    // };

    const handleDeleteUser = async (groupId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3004/group-division/item/${groupId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const deletedUser = userList.find((user) => user.id === groupId);
                // Xóa user khỏi danh sách sau khi server xác nhận
                setUserList((prevUsers) => prevUsers.filter((user) => user.id !== groupId));
                console.log('User deleted successfully');
                if (deletedUser) {
                    const newDialog = { id: Date.now(), username: deletedUser.fullName };
                    setDialogs((prevDialogs) => [...prevDialogs, newDialog]);

                    // Tự động ẩn thông báo sau 3 giây
                    setTimeout(() => {
                        setDialogs((prevDialogs) => prevDialogs.filter((dialog) => dialog.id !== newDialog.id));
                    }, 3000);
                }
            } else {
                const data = await response.json();
                console.error('Failed to delete user:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('An error occurred while deleting the user. Please try again.');
        }
    };

    const handleDeleteTimeline = async () => {
        const confirmDelete = window.confirm('Do you really want to delete this roadmap?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3004/timeline/item/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Timeline deleted successfully');
                // Điều hướng về trang "home" sau khi xóa thành công
                window.location.href = '/home';
            } else {
                const data = await response.json();
                console.error('Failed to delete timeline:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during timeline deletion:', error);
            alert('An error occurred while deleting the timeline. Please try again.');
        }
    };

    const handleRoleChange = async (groupId, newRole) => {
        // Cập nhật danh sách local trước
        setUserList((prevUsers) => prevUsers.map((user) => (user.id === groupId ? { ...user, role: newRole } : user)));

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

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchProfileAndCheckRole = async () => {
            try {
                // Fetch profile
                const profileResponse = await fetch('http://localhost:3004/auth/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                });

                const profileData = await profileResponse.json();

                if (profileResponse.ok) {
                    const userIdFromProfile = profileData.data.id;

                    // Fetch group-division data
                    const groupResponse = await fetch(`http://localhost:3004/group-division/timelineId/${id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const groupData = await groupResponse.json();

                    if (groupResponse.ok) {
                        const admins = groupData.data.groupDivisions.filter((division) => division.role === 1);

                        admins.forEach((admin) => {
                            console.log('Admin User ID:', admin.user.id);
                        });

                        const isUserAdmin = admins.some((admin) => admin.user.id === userIdFromProfile);
                        console.log(isUserAdmin);
                        setIsAdmin(isUserAdmin);
                    } else {
                        console.error('Failed to fetch group-division data:', groupData.message);
                    }
                } else {
                    console.error('Failed to fetch profile:', profileData.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProfileAndCheckRole();
    }, [id]);

    return (
        <>
            <div className={cx('wrapper', { 'blur-background': isInviteFormVisible })}>
                <h1>Settings my timeline</h1>
                <h2 className={cx('user-header')}>User Management</h2>

                <div className={cx('user')}>
                    <div className={cx('inviteSection')}>
                        <h2>User</h2>
                        <p className={cx('title')}>
                            Invite your friends to join the timeline and work together seamlessly.
                        </p>
                        {isAdmin && (
                            <button className={cx('inviteButton')} onClick={handleInviteButtonClick}>
                                Invite people
                            </button>
                        )}
                    </div>

                    <div className={cx('userList')}>
                        {userList.map((user) => (
                            <div key={user.id} className={cx('userItem')}>
                                <img src={user.avatar} alt={user.fullName} className={cx('avatar')} />
                                <div className={cx('userInfo')}>
                                    <p className={cx('userName')}>{user.fullName}</p>
                                    <p className={cx('userEmail')}>{user.email}</p>
                                </div>

                                {user.role === 1 ? (
                                    <span className={cx('userRoleLabel')}>Administrator</span>
                                ) : (
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={cx('userRoleSelect')}
                                        disabled={!isAdmin}
                                    >
                                        {/* <option value="Administrator">Administrator</option> */}
                                        <option value="2">Editor</option>
                                        <option value="3">Reviewer</option>
                                    </select>
                                )}
                                {user.role !== 1 && isAdmin && (
                                    <button className={cx('deleteButton')} onClick={() => handleDeleteUser(user.id)}>
                                        <FontAwesomeIcon className={cx('delete-icon')} icon={faTrashCan} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={cx('mini-notify')}>
                        {dialogs.map((dialog) => (
                            <DeleteCollab
                                key={dialog.id}
                                username={dialog.fullName}
                                handleClose={() => {
                                    setDialogs((prevDialogs) => prevDialogs.filter((d) => d.id !== dialog.id));
                                }}
                            />
                        ))}
                    </div>
                </div>

                {isAdmin && (
                    <div className={cx('invite')}>
                        <div className={cx('inviteSection')}>
                            <h2>Pending Invites</h2>
                            <p className={cx('title')}>
                                Resend invitations to those who haven’t joined yet or revoke invites you no longer need.
                            </p>
                        </div>

                        <div className={cx('inviteList')}>
                            {inviteList.map((invite) => (
                                <div key={invite.id} className={cx('userItem')}>
                                    <img src={invite.avatar} alt={invite.fullName} className={cx('avatar')} />
                                    <div className={cx('userInfo')}>
                                        <p className={cx('userName')}>{invite.fullName}</p>
                                        <p className={cx('userEmail')}>{invite.email}</p>
                                    </div>

                                    {/* <button className={cx('resendButton')}>Resend Invite</button> */}

                                    <button
                                        className={cx('revokeButton')}
                                        onClick={() => handleRevokeInvite(invite.id)}
                                    >
                                        Revoke Invite
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <div className={cx('delete-status')}>
                        <div className={cx('delete')}>
                            <h1 className={cx('delete-title')}>Delete this timeline</h1>
                            <h1 className={cx('delete-content')}>
                                Once you delete a timeline, there is no going back. Please be certain.
                            </h1>
                        </div>
                        <FontAwesomeIcon
                            onClick={handleDeleteTimeline}
                            className={cx('delete-btn')}
                            icon={faTrashCan}
                        />
                    </div>
                )}
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
                            <strong>Username:</strong>
                            <input type="text" name="username" />
                        </label>

                        <label>
                            <strong>Email Address:</strong>
                            <input type="email" name="email" />
                        </label>

                        <label>
                            <strong>Role:</strong>
                            <div className={cx('roleRadioGroup')}>
                                {/* <label>
                                    <input type="radio" name="role" value="Administrator" /> Administrator
                                </label> */}
                                <label>
                                    <input type="radio" name="role" value="Editor" /> Editor
                                </label>
                                <label>
                                    <input type="radio" name="role" value="Viewer" /> Viewer
                                </label>
                            </div>
                        </label>

                        <label>
                            <strong>Message</strong> (Optional):
                            <textarea name="message"></textarea>
                        </label>
                    </form>

                    <div className={cx('footer-form')}>
                        <button type="button" onClick={handleCloseInviteForm} className={cx('btnCancel')}>
                            Cancel
                        </button>
                        <button type="submit" className={cx('btnSubmit')}>
                            Invite
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default TimelineSetting;
