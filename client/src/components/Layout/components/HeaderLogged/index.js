import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/index.js';

const cx = classNames.bind(styles);

function HeaderLogged() {
    return <div className={cx('wrapper')}>
        <div className={cx('inner')}>
            <button className={cx('navigation-btn')}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            <div className={cx('logo')}>
                <img src={images.logo} alt="VertexOps" />
                <h1 className={cx('web-name')}>VertexOps</h1>
            </div>

            <Search />

        </div>
    </div>;
}

export default HeaderLogged;