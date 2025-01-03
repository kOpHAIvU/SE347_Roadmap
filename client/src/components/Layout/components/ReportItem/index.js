import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ReportItem.module.scss';
import CryptoJS from 'crypto-js';
import classNames from 'classnames/bind';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function ReportItem({ children }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3004/auth/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${getToken()}`, // Đính kèm token vào tiêu đề Authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Failed to fetch profile data.');
                navigate(`/login`);
                return;
            }

            const data = await response.json();
            setProfile(data.data.id);
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProfile();
        };
        fetchData();
    }, []);

    const fetchConfirmReport = async () => {
        try {
            const response = await fetch(`http://localhost:3004/report/item/${children.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isChecked: true }),
            });

            const data = await response.json();
            if (response.ok) {
                await fetchBannedRoadmap();
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchDeleteReport = async () => {
        try {
            const response = await fetch(`http://localhost:3004/report/item/${children.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchBannedRoadmap = async () => {
        try {
            const response = await fetch(`http://localhost:3004/report/ban/${children.roadmap.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Banned', data);
                if (data.message === 'Ban roadmap successfully') {
                    await fetchNewNotification(children.roadmap.title, 'Blocked');
                } else {
                    await fetchNewNotification(children.roadmap.title, 'Report');
                }
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };

    const fetchNewNotification = async (roadmapName, type) => {
        try {
            const body = new URLSearchParams({
                title: roadmapName + type === 'Blocked' ? ' have been banned.' : ' have been reported.',
                content:
                    type === 'Blocked'
                        ? 'Due to community standards violation, your roadmap has been deleted.'
                        : 'Your Roadmap has been reported for community standards, please take note.',
                type: type,
                posterId: profile,
                receiverId: children.receive.id,
                isCheck: 0,
                isActive: 1,
            }).toString();
            const response = await fetch('http://localhost:3004/notification/new', {
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
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    console.log("Child: ", children)

    return (
        <div className={cx('wrapper')}>
            <div className={cx('roadmap')}>
                <img
                    className={cx('roadmap-avatar')}
                    src={
                        children.roadmap.avatar
                            ? children.roadmap.avatar.substring(0, children.roadmap.avatar.indexOf('.jpg') + 4)
                            : ''
                    }
                    alt={children.roadmap.avatar ? 'Roadmap avatar' : 'Default avatar'}
                    onClick={() => {
                        const encryptedId = encryptId(children.roadmap.id);
                        navigate(`/roadmap/${encryptedId}`);
                    }}
                />
                <h1
                    className={cx('roadmap-name')}
                    onClick={() => {
                        const encryptedId = encryptId(children.roadmap.id);
                        navigate(`/roadmap/${encryptedId}`);
                    }}
                >{children.roadmap.title}</h1>
            </div>
            <h1
                className={cx('sender')}
                onClick={() => {
                    const encryptedId = encryptId(children.roadmap.id);
                    navigate(`/account/${encryptedId}`);
                }}
            >{children.reporter.fullName}
            </h1>
            <h1 className={cx('date')}>{children.createdAt.substring(0, 10)}</h1>
            <div className={cx('descrip-container')}>
                <h1 className={cx('description')}>{children.content}</h1>
                <div className={cx('report-response')}>
                    <FontAwesomeIcon
                        className={cx('confirm')}
                        icon={faCheck}
                        onClick={async () => {
                            await fetchConfirmReport();
                            //window.location.reload();
                        }}
                    />
                    <FontAwesomeIcon
                        className={cx('deny')}
                        icon={faXmark}
                        onClick={async () => {
                            await fetchDeleteReport();
                            //window.location.reload();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ReportItem;
