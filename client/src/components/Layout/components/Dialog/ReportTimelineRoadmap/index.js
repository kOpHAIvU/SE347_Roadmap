import classNames from 'classnames/bind';
import styles from './ReportTimelineRoadmap.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ReportTimelineRoadmap({ type, profile, roadmapData, handleOutsideClick, setShowSetting, handleMakeDialog }) {
    const navigate = useNavigate();
    const [reportContent, setReportContent] = useState('');

    const getToken = () => {
        const token = localStorage.getItem('vertexToken');

        if (!token) {
            navigate(`/login`);
            return;
        }
        return token;
    };

    const fetchNewReport = async () => {
        try {
            const body = new URLSearchParams({
                title: '',
                type: type,
                content: reportContent,
                posterId: profile.id,
                receiverId: roadmapData.owner.id,
                isActive: 1,
                roadmapId: roadmapData.id,
            }).toString();

            const response = await fetch('http://50.112.48.169:3004/report/new', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Report added:', data); // Xử lý dữ liệu nếu cần
            } else {
                console.error('Failed to add favorite. Status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
                e.stopPropagation();
                handleOutsideClick(e);
            }}
        >
            <div className={cx('modal')}>
                <button className={cx('close-btn')} onClick={() => setShowSetting(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className={cx('report-header')}>
                    <FontAwesomeIcon className={cx('alert-icon')} icon={faTriangleExclamation} />
                    <h2 className={cx('form-name')}>Report {roadmapData.title}</h2>
                </div>
                <textarea
                    value={reportContent}
                    className={cx('report-content')}
                    placeholder="Report something you see."
                    onChange={(e) => setReportContent(e.target.value)}
                />
                <h1
                    className={cx('submit-form')}
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (reportContent.trim() !== '') {
                            await fetchNewReport();
                            handleMakeDialog('Report');
                            setShowSetting(false);
                        }
                    }}
                >
                    Submit
                </h1>
            </div>
        </div>
    );
}

export default ReportTimelineRoadmap;
