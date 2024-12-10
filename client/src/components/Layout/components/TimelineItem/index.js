import styles from './TimelineItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function TimelineItem({ children, onClick }) {
    // Thêm biến progressValue
    const [progressValue, setProgressValue] = useState(80); // Giá trị từ 0 đến 100

    const backgroundGradient = `linear-gradient(
        to right,
        #6580eb ${Math.max(progressValue - 10, 0)}%,
        rgba(101, 128, 235, 0.7) ${progressValue}%,
        rgba(255, 255, 255, 0.7) ${Math.min(progressValue + 10, 100)}%,
        #ffffff 100%
    )`;

    return (
        <div className={cx('wrapper')} onClick={onClick}>
            <div className={cx('container')}>
                <img className={cx('roadmap-pic')}
                    src={children.avatar}
                    alt="Roadmap picture" />
                <h1 className={cx('title')}>{children.title}</h1>
                <h2 className={cx('content')}>{children.content}</h2>
                <div className={cx('below')}>
                    <button className={cx('progress-btn')}
                        style={{ backgroundImage: backgroundGradient }}
                    >
                        <FontAwesomeIcon className={cx('bolt-icon')} icon={faBolt} />
                        <span className={cx('progress-title')}>
                            Progress
                        </span>
                    </button>
                    <div className={cx('clone-num')} >
                        <span className={cx('num')}>{children.contributors} contributors</span>
                        <FontAwesomeIcon className={cx('usergroup-icon')} icon={faUserGroup} />
                    </div>
                </div>
            </div>

        </div >
    );
}

export default TimelineItem;