import { useState } from 'react';
import Sidebar from '../components/Sidebar/index.js';
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';
import { Layout } from 'antd';
import HeaderLogged from '../components/HeaderLogged/index.js';
import HomeContent from '../components/HomeContent/index.js';
import { Route, Routes } from 'react-router-dom';
import RoadmapContent from '../components/RoadmapContent/index.js';

const cx = classNames.bind(styles);

const { Header, Sider, Content } = Layout;

function DefaultLayout() {
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
                <Header className={cx('header', { collapsed: collapsed })}>
                    <HeaderLogged collapsed={collapsed} setCollapsed={setCollapsed} />
                </Header>
                <Content className={cx('content', { collapsed: collapsed })}>
                    <Routes>
                        <Route path="/home" element={<div>Hi</div>} />
                        <Route path="/roadmap/1" element={<RoadmapContent />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default DefaultLayout;