import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Timeline.module.scss';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function Timeline({ children, setVisible }) {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}
            onClick={(event) => {
                event.stopPropagation();
                const encryptedId = encryptId(children.id);
                navigate(`/timeline/${encryptedId}`);
                setVisible(false);
            }}
        >
            <img
                className={cx('roadmap-pic')}
                src={children.avatar ? children.avatar.substring(0, children.avatar.indexOf('.jpg') + 4) : ''}
            />
            <div className={cx('info')}>
                <p className={cx('roadmap-name')}>
                    <span>{children.title}</span>
                </p>
                <div className={cx('line-two')}>
                    <span className={cx('author-name')}>{children.creator.fullName}</span>
                    {/* <div>
                        <span className={cx('count')}>{children.contributors} contributors</span>
                        <FontAwesomeIcon className={cx('clones-icon')} icon={faUser} />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Timeline;