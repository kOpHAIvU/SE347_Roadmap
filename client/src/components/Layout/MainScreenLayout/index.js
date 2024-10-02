import Header from '../components/HeaderGuest/index.js';
import Main from '../components/MainGuest/index.js';

import styles from './MainScreenLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MainScreenLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper')}>
            <Header />
            <Main />
            <footer>
            </footer>
            </div>
        </div>
    );
}

export default MainScreenLayout;