import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ReportItem.module.scss';
import classNames from 'classnames/bind';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ReportItem() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('roadmap')}>
                <img
                    className={cx('roadmap-avatar')}
                    src='https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp' />
                <h1 className={cx('roadmap-name')}>Haha</h1>
            </div>
            <h1 className={cx('sender')}>KoPhaiVu</h1>
            <h1 className={cx('date')}>11/12/2024</h1>
            <div className={cx('descrip-container')}>
                <h1 className={cx('description')}>Whaooo</h1>
                <div className={cx('report-response')}>
                    <FontAwesomeIcon className={cx('confirm')} icon={faCheck} />
                    <FontAwesomeIcon className={cx('deny')} icon={faXmark} />
                </div>
            </div>
        </div>
    );
}

export default ReportItem;