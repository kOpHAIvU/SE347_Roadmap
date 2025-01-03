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

    const [profile, setProfile] = useState(null);
    const [role, setRole] = useState('user')
    const [proEdit, setProEdit] = useState(false)
    const [roadmapRecords, setRoadmapRecords] = useState(0)
    const [layoutTitle, setLayoutTitle] = useState(title)
    const [layoutContent, setLayoutContent] = useState(content)

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
            setRole(data.data.role.name)
            return data.data.id;
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchRoadmapData = async (roadmapData) => {
        try {
            const updatedClone = roadmapData.clone + 1;

            const response = await fetch(`http://localhost:3004/roadmap/item/${roadmapData.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clone: updatedClone }),
            });

            const data = await response.json();
            if (response.ok) {
                return data.data;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
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
                await fetchRoadmapData(data.data.roadmap)
                return data.data
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchUpdateTimelineTitleContent = async (timelineId, title, content) => {
        try {
            const response = await fetch(`http://localhost:3004/timeline/item/${timelineId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Update timeline: ", data);
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

    const fetchPaymentStatus = async (profileId) => {
        try {
            const response = await fetch(`http://localhost:3004/payment/user/${profileId}?page=1&limit=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Payment status: ", data);
                if (data && data.data && data.data.length > 0)
                    setProEdit(true)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchOwnRoadmapData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/roadmap/owner?page=1&limit=12`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRoadmapRecords(data.data.totalRecord)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch roadmap data.');
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProfile();
            setProfile(data);
            await fetchOwnRoadmapData()
            if (data)
                await fetchPaymentStatus(data)
        };
        fetchData();
    }, []);

    const handleCreate = async () => {
        if (layoutTitle && layoutContent) {
            if ((proEdit && roadmapRecords < 15) || (!proEdit && roadmapRecords < 3) || role === 'admin') {
                const timelineData = await fetchCloneRoadmap()
                console.log("Timeline: ", timelineData)
                const teamId = await fetchNewTeam("Team for study")
                await fetchGroupDivisionTeam(teamId, timelineData.id)
                await fetchUpdateTimelineTitleContent(timelineData.id, layoutTitle, layoutContent)

                if (timelineData && teamId) {
                    const encryptedId = encryptId(timelineData.id);
                    navigate(`/timeline/${encryptedId}`);
                } else {
                    console.error("Failed to create new timeline.");
                }
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
                    <input type="text" value={layoutTitle} onChange={(e) => setLayoutTitle(e.target.value)} />
                </div>

                <div className={cx('form-group')}>
                    <label>Description</label>
                    <textarea className={cx('description')} value={layoutContent} onChange={(e) => setLayoutContent(e.target.value)} />
                </div>

                <div className={cx('button-group')}>
                    <button className={cx('cancel-btn')} onClick={() => setShowDialog(false)}>
                        Cancel
                    </button>

                    <button
                        className={cx('create-btn')}
                        onClick={handleCreate}
                        disabled={!layoutTitle || !layoutContent}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTimeline;