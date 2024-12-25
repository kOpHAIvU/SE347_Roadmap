import classNames from 'classnames/bind';
import styles from './YourTimeline.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TimelineItem from '~/components/Layout/components/TimelineItem/index.js';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    // Thay thế ký tự đặc biệt
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const formatTimelineData = (data, src) => {
    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(item => {
        return {
            id: item.id,
            title: item.title,
            content: item.content,
            avatar: src,
            contributors: 3
        }
    })
}

function YourTimeline() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [timelines, setTimelines] = useState([]);

    let source = "https://i.ebayimg.com/images/g/XI0AAOSw~HJker7R/s-l1200.jpg"

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
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                return data.data;
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
        }
    };

    const fetchTimelineData = async () => {
        try {
            const response = await fetch('http://localhost:3004/timeline/all?page=1&limit=20', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                return formatTimelineData(data.data, source);
            } else {
                console.error('Error:', data.message || 'Failed to fetch profile data.');
            }
        } catch (error) {
            console.error('Fetch Roadmap Error:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchTimelineData();
            if (data) {
                setTimelines(data);
                console.log("Timeline after fetch: ", data)
            }
        };
        fetchData();
    }, []);

    // // Đặt roadmaps trong state để có thể cập nhật
    // const [timelines, setTimelines] = useState([
    //     {
    //         id: 0,
    //         title: 'CSS cơ bản',
    //         content: 'CSS là chữ viết tắt của Cascading Style Sheets là ngôn ngữ để tìm và định dạng lại các phần tử được tạo ra bởi các ngôn ngữ đánh dấu (HTML)',
    //         avatar: source,
    //         contributors: 3
    //     },
    //     {
    //         id: 1,
    //         title: 'HTML cơ bản',
    //         content: 'HTML là một ngôn ngữ đánh dấu được thiết kế ra để tạo nên các trang web trên World Wide Web. Nó có thể được trợ giúp bởi các công nghệ như CSS và các ngôn ngữ kịch bản giống như JavaScript. ',
    //         avatar: source,
    //         contributors: 1
    //     },
    //     {
    //         id: 2,
    //         title: 'Javascript cơ bản',
    //         content: 'JavaScript là ngôn ngữ lập trình được nhà phát triển sử dụng để tạo trang web tương tác.',
    //         avatar: source,
    //         contributors: 2
    //     },
    //     {
    //         id: 3,
    //         title: 'Github cơ bản',
    //         content: 'KoPhaiVu',
    //         avatar: source,
    //         contributors: 3
    //     },
    // ]);

    const handleClickTimeline = (id) => {
        const encryptedId = encryptId(id);
        navigate(`/timeline/${encryptedId}`);
    };

    console.log(encryptId(7))

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Your Timeline</h1>
            <div className={cx('container')} >
                {timelines.map((timeline) => {
                    return <TimelineItem
                        key={timeline.id}
                        children={timeline}
                        onClick={() => handleClickTimeline(timeline.id)}
                    />
                })}
            </div>
        </div>
    );
}

export default YourTimeline;