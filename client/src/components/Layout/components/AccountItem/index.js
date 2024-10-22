import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AccountItem.module.scss';
import classNames from 'classnames/bind';
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);


function AccountItem({ key, children }) {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('roadmap-pic')}
                src={children.avatar}
            />
            <div className={cx('info')}>
                <p className={cx('roadmap-name')}>
                    <span>{children.title}</span>
                </p>
                <div className={cx('line-two')}>
                    <span className={cx('author-name')}>{children.author}</span>
                    <div>
                        <span className={cx('count')}>{children.clones} clones</span>
                        <FontAwesomeIcon className={cx('clones-icon')} icon={faBoltLightning} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountItem;