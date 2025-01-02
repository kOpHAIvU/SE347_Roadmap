import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Roadmap.module.scss';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function Roadmap({ children, setVisible }) {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}
            onClick={(event) => {
                event.stopPropagation();
                const encryptedId = encryptId(children.id);
                navigate(`/roadmap/${encryptedId}`);
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
                    <span className={cx('author-name')}>"Hehe"</span>
                    <div>
                        <span className={cx('count')}>{children.clone} clones</span>
                        <FontAwesomeIcon className={cx('clones-icon')} icon={faBoltLightning} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Roadmap;