import styles from './ReportItem.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ReportItem({ reportData, handleDelete }) {
    return (
        <div className={cx('wrapper')}>
            <img
                onClick={handleDelete}
                className={cx('roadmap-avatar')}
                src='https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp' />
            <div className={cx('title-content')}>
                <div className={cx('title')}>
                    <span className={cx('username')}>{reportData.username}</span>
                    <span> report </span>
                    <span className={cx('roadmapName')}>{reportData.roadmapName}</span>
                </div>
                <h1 className={cx('content')}>
                    {reportData.content}
                </h1>
            </div>
        </div>
    );
}

export default ReportItem;