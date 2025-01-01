import styles from './Reports.module.scss';
import classNames from 'classnames/bind';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportItem from '~/components/Layout/components/ReportItem/index.js';

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
            <div className={cx('report-container')}>
                {reportsData.map((item, idx) => (
                    <ReportItem key={idx} reportData={item} handleDelete={() => handleDelete(idx)} />
                ))}
            </div>
            <div className={cx('mini-notify')}>
                
            </div>
        </div>
    );
}

export default Reports;
