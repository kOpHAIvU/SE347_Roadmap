import styles from './RoadmapItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCircleDown, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react';

const cx = classNames.bind(styles);

function RoadmapItem({ key, children, onLoveChange }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <img className={cx('roadmap-pic')}
                    src={children.avatar}
                    alt="Roadmap picture" />
                <h1 className={cx('title')}>{children.title}</h1>
                <h2 className={cx('content')}>{children.content}</h2>
                <div className={cx('below')}>
                    <button className={cx('clone-btn')}>
                        <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                        <span className={cx('clone-title')}>Clone</span>
                    </button>
                    <FontAwesomeIcon
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện lan truyền lên container
                            onLoveChange();  // Gọi hàm cập nhật trạng thái
                        }}
                        icon={children.loved ? faSolidHeart : faHeart}
                        className={cx('love')} />
                    <div className={cx('clone-num')}>
                        <span className={cx('num')}>{children.clones} clones</span>
                        <FontAwesomeIcon className={cx('bolt-icon')} icon={faBolt} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoadmapItem;
