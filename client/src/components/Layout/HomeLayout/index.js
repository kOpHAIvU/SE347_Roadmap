import Header from '../components/HeaderLogged/index.js';
import MainSection from '../components/MainSection/index.js';
import Navigation from '../components/Navigation/index.js';
import styles from './HomeLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function HomeLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className="container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

export default HomeLayout;