import FormResetPassword from '~/components/Layout/components/ForgotPassword/index.js';
import styles from './ForgotPassword.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ForgotPassword() {

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <FormResetPassword />
            </div>
        </div>
    );
}

export default ForgotPassword;
