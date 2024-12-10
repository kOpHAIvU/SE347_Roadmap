import HeaderGuest from '../components/HeaderGuest/index.js';
import Footer from '../components/Footer/index.js';
import styles from './MainScreenLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MainScreenLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <HeaderGuest />
            <main className={cx('main')}>{children}</main>

            <Footer />
        </div>
    );
}

export default MainScreenLayout;
