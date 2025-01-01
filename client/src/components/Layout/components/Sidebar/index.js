import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { Menu } from 'antd';
import { HomeOutlined, BranchesOutlined, LaptopOutlined, HeartFilled, CloudUploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import images from '~/assets/images/index.js';
import { useLocation, useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles);

function Sidebar({ collapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (e) => {
        // Điều hướng đến URL tương ứng với key của menu
        if (e.key === 'home') {
            navigate('/home');
        } else if (e.key === 'your-timeline') {
            navigate('/timeline');
        } else if (e.key === 'your-roadmap') {
            navigate('/your_roadmap');
        } else if (e.key === 'favourite') {
            navigate('/favourite');
        } else if (e.key === 'upgrade') {
            navigate('/upgrade');
        } else if (e.key === 'reportRoadmap') {
            navigate('/reportRoadmap');
        }
    };

    const selectedKey = () => {
        if (location.pathname.startsWith('/home')) return 'home';
        if (location.pathname.startsWith('/timeline')) return 'your-timeline';
        if (location.pathname.startsWith('/your_roadmap')) return 'your-roadmap';
        if (location.pathname.startsWith('/favourite')) return 'favourite';
        if (location.pathname.startsWith('/upgrade')) return 'upgrade';
        if (location.pathname.startsWith('/reportRoadmap')) return 'reportRoadmap';
        return ''; // Không có mục nào được chọn
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('link')} onClick={() => navigate('/home')}>
                <img src={images.logo} alt="VertexOps" className={cx('logo')} />
                <h1 className={cx('web-name', { hidden: collapsed })}>VertexOps</h1>
            </div>
            <Menu
                theme='light'
                mode='inline'
                className={cx('menu')}
                onClick={handleMenuClick}
                selectedKeys={[selectedKey()]}>
                <Menu.Item className={cx('item')} key="home" icon={<HomeOutlined className={cx('icon')} />}>
                    Home
                </Menu.Item>
                <Menu.Item className={cx('item')} key="your-timeline" icon={<BranchesOutlined className={cx('icon')} />}>
                    Your Timeline
                </Menu.Item>
                <Menu.Item className={cx('item')} key="your-roadmap" icon={<LaptopOutlined className={cx('icon')} />}>
                    Your Roadmap
                </Menu.Item>
                <Menu.Item className={cx('item')} key="favourite" icon={<HeartFilled className={cx('icon')} />}>
                    Your Favourite
                </Menu.Item>
                <div className={cx('divider')} />
                <Menu.Item className={cx('item')} key="upgrade" icon={<CloudUploadOutlined className={cx('icon')} />}>
                    Upgrade account
                </Menu.Item>
                <Menu.Item className={cx('item')} key="reportRoadmap" icon={<ExclamationCircleOutlined className={cx('icon')} />}>
                    Reports
                </Menu.Item>
            </Menu>
        </div>
    );
}

export default Sidebar;