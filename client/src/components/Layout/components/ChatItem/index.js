import classNames from 'classnames/bind';
import styles from './ChatItem.module.scss';

const cx = classNames.bind(styles);

function ChatItem({ children }) {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                alt='avatar'
                src={children.avatar} />
            <div className={cx('send-info')}>
                <div className={cx('sender-infor')}>
                    <h1 className={cx('username')}>{children.user}</h1>
                    <span className={cx('date-send')}>{children.date}</span>
                </div>
                <span className={cx('content')}>{children.content}</span>
            </div>
        </div>
    );
}

export default ChatItem;