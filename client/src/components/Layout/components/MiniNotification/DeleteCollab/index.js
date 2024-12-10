import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faUserMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './DeleteCollab.module.scss';

const cx = classNames.bind(styles);

function DeleteCollab({ username, handleClose }) {
    return (
        <div className={cx('container')}>
            <FontAwesomeIcon className={cx('error-icon')} icon={faUserMinus} />
            <div className={cx('text-container')}>
                <h1 className={cx('error-title')}>{username} removed</h1>
                <h1 className={cx('error-content')}>{username} no longer in this timeline.</h1>
            </div>
            <FontAwesomeIcon className={cx('close-error')} icon={faXmark} onClick={() => handleClose} />
        </div>
    );
}

export default DeleteCollab;