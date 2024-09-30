import Header from '../components/HeaderGuest/index.js';


import styles from './MainScreenLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MainScreenLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            
        </div>
    );
}

export default MainScreenLayout;