import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { Menu } from 'antd';
import { HomeOutlined, BranchesOutlined, LaptopOutlined, HeartFilled } from '@ant-design/icons';
import images from '~/assets/images/index.js';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles);

function Sidebar({ collapsed }) {
    const navigate = useNavigate();  // Khởi tạo navigate

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
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('link')}>
                <img src={images.logo} alt="VertexOps" className={cx('logo')} />
                <h1 className={cx('web-name', { hidden: collapsed })}>VertexOps</h1>
            </div>
            <Menu
                theme='light'
                mode='inline'
                className={cx('menu')}
                onClick={handleMenuClick}>
                <Menu.Item className={cx('item')} key="home" icon={<HomeOutlined className={cx('icon')} />}>Home</Menu.Item>
                <Menu.Item className={cx('item')} key="your-timeline" icon={<BranchesOutlined className={cx('icon')} />}>Your Timeline</Menu.Item>
                <Menu.Item className={cx('item')} key="your-roadmap" icon={<LaptopOutlined className={cx('icon')} />}>Your Roadmap</Menu.Item>
                <Menu.Item className={cx('item')} key="favourite" icon={<HeartFilled className={cx('icon')} />}>Your Favourite</Menu.Item>
            </Menu>
        </div>
    );
}

export default Sidebar;