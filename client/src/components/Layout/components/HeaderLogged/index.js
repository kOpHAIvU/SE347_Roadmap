import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import { faCircleQuestion, faGear, faPlus, faQuestion, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/index.js';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import MenuAvatar from '../MenuAvatar/index.js';

const cx = classNames.bind(styles);
const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faGear}/>,
        title: 'Settings',
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion}/>,
        title: 'More about Vertex',
    },
    {
        icon: <FontAwesomeIcon icon={faRightFromBracket}/>,
        title: 'Log out',
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