import { useState } from 'react';
import Sidebar from '../components/Sidebar/index.js';
import styles from './HomeLayout.module.scss';
import classNames from 'classnames/bind';
import { Layout } from 'antd';
import HeaderLogged from '../components/HeaderLogged/index.js';



const cx = classNames.bind(styles);

const { Header, Sider, Content } = Layout;

function HomeLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className={cx('wrapper')}>
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                className={cx('sidebar')}
            >
                <Sidebar collapsed={collapsed} />
            </Sider>
            <Layout >
                <Header className={cx('header')}>
                    <HeaderLogged collapsed={collapsed} setCollapsed={setCollapsed} />
                </Header>
                <Content className={cx('content')}>
                </Content>
            </Layout>
        </Layout>
    );
}

export default HomeLayout;