import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './CantClone.module.scss';

const cx = classNames.bind(styles);

function CantCloneDialog({ handleClose }) {
    return (
        <div className={cx('container')}>
            <FontAwesomeIcon className={cx('error-icon')} icon={faCircleXmark} />
            <div className={cx('text-container')}>
                <h1 className={cx('error-title')}>Can't clone</h1>
                <h1 className={cx('error-content')}>Need more than 5 nodes to clone.</h1>
            </div>
            <FontAwesomeIcon className={cx('close-error')} icon={faXmark} onClick={handleClose} />
        </div>
    );
}

export default CantCloneDialog;