import FormLogin from '~/components/Layout/components/Login/index.js';
import styles from './Login.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Login() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')} >
                <FormLogin />
            </div>
        </div>
    );
}

export default Login;
