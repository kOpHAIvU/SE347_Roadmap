import classNames from 'classnames/bind';
import styles from './ChatItem.module.scss';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const secretKey = 'kophaivu'; // Khóa bí mật

// Hàm mã hóa
const encryptId = (id) => {
    let encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function ChatItem({ children }) {
    const navigate = useNavigate()

    const handleToAcount = () => {
        const encryptedId = encryptId(children.userId);
        navigate(`/account/${encryptedId}`);
    }

    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                alt='avatar'
                src={children.avatar}
                onClick={handleToAcount} />
            <div className={cx('send-info')}>
                <div className={cx('sender-infor')}>
                    <h1 className={cx('username')} onClick={handleToAcount}>{children.user}</h1>
                    <span className={cx('date-send')}>{children.date}</span>
                </div>
                <span className={cx('content')}>{children.content}</span>
            </div>
        </div>
    );
}

export default ChatItem;