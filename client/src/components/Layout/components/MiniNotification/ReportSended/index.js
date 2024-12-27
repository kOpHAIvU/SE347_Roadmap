import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ReportSended.module.scss';

const cx = classNames.bind(styles);

function ReportSended({ handleClose }) {

    return (
        <div className={cx('container')}>
            <FontAwesomeIcon className={cx('error-icon')} icon={faBug} />
            <div className={cx('text-container')}>
                <h1 className={cx('error-title')}>Report has been sent</h1>
                <h1 className={cx('error-content')}>Please report any other violations to us.</h1>
            </div>
            <FontAwesomeIcon className={cx('close-error')} icon={faXmark} onClick={() => handleClose} />
        </div>
    );
}

export default ReportSended;