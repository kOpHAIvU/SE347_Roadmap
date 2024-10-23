import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './CommentItem.module.scss';
import classNames from 'classnames/bind';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function CommentItem({ key, children }) {

    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                alt='avatar'
                src={children.avatar} />
            <div className={cx('cmt-infor')}>
                <div className={cx('cmt-status')}>
                    <h1 className={cx('cmt-author')}>{children.poster}</h1>
                    <span className={cx('cmt-date')}>{children.day}</span>
                </div>
                <h2 className={cx('cmt-content')}>{children.content}</h2>
            </div>

            <FontAwesomeIcon
                icon={faTrashCan}
                className={cx('delete-cmt')} />

        </div>
    );
}

export default CommentItem;