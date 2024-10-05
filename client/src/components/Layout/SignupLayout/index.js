import Header from '../components/HeaderGuest/index.js';
import Main from '../components/Signup/index.js';

import styles from './SignupLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SignupLayout({ children }) {
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

export default SignupLayout;