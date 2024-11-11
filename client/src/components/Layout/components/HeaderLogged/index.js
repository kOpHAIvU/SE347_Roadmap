import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './HeaderLogged.module.scss';
import classNames from 'classnames/bind';
import {
    faCircleQuestion,
    faFlag,
    faGear,
    faLock,
    faPlus,
    faRightFromBracket,
    faUser,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/index.js';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import MenuAvatar from '../MenuAvatar/index.js';

const cx = classNames.bind(styles);
const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faGear} />,
        title: 'Settings',
        children: {
            title: 'Settings',
            data: [
                {
                    icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faUser} />,
                    title: 'Your account',
                    to: '/account',
                },
                {
                    icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faLock} />,
                    title: 'Login & security',
                    to: '/security',
                },
                {
                    icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faFlag} />,
                    title: 'Report a problem',
                    to: '/report',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon className={cx('setting-icon')} icon={faCircleQuestion} />,
        title: 'More about Vertex',
        to: '/information',
    },
    {
        icon: <FontAwesomeIcon className={cx('setting-icon', 'logout-icon')} icon={faRightFromBracket} />,
        title: 'Log out',
        to: '/',
    },
];

function HeaderLogged({ collapsed, setCollapsed }) {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleCreate = () => {
        if (name && description) {
            const newId = `Vincute${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
            navigate(`/roadmap/${newId}`);
            setShowForm(false);
            setName('');
            setDescription('');
        }
    };

    const handleOutsideClick = (e) => {
        if (String(e.target.className).includes('modal-overlay')) {
            setShowForm(false);
        }
    };

    return (
        <div className={cx('wrapper', { extend: collapsed })}>
            <div className={cx('inner')}>
                <Button
                    onClick={() => setCollapsed(!collapsed)}
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    className={cx('navigation-btn')}
                ></Button>

                <Search />

                <div className={cx('right-header')}>
                    <button className={cx('add-roadmap')} onClick={() => setShowForm(true)}>
                        <FontAwesomeIcon className={cx('plus-icon')} icon={faPlus} />
                        <h1 className={cx('create-text')}>Create your own map</h1>
                    </button>
                    <MenuAvatar items={MENU_ITEMS}>
                        <img
                            className={cx('avatar')}
                            src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                            alt="Avatar"
                        />
                    </MenuAvatar>
                </div>
            </div>

            {showForm && (
                <div className={cx('modal-overlay')} onClick={handleOutsideClick}>
                    <div className={cx('modal')}>
                        <button className={cx('close-btn')} onClick={() => setShowForm(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className={cx('form-name')}>Create New Roadmap</h2>

                        <div className={cx('form-group')}>
                            <label>Roadmap Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className={cx('form-group')}>
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className={cx('button-group')}>
                            <button className={cx('cancel-btn')} onClick={() => setShowForm(false)}>
                                Cancel
                            </button>

                            <button
                                className={cx('create-btn')}
                                onClick={handleCreate}
                                disabled={!name || !description}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeaderLogged;
