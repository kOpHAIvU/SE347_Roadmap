import { useState } from 'react';
import Sidebar from '../components/Sidebar/index.js';
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import { Layout } from 'antd';
import HeaderLogged from '../components/HeaderLogged/index.js';
import Footer from '../components/Footer/index.js';

const cx = classNames.bind(styles);

const { Header, Sider, Content } = Layout;

function DefaultLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Layout className={cx('wrapper')}>
                <Sider collapsed={collapsed} collapsible trigger={null} className={cx('sidebar')}>
                    <Sidebar collapsed={collapsed} />
                </Sider>
                <Layout>
                    <Header className={cx('header', { collapsed: collapsed })}>
                        <HeaderLogged collapsed={collapsed} setCollapsed={setCollapsed} />
                    </Header>
                    <Content className={cx('content', { collapsed: collapsed })}>{children}</Content>
                </Layout>
            </Layout>
            <Footer />
        </>
    );
}

export default DefaultLayout;
