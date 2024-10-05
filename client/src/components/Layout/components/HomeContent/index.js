import RoadmapItem from '../RoadmapItem/index.js';
import styles from './HomeContent.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function HomeContent() {
    console.log('Rendering HomeContent');

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('page-title')}>Recommended Roadmaps</h1>
            <div className={cx('container')} >
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
                <RoadmapItem />
            </div>
        </div>
    );
}

export default HomeContent;
