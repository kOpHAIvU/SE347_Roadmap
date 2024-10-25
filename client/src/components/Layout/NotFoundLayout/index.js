import styles from './NotFoundLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotFoundLayout() {
    return <div className={cx('wrapper')}>
        <img src='https://us-tuna-sounds-images.voicemod.net/b962568b-a0e4-4ccc-b041-2f230293d740-1661361350797.jpg' alt='Not Found'/>
    </div>;
}

export default NotFoundLayout;