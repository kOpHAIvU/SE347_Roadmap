import { Button } from 'antd';
import classNames from 'classnames/bind';
import styles from './MenuItem.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    return (
        <div className={cx('menu-item')} onClick={onClick}>
            <span className={cx('icon')}>{data.icon}</span>
            <span className={cx('title')}>{data.title}</span>
        </div>
    );
}

export default MenuItem;
