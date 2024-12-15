import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Timeline.module.scss';

const cx = classNames.bind(styles);


function Timeline({ children, setVisible }) {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}
            onClick={(event) => {
                event.stopPropagation();
                navigate(`/timeline/${children.id}`);
                setVisible(false);
            }}
        >
            <img
                className={cx('roadmap-pic')}
                src={children.avatar}
            />
            <div className={cx('info')}>
                <p className={cx('roadmap-name')}>
                    <span>{children.title}</span>
                </p>
                <div className={cx('line-two')}>
                    <span className={cx('author-name')}>{children.author}</span>
                    <div>
                        <span className={cx('count')}>{children.contributors} contributors</span>
                        <FontAwesomeIcon className={cx('clones-icon')} icon={faUser} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Timeline;