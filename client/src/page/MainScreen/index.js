import MainGuest from '~/components/Layout/components/MainGuest/index.js';
import styles from './MainScreen.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MainScreen() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')} >
                <MainGuest />
            </div>
        </div>
    );
}

export default MainScreen;
