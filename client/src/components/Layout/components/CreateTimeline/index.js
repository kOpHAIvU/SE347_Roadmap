import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './CreateTimeline.module.scss';
import classNames from 'classnames/bind';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    // Thay thế ký tự đặc biệt
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function CreateTimeline({ children, title, setTitle, content, setContent, handleOutsideClick, setShowDialog }) {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null)

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile data.');
                navigate('/login')
            }

            const data = await response.json();
            return data.data.id;
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchCloneRoadmap = async () => {
        try {
            const response = await fetch(`http://localhost:3004/timeline/clone/${children.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                return data.data
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchNewTeam = async (name) => {
        try {
            const response = await fetch('http://localhost:3004/team/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    leader: profile,
                    isActive: 1,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("New team: ", data);
                return data.data.id
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchGroupDivisionTeam = async (teamId, timelineId) => {
        try {
            const body = new URLSearchParams({
                teamId: teamId,
                userId: profile,
                timelineId: timelineId,
                role: 1
            }).toString();
            const response = await fetch('http://localhost:3004/group-division/new', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body,
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProfile();
            setProfile(data);
        };
        fetchData();
    }, []);

    const handleCreate = async () => {
        if (title && content) {
            const timelineData = await fetchCloneRoadmap()
            console.log("Timeline: ", timelineData)
            const teamId = await fetchNewTeam("Team for study")
            await fetchGroupDivisionTeam(teamId, timelineData.id)

            if (timelineData && teamId) {
                const encryptedId = encryptId(timelineData.id);
                navigate(`/timeline/${encryptedId}`);
            } else {
                console.error("Failed to create new timeline.");
            }
        }
    };

    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
                e.stopPropagation();
                handleOutsideClick(e);
            }}>
            <div className={cx('modal')}>
                <button className={cx('close-btn')} onClick={() => setShowDialog(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <h2 className={cx('form-name')}>Create New Timeline</h2>

                <div className={cx('form-group')}>
                    <label>Timeline Name</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className={cx('form-group')}>
                    <label>Description</label>
                    <textarea className={cx('description')} value={content} onChange={(e) => setContent(e.target.value)} />
                </div>

                <div className={cx('button-group')}>
                    <button className={cx('cancel-btn')} onClick={() => setShowDialog(false)}>
                        Cancel
                    </button>

                    <button
                        className={cx('create-btn')}
                        onClick={handleCreate}
                        disabled={!title || !content}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTimeline;