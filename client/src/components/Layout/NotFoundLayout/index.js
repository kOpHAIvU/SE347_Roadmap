import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotFoundLayout() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
    };

    return <div className={cx('wrapper')}>
        <h1 className={cx('error')}>ERROR</h1>
        <h1 className={cx('text404')}>404</h1>
        <h1 className={cx('textNotFound')}>Page not found</h1>
        <button className={cx('btnGoHome')} onClick={handleGoHome}>Go Home</button>
    </div>;
}

export default NotFoundLayout;