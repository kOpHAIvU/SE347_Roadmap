import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/index.js';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const cx = classNames.bind(styles);

function HeaderLogged({ collapsed, setCollapsed }) {
    return <div className={cx('wrapper', { extend: collapsed })}>
        <div className={cx('inner')}>
            <Button
                onClick={() => setCollapsed(!collapsed)}
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                className={cx('navigation-btn')}>
            </Button>

            <Search />

            <div className={cx('right-header')}>
                <button className={cx('add-roadmap')}>
                    <FontAwesomeIcon className={cx('plus-icon')} icon={faPlus} />
                    <h1 className={cx('create-text')}>Create your own map</h1>
                </button>
                <img className={cx('avatar')} src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="Avatar" />
            </div>
        </div>

    </div>;
}

export default HeaderLogged;