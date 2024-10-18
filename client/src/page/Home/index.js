import RoadmapItem from '~/components/Layout/components/RoadmapItem/index.js';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Home() {
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

export default Home;
