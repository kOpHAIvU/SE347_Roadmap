import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function HeaderLogged() {
    return <div className={cx('wrapper')}>
        <div className={cx('inner')}>
            <img src={images.logo} alt="VertexOps" width="46" height="46"/>
        </div>
    </div>;
}

export default HeaderLogged;