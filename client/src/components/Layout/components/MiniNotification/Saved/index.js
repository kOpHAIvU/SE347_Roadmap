import classNames from 'classnames/bind';
import styles from './Saved.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Saved({ handleClose }) {
    return (
        <div className={cx('container')}>
            <FontAwesomeIcon className={cx('error-icon')} icon={faCircleCheck} />
            <div className={cx('text-container')}>
                <h1 className={cx('error-title')}>Saved</h1>
                <h1 className={cx('error-content')}>Keep going my friend.</h1>
            </div>
            <FontAwesomeIcon className={cx('close-error')} icon={faXmark} onClick={handleClose} />
        </div>
    );
}

export default Saved;
