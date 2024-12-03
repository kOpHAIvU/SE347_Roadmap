import classNames from 'classnames/bind';
import styles from './YourTimeline.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Timeline from '../Timeline/index.js';
import TimelineItem from '~/components/Layout/components/TimelineItem/index.js';

const cx = classNames.bind(styles);

function YourTimeline() {
    const navigate = useNavigate();

    let source = "https://i.ebayimg.com/images/g/XI0AAOSw~HJker7R/s-l1200.jpg"
    // Đặt roadmaps trong state để có thể cập nhật
    const [timelines, setTimelines] = useState([
        {
            id: 0,
            title: 'CSS cơ bản',
            content: 'CSS là chữ viết tắt của Cascading Style Sheets là ngôn ngữ để tìm và định dạng lại các phần tử được tạo ra bởi các ngôn ngữ đánh dấu (HTML)',
            avatar: source,
            contributors: 3
        },
        {
            id: 1,
            title: 'HTML cơ bản',
            content: 'HTML là một ngôn ngữ đánh dấu được thiết kế ra để tạo nên các trang web trên World Wide Web. Nó có thể được trợ giúp bởi các công nghệ như CSS và các ngôn ngữ kịch bản giống như JavaScript. ',
            avatar: source,
            contributors: 1
        },
        {
            id: 2,
            title: 'Javascript cơ bản',
            content: 'JavaScript là ngôn ngữ lập trình được nhà phát triển sử dụng để tạo trang web tương tác.',
            avatar: source,
            contributors: 2
        },
        {
            id: 3,
            title: 'Github cơ bản',
            content: 'KoPhaiVu',
            avatar: source,
            contributors: 3
        },
    ]);

    const fetchTimelines = async () => {
        try {
            const response = await fetch('http://localhost:3004/roadmap/all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result.data);
            if (Array.isArray(result.data)) {
                setRoadmaps(result.data);
            } else {
                console.error("API did not return an array");
                setRoadmaps([]);
            }
        } catch (error) {
            console.log("Server is not OK");
        }
    };

    const handleClickTimeline = (id) => {
        navigate(`/timeline/${id}`);
    };
    
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