
import styles from './HeaderGuest.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';


const cx = classNames.bind(styles);

function HeaderGuest() {
    return <div className={cx('wrapper')}>
        <div className={cx('inner')}>
            <div className={cx('link')}>

                <div className={cx('logo')}>
                    <img src={images.logo} alt="VertexOps" />
                </div>

                <h1 className={cx('web-name')}>VertexOps</h1>

            </div>

            <div className={cx('right-header')}>
                <button className={cx('login-btn')}>
                        <h1>Log in</h1>
                </button>
                
            </div>
        </div>
    </div>;
}

export default HeaderGuest;