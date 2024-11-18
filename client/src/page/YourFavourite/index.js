import RoadmapItem from '~/components/Layout/components/RoadmapItem/index.js';
import styles from './YourFavourite.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function YourFavourite() {
    const navigate = useNavigate();

    let source = "https://i.ebayimg.com/images/g/XI0AAOSw~HJker7R/s-l1200.jpg"
    // Đặt roadmaps trong state để có thể cập nhật
    const [roadmaps, setRoadmaps] = useState([
        {
            id: 0,
            title: 'CSS cơ bản',
            content: 'CSS là chữ viết tắt của Cascading Style Sheets là ngôn ngữ để tìm và định dạng lại các phần tử được tạo ra bởi các ngôn ngữ đánh dấu (HTML)',
            clones: 123,
            avatar: source,
            authentication: 'Owner',
            loved: true
        },
        {
            id: 1,
            title: 'HTML cơ bản',
            content: 'HTML là một ngôn ngữ đánh dấu được thiết kế ra để tạo nên các trang web trên World Wide Web. Nó có thể được trợ giúp bởi các công nghệ như CSS và các ngôn ngữ kịch bản giống như JavaScript. ',
            clones: 123,
            avatar: source,
            authentication: 'Owner',
            loved: true
        },
        {
            id: 2,
            title: 'Javascript cơ bản',
            content: 'JavaScript là ngôn ngữ lập trình được nhà phát triển sử dụng để tạo trang web tương tác.',
            clones: 123,
            avatar: source,
            authentication: 'User',
            loved: true
        },
        {
            id: 3,
            title: 'Github cơ bản',
            content: 'KoPhaiVu',
            clones: 123,
            avatar: source,
            authentication: 'Owner',
            loved: true
        },
    ]);

    const handleLoveChange = (id) => {
        setRoadmaps((prevRoadmaps) => {
            const updatedRoadmaps = prevRoadmaps.map((roadmap) =>
                roadmap.id === id ? { ...roadmap, loved: !roadmap.loved } : roadmap
            );

            // Xóa các roadmap có loved === false
            return updatedRoadmaps.filter((roadmap) => roadmap.loved);
        });
    };

    const handleClickRoadmap = (id) => {
        navigate(`/roadmap/${id}`); // Điều hướng tới /roadmap/{id}
    };

    const handleDeleteRoadmap = (id) => {
        setRoadmaps((prevRoadmaps) => prevRoadmaps.filter((roadmap) => roadmap.id !== id));
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Your favourite Roadmaps</h1>
            <div className={cx('container')} >
                {roadmaps.map((roadmap) => {
                    return <RoadmapItem
                        key={roadmap.id}
                        children={roadmap}
                        onLoveChange={() => handleLoveChange(roadmap.id)}
                        onClick={() => handleClickRoadmap(roadmap.id)}
                        onDelete={() => handleDeleteRoadmap(roadmap.id)}
                    />
                })}
            </div>
        </div>
    );
}

export default YourFavourite;