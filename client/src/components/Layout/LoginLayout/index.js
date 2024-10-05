import Header from '../components/HeaderGuest/index.js';
import Main from '../components/Login/index.js';

import styles from './LoginLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function LoginLayout({ children }) {
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

export default LoginLayout;