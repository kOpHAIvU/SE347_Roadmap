import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './NewCollab.module.scss';

const cx = classNames.bind(styles);

function NewCollab({ username, handleClose }) {
    return (
        <div className={cx('container')}>
            <FontAwesomeIcon className={cx('user-added')} icon={faUserPlus} />
            <div className={cx('text-container')}>
                <h1 className={cx('error-title')}>Pending {username}</h1>
                <h1 className={cx('error-content')}>Wait for {username} response.</h1>
            </div>
            <FontAwesomeIcon className={cx('close-error')} icon={faXmark} onClick={() => handleClose} />
        </div>
    );
}

export default NewCollab;