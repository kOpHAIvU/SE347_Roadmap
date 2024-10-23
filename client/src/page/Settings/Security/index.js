import React from 'react';
import classNames from 'classnames/bind';
import styles from './Sercurity.module.scss';
import SettingItem from '~/components/Layout/components/SettingItem';

const cx = classNames.bind(styles);

// Dữ liệu tài khoản
const SERCURITY_ITEM = [
    {
        sercurity: true,
        label: 'Login',
        value: {
            label: 'Password',
            content_header: 'How you log into VertexOps',
            content: 'To add a password to your account for the first time, you will need to use the password reset page so we can verify your identity.',
            logo: 'https://img.icons8.com/?size=100&id=59825&format=png&color=000000'
        },
    },
    {
        sercurity: true,
        label: 'Sercurity',
        value: 'Sign out from all devices\n Logged in on a shared device but forgot to sign out? End all sessions by signing out from all devices.',
        button: 'Sign out from all devices'
    },
    {
        sercurity: true,
        label: 'Delete your account',
        value: '  By deleting your account, you’ll no longer be able to access any of your designs or log in to VertexOps. Your VertexOps account was created at 01:22 AM, Oct 17, 2024.',
        button: 'Sign out from all devices'
    },
];

const Sercurity = () => {
  return (
    <div className={cx('wrapper')}>
      <h1>Login & Sercurity</h1>
      {SERCURITY_ITEM.map((item, index) => (
        <SettingItem key={index} item={item} />
      ))}
    </div>
  );
};

export default Sercurity;
