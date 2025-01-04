import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const [profile, setProfile] = useState(null);
    // const { id } = useParams();

    const getToken = useCallback(() => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }, [navigate]);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await fetch(`http://44.245.39.225:3004/group-division/timelineId/${id}`, {
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
                        teamName: group.team.id,
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
    }, [id, getToken]);

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
        setSearchTerm('');
        setResults([]);
        navigate(`/timeline/${encryptedId}/setting`);
    };

    const handleRevokeInvite = async (inviteId) => {
        const confirmRevoke = window.confirm('Are you sure you want to revoke this invite?');
        if (!confirmRevoke) return;

        try {
            const response = await fetch(`http://44.245.39.225:3004/group-division/item/${inviteId}`, {
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
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during invite revocation:', error);
            //alert('An error occurred while revoking the invite. Please try again.');
        }
    };

    const [dialogs, setDialogs] = useState([]);

    const handleDeleteUser = async (groupId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://44.245.39.225:3004/group-division/item/${groupId}`, {
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
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            //alert('An error occurred while deleting the user. Please try again.');
        }
    };

    const handleDeleteTimeline = async () => {
        const confirmDelete = window.confirm('Do you really want to delete this roadmap?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://44.245.39.225:3004/timeline/item/${id}`, {
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
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during timeline deletion:', error);
            //alert('An error occurred while deleting the timeline. Please try again.');
        }
    };

    const handleRoleChange = async (groupId, newRole) => {
        // Cập nhật danh sách local trước
        setUserList((prevUsers) => prevUsers.map((user) => (user.id === groupId ? { ...user, role: newRole } : user)));

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

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchProfileAndCheckRole = async () => {
            try {
                // Fetch profile
                const profileResponse = await fetch('http://44.245.39.225:3004/auth/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                });

                const profileData = await profileResponse.json();

                if (profileResponse.ok) {
                    setProfile(profileData.data);
                    const userIdFromProfile = profileData.data.id;

                    // Fetch group-division data
                    const groupResponse = await fetch(`http://44.245.39.225:3004/group-division/timelineId/${id}`, {
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
    }, [id, getToken]);

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const debounceRef = useRef(null);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            performSearch(term);
        }, 500);
    };
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const performSearch = async (term) => {
        setError('');
        setIsLoading(true);

        try {
            if (!term.trim()) {
                setError('Search term cannot be empty');
                return;
            }

            const token = getToken();
            if (!token) {
                setError('Authorization token is missing');
                return;
            }

            const response = await fetch(`http://44.245.39.225:3004/user/search/${term}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch data');
                return;
            }

            const data = await response.json();
            setResults(data.data?.users || []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Error fetching search results.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        console.log('dddd', user);
    };

    const fetchNewNotification = async (timelineName, type) => {
        try {
            const body = new URLSearchParams({
                title: timelineName + ' was invited successfully.',
                content: `${profile.username} has invited you to join the timeline ${timelineName}.`,
                type: type,
                posterId: profile.id,
                receiverId: selectedUser.id,
                isCheck: 0,
                isActive: 1,
            }).toString();

            const response = await fetch('http://44.245.39.225:3004/notification/new', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('fetchNewNotification', data);
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddToTimeline = async () => {
        if (!selectedUser) {
            //alert('Please select a user to add to the timeline.');
            return;
        }

        try {
            const token = getToken();
            if (!token) return;
            if (!userList.length) {
                console.error('userList is empty');
                return;
            }
            const firstUser = userList[0];
            const payload = {
                teamId: firstUser.teamName,
                userId: selectedUser.id,
                timelineId: id,
                role: 4,
            };

            const response = await fetch('http://44.245.39.225:3004/group-division/new', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('User added to timeline successfully:', updatedUser);
                const groupDivisionId = updatedUser.data.id;

                setInviteList((prev) => [...prev, updatedUser]);
                setSearchTerm('');
                setResults([]);
                console.log('ds', updatedUser.data.timeline.title);
                await fetchNewNotification(
                    updatedUser.data.timeline.title, // Tên hoặc thông tin liên quan đến timeline
                    `Added ${groupDivisionId}`, // Loại thông báo, bạn có thể thay đổi tùy mục đích
                );
            } else {
                const data = await response.json();
                console.error('Failed to add user to timeline:', data.message);
                //alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding user to timeline:', error);
            //alert('An error occurred while adding the user to the timeline. Please try again.');
        }
    };

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
                                        <option value="3">Viewer</option>
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
                    <div className={cx('modal')}>
                        <h2 className={cx('form-name')}>
                            Add People to Timeline
                            <button className={cx('close-btn')} onClick={handleCloseInviteForm}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </h2>

                        <div className={cx('form-group')}>
                            <label className={cx('search-title')}>Search by username</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                            />
                        </div>

                        {isLoading && <div className={cx('loading')}>Loading...</div>}
                        {error && <div className={cx('error')}>{error}</div>}

                        <div className={cx('results')}>
                            {results.map((user) => (
                                <div
                                    key={user.id}
                                    className={cx('result-item', {
                                        selected: selectedUser?.id === user.id,
                                    })}
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <span>{user.username}</span>
                                </div>
                            ))}
                        </div>

                        <div className={cx('button-group')}>
                            <button
                                className={cx('cancel-btn')}
                                onClick={handleCloseInviteForm}
                                // disabled={!selectedUser}
                            >
                                Cancel
                            </button>
                            <button className={cx('add-btn')} onClick={handleAddToTimeline} disabled={!selectedUser}>
                                Add to timline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TimelineSetting;
