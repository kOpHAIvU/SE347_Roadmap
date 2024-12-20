import FormSignup from '~/components/Layout/components/Signup/index.js';
import styles from './Signup.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Signup() {

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')} >
                <FormSignup />
            </div>
        </div>
    );
}

export default Signup;
