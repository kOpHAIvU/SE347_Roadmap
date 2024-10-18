import styles from './RoadmapItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCircleDown, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react';

const cx = classNames.bind(styles);

function RoadmapItem() {
    const [loveState, setLoveState] = useState(false);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <img className={cx('roadmap-pic')}
                    src="https://i.ebayimg.com/images/g/XI0AAOSw~HJker7R/s-l1600.webp"
                    alt="Roadmap picture" />
                <h1 className={cx('title')}>Github</h1>
                <h2 className={cx('content')}>GitHub là một dịch vụ cung cấp kho lưu trữ mã nguồn Git dựa trên nền web cho các dự án ph...</h2>
                <div className={cx('below')}>
                    <button className={cx('clone-btn')}>
                        <FontAwesomeIcon className={cx('clone-icon')} icon={faCircleDown} />
                        <span className={cx('clone-title')}>Clone</span>
                    </button>
                    <FontAwesomeIcon   
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện lan truyền lên container
                            setLoveState(!loveState)
                        }} 
                        icon={loveState ? faSolidHeart : faHeart} 
                        className={cx('love')} />
                    <div className={cx('clone-num')}>
                        <span className={cx('num')}>10,7k clones</span>
                        <FontAwesomeIcon className={cx('bolt-icon')} icon={faBolt} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoadmapItem;
