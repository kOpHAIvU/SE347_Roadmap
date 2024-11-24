import classNames from 'classnames/bind';
import styles from './PendingInvite.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function PendingInvite({ userType }) {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStltpfa69E9JTQOf5ZcyLGR8meBbxMFJxM0w&s" />
            <div className={cx('username-and-pending')}>
                <h2 className={cx('username')}>KoPhaiVu</h2>
                <span className={cx('pending')}>Pending Invite</span>
            </div>
            {userType === "Administrator"
                && <FontAwesomeIcon className={cx('delete')} icon={faTrashCan} />}
        </div>
    );
}

export default PendingInvite;