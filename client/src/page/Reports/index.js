import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Reports.module.scss';
import classNames from 'classnames/bind';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportItem from '~/components/Layout/components/ReportItem/index.js';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Reports() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null);
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [totalRecord, setTotalRecord] = useState(0)
    const [totalCheck, setTotalCheck] = useState(0)
    const [remain, setRemain] = useState(0)

    const [reports, setReports] = useState([])

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
            const response = await fetch('http://50.112.48.169:3004/auth/profile', {
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
            const response = await fetch(`http://50.112.48.169:3004/report/all?page=${currentPageNumber}&limit=6`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setTotalRecord(data.data.totalRecord)
                setTotalCheck(data.data.totalCheck)
                setRemain(data.data.totalRecord - data.data.totalCheck)
                setReports(data.data.reports)
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
            await fetchGetReportData();
        };
        fetchData();
    }, []);

    const toNextPage = async () => {
        const maxPage = Math.floor(remain / 8) + 1;
        if (currentPageNumber <= maxPage) {
            setCurrentPageNumber((prev) => prev + 1);
        }
    }

    const toPrevPage = async () => {
        if (currentPageNumber > 1) {
            setCurrentPageNumber((prev) => prev - 1);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchGetReportData();
        }
        fetchData();
    }, [currentPageNumber])

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Reports</h1>
            <div className={cx('status-numeric')}>
                <div className={cx('numeric-item')}>
                    <h1 className={cx('status-title')}>Total record</h1>
                    <h2 className={cx('report-status')}>{totalRecord}</h2>
                </div>
                <div className={cx('numeric-item')}>
                    <h1 className={cx('status-title')}>Solved</h1>
                    <h2 className={cx('solved-status')}>{totalCheck}</h2>
                </div>
                <div className={cx('numeric-item')}>
                    <h1 className={cx('status-title')}>Remain</h1>
                    <h2 className={cx('remain-status')}>{remain}</h2>
                </div>
            </div>
            <div className={cx('report-container')}>
                <div className={cx('report-header')}>
                    <h1 className={cx('roadmap')}>Roadmap</h1>
                    <h1 className={cx('sender')}>Sender</h1>
                    <h1 className={cx('date')}>Date</h1>
                    <h1 className={cx('descrip')}>Description</h1>
                </div>
                {reports && reports.length > 0 && (
                    reports.map((item) => {
                        return <ReportItem key={item.id} children={item} profile={profile} />;
                    })
                )}
            </div>
            <div className={cx('page')}>
                <h1 className={cx('page-num')}>Page {currentPageNumber} / {Math.floor(remain / 8) + 1}</h1>
                <div>
                    <FontAwesomeIcon
                        icon={faCaretLeft}
                        className={cx('switch-page', { disabled: currentPageNumber === 1 })}
                        onClick={toPrevPage} />
                    <FontAwesomeIcon
                        icon={faCaretRight}
                        className={cx('switch-page', { disabled: currentPageNumber === Math.floor(remain / 8) + 1 })}
                        onClick={toNextPage} />
                </div>
            </div>
            <div className={cx('mini-notify')}>

            </div>
        </div>
    );
}

export default Reports;
