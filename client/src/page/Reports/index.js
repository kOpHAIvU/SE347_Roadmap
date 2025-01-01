import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Reports.module.scss';
import classNames from 'classnames/bind';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportItem from '~/components/Layout/components/ReportItem/index.js';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    // Thay thế ký tự đặc biệt
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function Reports() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null);
    console.log("profile: ", profile)

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
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                if (data.statusCode !== 200)
                    navigate('/login')
                if (data.data.role.name !== 'admin')
                    navigate('/home')
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchGetReportData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/report/all/owner?page=1&limit=12`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {

            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch Favorite Error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProfile();
        };
        fetchData();
    }, []);

    const [reportsData, setReportsData] = useState([
        {
            username: 'KoPhaiVu',
            roadmapName: "Hehe",
            content: 'whao'
        },
        {
            username: 'KoPhaiVinh',
            roadmapName: "Hehe",
            content: 'whao'
        },
        {
            username: 'KoPhaiLoan',
            roadmapName: "Hehe",
            content: 'whao'
        },
    ])

    const handleDelete = (idx) => {
        setReportsData((prevData) => prevData.filter((_, index) => index !== idx));
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Reports</h1>
            <div className={cx('status-numeric')}>
                <div className={cx('numeric-item')}>
                    <h1 className={cx('status-title')}>Total record</h1>
                    <h2 className={cx('report-status')}>10</h2>
                </div>
                <div className={cx('numeric-item')}>
                    <h1 className={cx('status-title')}>Solved</h1>
                    <h2 className={cx('solved-status')}>10</h2>
                </div>
                <div className={cx('numeric-item')}>
                    <h1 className={cx('status-title')}>Remain</h1>
                    <h2 className={cx('remain-status')}>10</h2>
                </div>
            </div>
            <div className={cx('report-container')}>
                <div className={cx('report-header')}>
                    <h1 className={cx('roadmap')}>Roadmap</h1>
                    <h1 className={cx('sender')}>Sender</h1>
                    <h1 className={cx('date')}>Date</h1>
                    <h1 className={cx('descrip')}>Description</h1>
                </div>
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
                <ReportItem />
            </div>
            <div className={cx('page')}>
                <h1 className={cx('page-num')}>Page 1 / 12</h1>
                <div>
                    <FontAwesomeIcon icon={faCaretLeft} className={cx('switch-page')} />
                    <FontAwesomeIcon icon={faCaretRight} className={cx('switch-page')} />
                </div>
            </div>
            <div className={cx('mini-notify')}>

            </div>
        </div>
    );
}

export default Reports;
