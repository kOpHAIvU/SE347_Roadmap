import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import { faCircleQuestion, faFlag, faGear, faLock, faPlus, faQuestion, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/index.js';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import MenuAvatar from '../MenuAvatar/index.js';

const cx = classNames.bind(styles);
const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faGear}/>,
        title: 'Settings',
        children: {
            title: 'Settings',
            data: [
                {
                    icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faUser}/>,
                    title: 'Your account',
                    to: '/account',
                },
                {
                    icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faLock}/>,
                    title: 'Login & security',
                    to: '/security',
                },
                {
                    icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faFlag}/>,
                    title: 'Report a problem',
                    to: '/report', 
                }
            ]
        }
    },
    {
        icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faCircleQuestion}/>,
        title: 'More about Vertex',
        to: '/information'
    },
    {
        icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faRightFromBracket}/>,
        title: 'Log out',
        to: '/',
    }
];

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
                <MenuAvatar items={MENU_ITEMS}>
                    <img className={cx('avatar')} src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="Avatar" />
                </MenuAvatar>
                
            </div>
        </div>

    </div>;
}

export default HeaderLogged;