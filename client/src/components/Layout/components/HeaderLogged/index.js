import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/index.js';

const cx = classNames.bind(styles);

function HeaderLogged() {
    return <div className={cx('wrapper')}>
        <div className={cx('inner')}>
            <div className={cx('link')}>
                <button className={cx('navigation-btn')}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cx('logo')}>
                    <img src={images.logo} alt="VertexOps" />
                </div>
                <h1 className={cx('web-name')}>VertexOps</h1>
            </div>

            <Search />

            <div className={cx('right-header')}>
                <button className={cx('add-roadmap')}>
                    <FontAwesomeIcon className={cx('plus-icon')} icon={faPlus} />
                    <h1>Create your own map</h1>
                </button>
                <img className={cx('avatar')} src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="Avatar"/>
            </div>
        </div>
    </div>;
}

export default HeaderLogged;