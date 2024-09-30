import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AccountItem.module.scss';
import classNames from 'classnames/bind';
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);


function AccountItem() {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('roadmap-pic')}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY9rbnfWjDYgEV05aJ1t2yAZNbABSafruYSQ&s"
            />
            <div className={cx('info')}>
                <p className={cx('roadmap-name')}>
                    <span>GitHub from A-Z</span>
                </p>
                <div className={cx('line-two')}>
                    <span className={cx('author-name')}>KoPhaiVu</span>
                    <div>
                        <span className={cx('count')}>1.000 clones</span>
                        <FontAwesomeIcon className={cx('clones-icon')} icon={faBoltLightning}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountItem;