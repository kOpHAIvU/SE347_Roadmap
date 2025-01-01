import styles from './UpgradeAccount.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function UpgradeAccount() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('pack-container')}>
                <div className={cx('header')}>
                    <p className={cx('title')}>
                        Pro edition
                    </p>
                    <div className={cx('price-container')}>
                        <span>$</span>5
                        <span>/frv</span>
                    </div>
                </div>
                <div>
                    <ul className={cx('lists')}>
                        <li className={cx('list')}>
                            <span>
                                <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round"></path>
                                </svg>
                            </span>
                            <p>Maximum 15 roadmaps</p>
                        </li>
                        <li className={cx('list')}>
                            <span>
                                <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round"></path>
                                </svg>
                            </span>
                            <p>
                                Maximum 20 timelines
                            </p>
                        </li>
                        <li className={cx('list')}>
                            <span>
                                <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round"></path>
                                </svg>
                            </span>
                            <p>
                                Unlimited timeline usage
                            </p>
                        </li>
                    </ul>
                </div>
                <div className={cx('button-container')}>
                    <button type="button">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpgradeAccount;
